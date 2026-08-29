<?php
// ============================================================
// SARMS LMS — api/calendar.php
// Dynamic Academic Calendar module (Phase 2).
//
// New normalized table: academic_calendar_events.
// Audit entries are written into the existing sarms_data
// 'auditTrail' slice so they show up in the current Audit Trail
// page with no frontend changes needed there.
//
// NOTE ON AUTH: this endpoint currently has NO server-side auth
// check, matching db.php's current (pre-migration) behaviour —
// the app trusts the client-reported role everywhere today.
// requireAnyRole(['admin']) from config.php is intended to be
// dropped in here once the users table + JWT login migration
// (see MIGRATION_PLAN.md §4 step 5) lands. Until then, treat
// this the same as every other endpoint in this app: not yet
// hardened against a malicious client.
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'sarms_db');

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT            => 5,
            ]
        );

        // sarms_data must already exist (created by db.php) — auditTrail
        // lives there. Create it too if this endpoint is ever hit first.
        $pdo->exec("CREATE TABLE IF NOT EXISTS sarms_data (
            slice_key   VARCHAR(60)  PRIMARY KEY,
            slice_value LONGTEXT     NOT NULL,
            updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // The new normalized calendar table.
        $pdo->exec("CREATE TABLE IF NOT EXISTS academic_calendar_events (
            id           INT AUTO_INCREMENT PRIMARY KEY,
            session_name VARCHAR(20)  NOT NULL,
            term_name    VARCHAR(30)  NOT NULL,
            event_name   VARCHAR(150) NOT NULL,
            start_date   DATE         NOT NULL,
            end_date     DATE         NOT NULL,
            description  TEXT         NULL,
            status       ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
            created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uniq_event (session_name, term_name, event_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB Error: ' . $e->getMessage()]);
        exit;
    }
    return $pdo;
}

function respond($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function respondError(string $msg, int $code = 400): void {
    respond(['error' => $msg], $code);
}

// ── Auth (Phase 11) — identical scheme to lms.php/quizzes.php/analytics.php/assignments.php. ──
function jwtSecret(): string {
    static $secret = null;
    if ($secret !== null) return $secret;
    $secret = getenv('JWT_SECRET') ?: null;
    $localFile = __DIR__ . '/jwt_secret.php';
    if (!$secret && file_exists($localFile)) $secret = (require $localFile)['JWT_SECRET'] ?? null;
    if (!$secret) { $secret = bin2hex(random_bytes(32)); file_put_contents($localFile, "<?php\nreturn ['JWT_SECRET' => '$secret'];\n"); }
    return $secret;
}
function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}
function verifyToken(?string $token): ?array {
    if (!$token) return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $signature] = $parts;
    $expected = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$body", jwtSecret(), true)), '+/', '-_'), '=');
    if (!hash_equals($expected, $signature)) return null;
    $payload = json_decode(base64UrlDecode($body), true);
    if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) return null;
    return $payload;
}
function authenticatedUser(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null);
    $token = ($header && preg_match('/^Bearer\s+(.+)$/i', $header, $m)) ? $m[1] : null;
    $payload = verifyToken($token);
    if (!$payload) respondError('Authentication required — please log in again.', 401);
    return ['id' => (int)$payload['sub'], 'role' => $payload['role']];
}
function requireAdmin(array $authUser): void {
    if ($authUser['role'] !== 'admin') respondError('Admin access required.', 403);
}

