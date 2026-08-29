<?php
// ============================================================
// SARMS LMS — api/lms_migrate.php
// One-time (but safely re-runnable) backfill: copies users,
// classes, subjects, scores out of the sarms_data JSON blob into
// the normalized tables created by sql/003_lms_models.sql.
//
// Required before any LMS API (courses, enrollment, etc.) can do
// anything real — they need actual rows to point foreign keys at.
//
// Safe to re-run: each blob record gets a legacy_id column on its
// normalized row; on re-run, anything already migrated (matched by
// legacy_id) is left untouched rather than re-inserted or
// overwritten, so it won't clobber edits made directly in the
// normalized tables after the first run.
//
// Passwords: the blob stores them in plaintext (confirmed in
// Phase 1). This script bcrypt-hashes them into password_hash on
// the way in — the first real step toward the auth fix planned in
// MIGRATION_PLAN.md §4 step 5. It does NOT wire up server-side
// login yet (the frontend still does its own client-side check) —
// that is still a separate, later step, not silently included here.
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'sarms_db');

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    return $pdo;
}

function respond($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readSlice(string $key): array {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute([$key]);
    $raw = $stmt->fetchColumn();
    if ($raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function ensureLmsTablesExist(): void {
    // Guard: give a clear error instead of a cryptic SQL exception if
    // Phase 3's migration hasn't been run yet.
    $stmt = db()->query("SHOW TABLES LIKE 'users'");
    if (!$stmt->fetch()) {
        respond(['error' => 'Normalized tables not found. Run sql/003_lms_models.sql first (Phase 3).'], 400);
    }

    // Self-heal installs whose schema predates the legacy_id columns
    // (added mid-Phase-4 to bridge the blob's string ids to these tables'
    // integer ids) — same defensive-ALTER pattern already used elsewhere
    // in this project (e.g. quizzes.php's topic column). Without this,
    // an install set up from an older copy of sql/003_lms_models.sql
    // fails the backfill with "Unknown column 'legacy_id'" instead of
    // quietly fixing itself.
    $pdo = db();
    foreach (['users', 'classes', 'subjects', 'scores'] as $table) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'legacy_id'");
        $stmt->execute([$table]);
        if ((int)$stmt->fetchColumn() === 0) {
            $pdo->exec("ALTER TABLE `$table` ADD COLUMN legacy_id VARCHAR(20) DEFAULT NULL UNIQUE
                        COMMENT 'original sarms_data blob id, for backfill traceability'");
        }
    }
}

$action = $_GET['action'] ?? 'status';

// ── STATUS — read-only, safe to call anytime, shows what would happen ──
if ($action === 'status') {
    ensureLmsTablesExist();
    $blobUsers    = readSlice('users');
    $blobClasses  = readSlice('classes');
    $blobSubjects = readSlice('subjects');
    $blobScores   = readSlice('scores');

    $counts = [];
    foreach (['users', 'classes', 'subjects', 'scores'] as $t) {
        $counts[$t] = (int) db()->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
    }

    respond([
        'blob'        => ['users' => count($blobUsers), 'classes' => count($blobClasses),
                           'subjects' => count($blobSubjects), 'scores' => count($blobScores)],
        'normalized'  => $counts,
        'readyToRun'  => true,
    ]);
}

// ── BACKFILL — the actual migration ──────────────────────────────────
if ($action === 'backfill') {
    ensureLmsTablesExist();
    $pdo = db();

    // Widen the role enum in case an earlier version of 003_lms_models.sql
    // was already run with the narrower 4-role list.
    try {
        $pdo->exec("ALTER TABLE users MODIFY role ENUM('admin','teacher','student','parent','bursar','principal') NOT NULL");
    } catch (PDOException $e) { /* already correct — fine */ }

    $summary = ['classes' => ['inserted' => 0, 'skipped' => 0],
                'subjects' => ['inserted' => 0, 'skipped' => 0],
                'users'    => ['inserted' => 0, 'skipped' => 0],
                'scores'   => ['inserted' => 0, 'skipped' => 0, 'unresolved' => 0]];

    $pdo->beginTransaction();
    try {
        // — classes —
        $classIdMap = [];
        foreach (readSlice('classes') as $c) {
            $legacyId = (string)($c['id'] ?? '');
            if ($legacyId === '') continue;
            $stmt = $pdo->prepare('SELECT id FROM classes WHERE legacy_id = ?');
            $stmt->execute([$legacyId]);
            $existingId = $stmt->fetchColumn();
            if ($existingId) { $classIdMap[$legacyId] = (int)$existingId; $summary['classes']['skipped']++; continue; }

            $pdo->prepare('INSERT INTO classes (name, level, legacy_id) VALUES (?,?,?)')
                ->execute([$c['name'] ?? 'Unnamed', $c['level'] ?? 'Junior', $legacyId]);
            $classIdMap[$legacyId] = (int)$pdo->lastInsertId();
            $summary['classes']['inserted']++;
        }

        // — subjects —
        $subjectIdMap = [];
        foreach (readSlice('subjects') as $s) {
            $legacyId = (string)($s['id'] ?? '');
            if ($legacyId === '') continue;
            $stmt = $pdo->prepare('SELECT id FROM subjects WHERE legacy_id = ?');
            $stmt->execute([$legacyId]);
            $existingId = $stmt->fetchColumn();
            if ($existingId) { $subjectIdMap[$legacyId] = (int)$existingId; $summary['subjects']['skipped']++; continue; }

            $baseCode = $s['code'] ?? substr(md5($legacyId), 0, 8);
            $code = $baseCode;
            $attempt = 0;
            // The live app's blob doesn't enforce unique subject codes (no
            // DB constraint to check against), so two subjects can genuinely
            // share a code there — e.g. "Mathematics" added twice by mistake.
            // The normalized table correctly requires uniqueness, so on a
            // real collision (a DIFFERENT subject already using this exact
            // code), disambiguate with a numeric suffix rather than losing
            // the row or failing the whole backfill over one bad row.
            while (true) {
                try {
                    $pdo->prepare('INSERT INTO subjects (name, code, legacy_id) VALUES (?,?,?)')
                        ->execute([$s['name'] ?? 'Unnamed', $code, $legacyId]);
                    break;
                } catch (PDOException $e) {
                    if ($e->getCode() !== '23000' || $attempt >= 5) throw $e;
                    $attempt++;
                    $code = $baseCode . '-' . ($attempt + 1);
                    $summary['subjects']['duplicateCodeFixed'] = ($summary['subjects']['duplicateCodeFixed'] ?? 0) + 1;
                }
            }
            $subjectIdMap[$legacyId] = (int)$pdo->lastInsertId();
            $summary['subjects']['inserted']++;
        }

        // — users (two passes: pass 1 creates rows, pass 2 resolves child_id
        //   since a parent's child may appear before or after the parent) —
        $blobUsers = readSlice('users');
        $userIdMap = [];
        foreach ($blobUsers as $u) {
            $legacyId = (string)($u['id'] ?? '');
            if ($legacyId === '' || empty($u['email'])) continue;
            $stmt = $pdo->prepare('SELECT id FROM users WHERE legacy_id = ?');
            $stmt->execute([$legacyId]);
            $existingId = $stmt->fetchColumn();
            if ($existingId) { $userIdMap[$legacyId] = (int)$existingId; $summary['users']['skipped']++; continue; }

            $role = $u['role'] ?? 'student';
            $classId = isset($u['classId']) && isset($classIdMap[(string)$u['classId']]) ? $classIdMap[(string)$u['classId']] : null;
            $passwordHash = password_hash((string)($u['password'] ?? bin2hex(random_bytes(8))), PASSWORD_BCRYPT);

            try {
                $pdo->prepare('INSERT INTO users (role, name, email, password_hash, student_id, class_id, avatar, is_active, legacy_id)
                                VALUES (?,?,?,?,?,?,?,?,?)')
                    ->execute([
                        $role, $u['name'] ?? 'Unnamed', $u['email'], $passwordHash,
                        $u['studentId'] ?? null, $classId, $u['avatar'] ?? null,
                        isset($u['isActive']) ? (int)(bool)$u['isActive'] : 1, $legacyId,
                    ]);
            } catch (PDOException $e) {
                // Unlike subject codes, an email can't be safely auto-suffixed
                // (it has to stay usable for login) — this needs the admin to
                // actually fix the duplicate email in Students/Teachers
                // management, so skip and report it rather than guessing.
                if ($e->getCode() === '23000') {
                    $summary['users']['duplicateEmailSkipped'] = ($summary['users']['duplicateEmailSkipped'] ?? []);
                    $summary['users']['duplicateEmailSkipped'][] = $u['email'];
                    continue;
                }
                throw $e;
            }
            $userIdMap[$legacyId] = (int)$pdo->lastInsertId();
            $summary['users']['inserted']++;
        }
        // pass 2: resolve child_id (parent -> student) now that all users exist
        foreach ($blobUsers as $u) {
            $legacyId = (string)($u['id'] ?? '');
            if (empty($u['childId']) || !isset($userIdMap[$legacyId]) || !isset($userIdMap[(string)$u['childId']])) continue;
            $pdo->prepare('UPDATE users SET child_id = ? WHERE id = ?')
                ->execute([$userIdMap[(string)$u['childId']], $userIdMap[$legacyId]]);
        }

        // — scores —
        foreach (readSlice('scores') as $sc) {
            $legacyId = (string)($sc['id'] ?? '');
            if ($legacyId === '') continue;
            $stmt = $pdo->prepare('SELECT id FROM scores WHERE legacy_id = ?');
            $stmt->execute([$legacyId]);
            if ($stmt->fetchColumn()) { $summary['scores']['skipped']++; continue; }

            $studentId = $userIdMap[(string)($sc['studentId'] ?? '')] ?? null;
            $subjectId = $subjectIdMap[(string)($sc['subjectId'] ?? '')] ?? null;
            $classId   = $classIdMap[(string)($sc['classId'] ?? '')] ?? null;
            if (!$studentId || !$subjectId || !$classId) { $summary['scores']['unresolved']++; continue; }

            $pdo->prepare('INSERT INTO scores (student_id, subject_id, class_id, session_name, term_name, ca, exam, comment, is_locked, entered_by, legacy_id)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?)')
                ->execute([
                    $studentId, $subjectId, $classId,
                    $sc['session'] ?? 'Unknown', $sc['term'] ?? 'Unknown',
                    $sc['ca'] ?? 0, $sc['exam'] ?? 0, $sc['comment'] ?? '',
                    isset($sc['locked']) ? (int)(bool)$sc['locked'] : 0,
                    $userIdMap[(string)($sc['enteredBy'] ?? '')] ?? null,
                    $legacyId,
                ]);
            $summary['scores']['inserted']++;
        }

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        respond(['error' => 'Backfill failed and was rolled back: ' . $e->getMessage()], 500);
    }

    respond(['ok' => true, 'summary' => $summary]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