// ── audit trail (reuses the existing sarms_data 'auditTrail' slice) ──
// Matches the shape the rest of the app already writes: {id, userId, userName, action, details, timestamp}
// so it shows up correctly in the existing AuditTrailPage with no frontend changes needed there.
function appendAudit(string $action, ?array $oldValue, ?array $newValue, ?string $userName): void {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute(['auditTrail']);
    $raw = $stmt->fetchColumn();
    $trail = $raw !== false ? json_decode($raw, true) : [];
    if (!is_array($trail)) $trail = [];

    $details = $action;
    if ($newValue && isset($newValue['event'])) {
        $details = $action . ': ' . $newValue['event'] . ' (' . $newValue['session'] . ', ' . $newValue['term'] . ')';
        if ($oldValue && ($oldValue['start'] !== $newValue['start'] || $oldValue['end'] !== $newValue['end'])) {
            $details .= " — {$oldValue['start']}..{$oldValue['end']} → {$newValue['start']}..{$newValue['end']}";
        }
    } elseif ($oldValue && isset($oldValue['event'])) {
        $details = $action . ': ' . $oldValue['event'] . ' (' . $oldValue['session'] . ', ' . $oldValue['term'] . ')';
    }

    $trail[] = [
        'id'        => uniqid('audit_', true),
        'userId'    => null,
        'userName'  => $userName ?: 'Unknown',
        'action'    => $action,
        'details'   => $details,
        'timestamp' => date('c'),
    ];

    db()->prepare('INSERT INTO sarms_data (slice_key, slice_value)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)')
        ->execute(['auditTrail', json_encode($trail, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
}

// ── validation helpers ──
function validDate(?string $d): bool {
    if (!$d) return false;
    $dt = DateTime::createFromFormat('Y-m-d', $d);
    return $dt && $dt->format('Y-m-d') === $d;
}

function normalizeRow(array $r): ?array {
    $session = trim((string)($r['session'] ?? $r['Session'] ?? $r['academicSession'] ?? ''));
    $term    = trim((string)($r['term']    ?? $r['Term']    ?? ''));
    $event   = trim((string)($r['event']   ?? $r['Event']   ?? ''));
    $start   = trim((string)($r['start']   ?? $r['startDate']   ?? $r['Start Date']   ?? ''));
    $end     = trim((string)($r['end']     ?? $r['endDate']     ?? $r['End Date']     ?? $start));
    $desc    = trim((string)($r['description'] ?? $r['Description'] ?? ''));
    $status  = trim((string)($r['status']  ?? $r['Status']  ?? 'scheduled'));

    if (!in_array($status, ['scheduled', 'completed', 'cancelled'], true)) $status = 'scheduled';

    if ($session === '' || $term === '' || $event === '' || !validDate($start) || !validDate($end)) {
        return null;
    }
    if ($end < $start) { $tmp = $start; $start = $end; $end = $tmp; }

    return [
        'session'     => $session,
        'term'        => $term,
        'event'       => $event,
        'start'       => $start,
        'end'         => $end,
        'description' => $desc,
        'status'      => $status,
    ];
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$actor  = trim((string)($body['actorName'] ?? $_GET['actorName'] ?? 'Unknown'));
$authUser = authenticatedUser();

// ── LIST ──────────────────────────────────────────────────────
if ($action === 'list') {
    $sql = 'SELECT id, session_name AS `session`, term_name AS term, event_name AS event,
                   start_date AS start, end_date AS end, description, status
            FROM academic_calendar_events';
    $where = [];
    $params = [];
    if (!empty($_GET['session'])) { $where[] = 'session_name = ?'; $params[] = $_GET['session']; }
    if (!empty($_GET['term']))    { $where[] = 'term_name = ?';    $params[] = $_GET['term']; }
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY start_date ASC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    respond(['events' => $stmt->fetchAll()]);
}

// ── CURRENT — session/term/event/days-remaining/next-event, all derived ──
if ($action === 'current') {
    $today = date('Y-m-d');

    // The event whose date range contains today (any session/term).
    $stmt = db()->prepare('SELECT session_name AS `session`, term_name AS term, event_name AS event,
                                   start_date AS start, end_date AS end, description
                            FROM academic_calendar_events
                            WHERE status = "scheduled" AND start_date <= ? AND end_date >= ?
                            ORDER BY start_date ASC LIMIT 1');
    $stmt->execute([$today, $today]);
    $currentEvent = $stmt->fetch();

    // If nothing spans today, fall back to the most recently-started event
    // (so "current session/term" still resolves even between named events).
    $session = $currentEvent['session'] ?? null;
    $term    = $currentEvent['term']    ?? null;
    if (!$session) {
        $stmt = db()->prepare('SELECT session_name AS `session`, term_name AS term
                                FROM academic_calendar_events
                                WHERE start_date <= ?
                                ORDER BY start_date DESC LIMIT 1');
        $stmt->execute([$today]);
        $recent = $stmt->fetch();
        $session = $recent['session'] ?? null;
        $term    = $recent['term']    ?? null;
    }

    // Next upcoming event (in the same session if known, else globally).
    $sql = 'SELECT session_name AS `session`, term_name AS term, event_name AS event,
                   start_date AS start, end_date AS end
            FROM academic_calendar_events
            WHERE status = "scheduled" AND start_date > ?';
    $params = [$today];
    if ($session) { $sql .= ' AND session_name = ?'; $params[] = $session; }
    $sql .= ' ORDER BY start_date ASC LIMIT 1';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $nextEvent = $stmt->fetch();

    $daysRemaining = null;
    if ($nextEvent) {
        $daysRemaining = (int) ((strtotime($nextEvent['start']) - strtotime($today)) / 86400);
    }

    respond([
        'academicSession' => $session,
        'currentTerm'     => $term,
        'currentEvent'    => $currentEvent ?: null,
        'nextEvent'       => $nextEvent ?: null,
        'daysRemaining'   => $daysRemaining,
        'today'           => $today,
    ]);
}

// ── PREVIEW IMPORT — diff against existing rows, write nothing ──
if ($action === 'preview_import') {
    requireAdmin($authUser);
    $rawRows = $body['rows'] ?? [];
    if (!is_array($rawRows) || !count($rawRows)) respondError('No rows provided');

    $result = ['new' => [], 'changed' => [], 'unchanged' => [], 'invalid' => []];

    foreach ($rawRows as $i => $raw) {
        $row = normalizeRow($raw);
        if (!$row) { $result['invalid'][] = ['row' => $i + 1, 'data' => $raw]; continue; }

        $stmt = db()->prepare('SELECT start_date AS start, end_date AS end, description, status
                                FROM academic_calendar_events
                                WHERE session_name = ? AND term_name = ? AND event_name = ?');
        $stmt->execute([$row['session'], $row['term'], $row['event']]);
        $existing = $stmt->fetch();

        if (!$existing) {
            $result['new'][] = $row;
        } elseif ($existing['start'] !== $row['start'] || $existing['end'] !== $row['end']
                  || $existing['description'] !== $row['description'] || $existing['status'] !== $row['status']) {
            $result['changed'][] = ['old' => $existing, 'new' => $row];
        } else {
            $result['unchanged'][] = $row;
        }
    }

    respond($result);
}

// ── COMMIT IMPORT — each row carries a resolution: insert | update | skip ──
if ($action === 'commit_import') {
    requireAdmin($authUser);
    $rows = $body['rows'] ?? [];
    if (!is_array($rows) || !count($rows)) respondError('No rows provided');

    $inserted = 0; $updated = 0; $skipped = 0;
    $pdo = db();

    foreach ($rows as $raw) {
        $resolution = $raw['resolution'] ?? 'insert';
        $row = normalizeRow($raw);
        if (!$row || $resolution === 'skip') { $skipped++; continue; }

        $stmt = $pdo->prepare('SELECT id, start_date AS start, end_date AS end, description, status
                                FROM academic_calendar_events
                                WHERE session_name = ? AND term_name = ? AND event_name = ?');
        $stmt->execute([$row['session'], $row['term'], $row['event']]);
        $existing = $stmt->fetch();

        if ($existing) {
            $pdo->prepare('UPDATE academic_calendar_events
                            SET start_date = ?, end_date = ?, description = ?, status = ?
                            WHERE id = ?')
                ->execute([$row['start'], $row['end'], $row['description'], $row['status'], $existing['id']]);
            appendAudit('Calendar event updated (import)', $existing, $row, $actor);
            $updated++;
        } else {
            $pdo->prepare('INSERT INTO academic_calendar_events
                            (session_name, term_name, event_name, start_date, end_date, description, status)
                            VALUES (?,?,?,?,?,?,?)')
                ->execute([$row['session'], $row['term'], $row['event'], $row['start'], $row['end'], $row['description'], $row['status']]);
            appendAudit('Calendar event imported', null, $row, $actor);
            $inserted++;
        }
    }

    respond(['ok' => true, 'inserted' => $inserted, 'updated' => $updated, 'skipped' => $skipped]);
}

// ── MANUAL CREATE ────────────────────────────────────────────
if ($action === 'create') {
    requireAdmin($authUser);
    $row = normalizeRow($body);
    if (!$row) respondError('Missing or invalid fields (session, term, event, start, end required; end >= start)');

    try {
        $stmt = db()->prepare('INSERT INTO academic_calendar_events
                                (session_name, term_name, event_name, start_date, end_date, description, status)
                                VALUES (?,?,?,?,?,?,?)');
        $stmt->execute([$row['session'], $row['term'], $row['event'], $row['start'], $row['end'], $row['description'], $row['status']]);
        $id = db()->lastInsertId();
        appendAudit('Calendar event created', null, $row, $actor);
        respond(['ok' => true, 'id' => $id]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') respondError('An event with this session/term/name already exists.', 409);
        throw $e;
    }
}

// ── MANUAL UPDATE ────────────────────────────────────────────
if ($action === 'update') {
    requireAdmin($authUser);
    $id = (int)($body['id'] ?? 0);
    if (!$id) respondError('Missing event id');
    $row = normalizeRow($body);
    if (!$row) respondError('Missing or invalid fields');

    $stmt = db()->prepare('SELECT start_date AS start, end_date AS end, description, status
                            FROM academic_calendar_events WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Event not found', 404);

    db()->prepare('UPDATE academic_calendar_events
                    SET session_name=?, term_name=?, event_name=?, start_date=?, end_date=?, description=?, status=?
                    WHERE id=?')
        ->execute([$row['session'], $row['term'], $row['event'], $row['start'], $row['end'], $row['description'], $row['status'], $id]);

    appendAudit('Calendar event updated', $existing, $row, $actor);
    respond(['ok' => true]);
}

// ── DELETE ────────────────────────────────────────────────────
if ($action === 'delete') {
    requireAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing event id');

    $stmt = db()->prepare('SELECT session_name AS `session`, term_name AS term, event_name AS event,
                                   start_date AS start, end_date AS end, description, status
                            FROM academic_calendar_events WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Event not found', 404);

    db()->prepare('DELETE FROM academic_calendar_events WHERE id = ?')->execute([$id]);
    appendAudit('Calendar event deleted', $existing, null, $actor);
    respond(['ok' => true]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
