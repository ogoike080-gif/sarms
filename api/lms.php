<?php
// ============================================================
// SARMS LMS — api/lms.php
// Phase 4: LMS APIs — course hierarchy (Course -> Module -> Lesson
// -> LearningResource) and enrollment. Quiz/Assignment-specific
// endpoints are Phase 8, not here.
//
// Requires sql/003_lms_models.sql (Phase 3) AND api/lms_migrate.php
// action=backfill (Phase 4 prerequisite) to have already been run —
// this file assumes real rows exist in users/classes/subjects.
//
// NOTE ON AUTH: same position as api/calendar.php — no server-side
// role check yet, matching the rest of the app's current (pre-auth-
// migration) behaviour. See MIGRATION_PLAN.md §4 step 5.
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

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
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
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

function respondError(string $msg, int $code = 400): void { respond(['error' => $msg], $code); }

// ── Auth (Phase 11) — identical scheme to quizzes.php/analytics.php/auth_jwt.php. ──
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
function requireOwnStudent(int $requestedStudentId, array $authUser): void {
    if ($authUser['role'] === 'admin') return;
    if ($authUser['role'] !== 'student' || $authUser['id'] !== $requestedStudentId) {
        respondError('You can only access your own records.', 403);
    }
}
function requireTeacherOrAdmin(array $authUser): void {
    if (!in_array($authUser['role'], ['teacher', 'admin'], true)) respondError('Teacher or admin access required.', 403);
}

function appendAudit(string $action, ?array $oldValue, ?array $newValue, ?string $userName): void {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute(['auditTrail']);
    $raw = $stmt->fetchColumn();
    $trail = $raw !== false ? json_decode($raw, true) : [];
    if (!is_array($trail)) $trail = [];

    $subject = $newValue['title'] ?? $oldValue['title'] ?? null;
    $details = $subject ? "$action: $subject" : $action;

    $trail[] = [
        'id' => uniqid('audit_', true), 'userId' => null, 'userName' => $userName ?: 'Unknown',
        'action' => $action, 'details' => $details, 'timestamp' => date('c'),
    ];
    db()->prepare('INSERT INTO sarms_data (slice_key, slice_value) VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)')
        ->execute(['auditTrail', json_encode($trail, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
}

function requireFields(array $body, array $fields): void {
    foreach ($fields as $f) {
        if (!isset($body[$f]) || $body[$f] === '') respondError("Missing required field: $f");
    }
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$actor  = trim((string)($body['actorName'] ?? $_GET['actorName'] ?? 'Unknown'));
$authUser = authenticatedUser();

// ════════════════════════════ COURSES ════════════════════════════

if ($action === 'list_courses') {
    $sql = 'SELECT c.id, c.class_id, cl.name AS class_name, c.subject_id, sub.name AS subject_name,
                   c.session_name, c.term_name, c.teacher_id, u.name AS teacher_name,
                   c.title, c.description, c.is_published, c.created_at,
                   (SELECT COUNT(*) FROM course_enrollments e WHERE e.course_id = c.id) AS enrollment_count,
                   (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS module_count
            FROM courses c
            JOIN classes cl ON cl.id = c.class_id
            JOIN subjects sub ON sub.id = c.subject_id
            JOIN users u ON u.id = c.teacher_id';
    $where = []; $params = [];
    foreach (['class_id', 'subject_id', 'teacher_id'] as $f) {
        if (!empty($_GET[$f])) { $where[] = "c.$f = ?"; $params[] = (int)$_GET[$f]; }
    }
    if (!empty($_GET['session'])) { $where[] = 'c.session_name = ?'; $params[] = $_GET['session']; }
    if (!empty($_GET['term']))    { $where[] = 'c.term_name = ?';    $params[] = $_GET['term']; }
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY c.created_at DESC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    respond(['courses' => $stmt->fetchAll()]);
}

if ($action === 'get_course') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respondError('Missing course id');

    $stmt = db()->prepare('SELECT c.*, cl.name AS class_name, sub.name AS subject_name, u.name AS teacher_name
                            FROM courses c
                            JOIN classes cl ON cl.id = c.class_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN users u ON u.id = c.teacher_id
                            WHERE c.id = ?');
    $stmt->execute([$id]);
    $course = $stmt->fetch();
    if (!$course) respondError('Course not found', 404);

    $stmt = db()->prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC, id ASC');
    $stmt->execute([$id]);
    $modules = $stmt->fetchAll();

    foreach ($modules as &$m) {
        $stmt = db()->prepare('SELECT id, title, order_index, is_published FROM lessons WHERE module_id = ? ORDER BY order_index ASC, id ASC');
        $stmt->execute([$m['id']]);
        $m['lessons'] = $stmt->fetchAll();
    }
    unset($m);

    $course['modules'] = $modules;
    respond(['course' => $course]);
}

if ($action === 'create_course') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['class_id', 'subject_id', 'session', 'term', 'teacher_id', 'title']);
    $stmt = db()->prepare('INSERT INTO courses (class_id, subject_id, session_name, term_name, teacher_id, title, description, is_published)
                            VALUES (?,?,?,?,?,?,?,?)');
    try {
        $stmt->execute([
            (int)$body['class_id'], (int)$body['subject_id'], $body['session'], $body['term'],
            (int)$body['teacher_id'], $body['title'], $body['description'] ?? '', (int)(bool)($body['is_published'] ?? false),
        ]);
    } catch (PDOException $e) {
        respondError('Could not create course — check that class_id, subject_id and teacher_id refer to real rows (run the Phase 4 backfill if you have not yet).', 409);
    }
    $id = db()->lastInsertId();
    appendAudit('Course created', null, ['title' => $body['title']], $actor);
    respond(['ok' => true, 'id' => $id]);
}

if ($action === 'update_course') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? 0);
    if (!$id) respondError('Missing course id');
    $stmt = db()->prepare('SELECT title FROM courses WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Course not found', 404);

    db()->prepare('UPDATE courses SET title=?, description=?, is_published=? WHERE id=?')
        ->execute([$body['title'] ?? $existing['title'], $body['description'] ?? '', (int)(bool)($body['is_published'] ?? false), $id]);
    appendAudit('Course updated', $existing, ['title' => $body['title'] ?? $existing['title']], $actor);
    respond(['ok' => true]);
}

if ($action === 'delete_course') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing course id');
    $stmt = db()->prepare('SELECT title FROM courses WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Course not found', 404);

    db()->prepare('DELETE FROM courses WHERE id = ?')->execute([$id]);
    appendAudit('Course deleted (and its modules/lessons/enrollments)', $existing, null, $actor);
    respond(['ok' => true]);
}

// ════════════════════════════ MODULES ════════════════════════════

if ($action === 'list_modules') {
    $courseId = (int)($_GET['course_id'] ?? 0);
    if (!$courseId) respondError('Missing course_id');
    $stmt = db()->prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC, id ASC');
    $stmt->execute([$courseId]);
    respond(['modules' => $stmt->fetchAll()]);
}

if ($action === 'create_module') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['course_id', 'title']);
    $orderIndex = $body['order_index'] ?? null;
    if ($orderIndex === null) {
        $stmt = db()->prepare('SELECT COALESCE(MAX(order_index), 0) + 1 FROM modules WHERE course_id = ?');
        $stmt->execute([(int)$body['course_id']]);
        $orderIndex = (int)$stmt->fetchColumn();
    }
    $stmt = db()->prepare('INSERT INTO modules (course_id, title, description, order_index) VALUES (?,?,?,?)');
    try {
        $stmt->execute([(int)$body['course_id'], $body['title'], $body['description'] ?? '', (int)$orderIndex]);
    } catch (PDOException $e) { respondError('Could not create module — check course_id exists.', 409); }
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

if ($action === 'update_module') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? 0);
    if (!$id) respondError('Missing module id');
    db()->prepare('UPDATE modules SET title=?, description=?, order_index=? WHERE id=?')
        ->execute([$body['title'] ?? '', $body['description'] ?? '', (int)($body['order_index'] ?? 0), $id]);
    respond(['ok' => true]);
}

if ($action === 'delete_module') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing module id');
    db()->prepare('DELETE FROM modules WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

// ════════════════════════════ LESSONS ════════════════════════════

if ($action === 'list_lessons') {
    $moduleId = (int)($_GET['module_id'] ?? 0);
    if (!$moduleId) respondError('Missing module_id');
    $stmt = db()->prepare('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC, id ASC');
    $stmt->execute([$moduleId]);
    respond(['lessons' => $stmt->fetchAll()]);
}

if ($action === 'get_lesson') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respondError('Missing lesson id');
    $stmt = db()->prepare('SELECT * FROM lessons WHERE id = ?');
    $stmt->execute([$id]);
    $lesson = $stmt->fetch();
    if (!$lesson) respondError('Lesson not found', 404);

    $stmt = db()->prepare('SELECT id, type, title, url_or_path, topic FROM learning_resources WHERE lesson_id = ?');
    $stmt->execute([$id]);
    $lesson['resources'] = $stmt->fetchAll();
    respond(['lesson' => $lesson]);
}

if ($action === 'create_lesson') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['module_id', 'title']);
    $orderIndex = $body['order_index'] ?? null;
    if ($orderIndex === null) {
        $stmt = db()->prepare('SELECT COALESCE(MAX(order_index), 0) + 1 FROM lessons WHERE module_id = ?');
        $stmt->execute([(int)$body['module_id']]);
        $orderIndex = (int)$stmt->fetchColumn();
    }
    $stmt = db()->prepare('INSERT INTO lessons (module_id, title, content, order_index, is_published) VALUES (?,?,?,?,?)');
    try {
        $stmt->execute([(int)$body['module_id'], $body['title'], $body['content'] ?? '', (int)$orderIndex, (int)(bool)($body['is_published'] ?? false)]);
    } catch (PDOException $e) { respondError('Could not create lesson — check module_id exists.', 409); }
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

if ($action === 'update_lesson') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? 0);
    if (!$id) respondError('Missing lesson id');
    db()->prepare('UPDATE lessons SET title=?, content=?, order_index=?, is_published=? WHERE id=?')
        ->execute([$body['title'] ?? '', $body['content'] ?? '', (int)($body['order_index'] ?? 0), (int)(bool)($body['is_published'] ?? false), $id]);
    respond(['ok' => true]);
}

if ($action === 'delete_lesson') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing lesson id');
    db()->prepare('DELETE FROM lessons WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

// ═══════════════════════ LEARNING RESOURCES ═══════════════════════

if ($action === 'list_resources') {
    $sql = 'SELECT * FROM learning_resources';
    $where = []; $params = [];
    if (!empty($_GET['lesson_id'])) { $where[] = 'lesson_id = ?'; $params[] = (int)$_GET['lesson_id']; }
    if (!empty($_GET['course_id'])) { $where[] = 'course_id = ?'; $params[] = (int)$_GET['course_id']; }
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    respond(['resources' => $stmt->fetchAll()]);
}

if ($action === 'create_resource') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['course_id', 'teacher_id', 'type', 'title']);
    $validTypes = ['text', 'pdf', 'doc', 'ppt', 'image', 'video', 'youtube_link', 'external_link'];
    if (!in_array($body['type'], $validTypes, true)) respondError('Invalid resource type');

    $stmt = db()->prepare('INSERT INTO learning_resources (lesson_id, course_id, teacher_id, type, title, url_or_path, topic)
                            VALUES (?,?,?,?,?,?,?)');
    try {
        $stmt->execute([
            !empty($body['lesson_id']) ? (int)$body['lesson_id'] : null,
            (int)$body['course_id'], (int)$body['teacher_id'], $body['type'],
            $body['title'], $body['url_or_path'] ?? null, $body['topic'] ?? null,
        ]);
    } catch (PDOException $e) { respondError('Could not create resource — check course_id/teacher_id/lesson_id exist.', 409); }
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

if ($action === 'delete_resource') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing resource id');
    db()->prepare('DELETE FROM learning_resources WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

// ═══════════════════════════ ENROLLMENT ═══════════════════════════

if ($action === 'enroll_student') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['course_id', 'student_id']);
    try {
        db()->prepare('INSERT INTO course_enrollments (course_id, student_id) VALUES (?,?)')
            ->execute([(int)$body['course_id'], (int)$body['student_id']]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') respondError('Student is already enrolled in this course.', 409);
        respondError('Could not enroll — check course_id/student_id exist.', 409);
    }
    respond(['ok' => true]);
}

// Bulk-enroll every active student in the course's class — convenience
// for the common case (a class-wide course), not in the spec's table
// list explicitly but a natural extension of course_enrollments.
if ($action === 'enroll_class') {
    requireTeacherOrAdmin($authUser);
    $courseId = (int)($body['course_id'] ?? 0);
    if (!$courseId) respondError('Missing course_id');

    $stmt = db()->prepare('SELECT class_id FROM courses WHERE id = ?');
    $stmt->execute([$courseId]);
    $classId = $stmt->fetchColumn();
    if (!$classId) respondError('Course not found', 404);

    $stmt = db()->prepare("SELECT id FROM users WHERE role = 'student' AND class_id = ? AND is_active = 1");
    $stmt->execute([$classId]);
    $studentIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $inserted = 0;
    $ins = db()->prepare('INSERT IGNORE INTO course_enrollments (course_id, student_id) VALUES (?,?)');
    foreach ($studentIds as $sid) {
        $ins->execute([$courseId, $sid]);
        if ($ins->rowCount() > 0) $inserted++;
    }
    respond(['ok' => true, 'classSize' => count($studentIds), 'newlyEnrolled' => $inserted]);
}

if ($action === 'unenroll_student') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['course_id', 'student_id']);
    db()->prepare('DELETE FROM course_enrollments WHERE course_id = ? AND student_id = ?')
        ->execute([(int)$body['course_id'], (int)$body['student_id']]);
    respond(['ok' => true]);
}

if ($action === 'list_enrollments') {
    requireTeacherOrAdmin($authUser);
    $courseId = (int)($_GET['course_id'] ?? 0);
    if (!$courseId) respondError('Missing course_id');
    $stmt = db()->prepare('SELECT e.id, e.student_id, u.name, u.student_id AS admission_no, e.status, e.enrolled_at
                            FROM course_enrollments e JOIN users u ON u.id = e.student_id
                            WHERE e.course_id = ? ORDER BY u.name ASC');
    $stmt->execute([$courseId]);
    respond(['enrollments' => $stmt->fetchAll()]);
}

if ($action === 'list_student_courses') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $stmt = db()->prepare('SELECT c.id, c.title, c.session_name, c.term_name, sub.name AS subject_name,
                                   cl.name AS class_name, u.name AS teacher_name, e.status, e.enrolled_at
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN classes cl ON cl.id = c.class_id
                            JOIN users u ON u.id = c.teacher_id
                            WHERE e.student_id = ? AND c.is_published = 1
                            ORDER BY c.created_at DESC');
    $stmt->execute([$studentId]);
    respond(['courses' => $stmt->fetchAll()]);
}

// ═══════════════════ PHASE 5: STUDENT LEARNING DASHBOARD ══════════════════
// Progress tracking, "what's next", and lightweight reads that back
// spec §9. Assignment/quiz list endpoints read from tables that exist
// (Phase 3) but have no writer yet (Phase 8 builds that) — they return
// real, honestly-empty results today rather than being stubbed out,
// so the dashboard doesn't need rework once Phase 8 populates them.

// Bridges the still-blob-based session (currentUser.id is the OLD string
// blob id — auth migration is still deliberately deferred, see
// MIGRATION_PLAN.md §4 step 5) to the normalized users.id the LMS tables
// actually use, via email — unique in both the blob and the normalized
// table, and already present on the logged-in user client-side.
// Real normalized class/subject lists (with real integer ids) — the
// teacher "create course" form needs these instead of the blob's
// string-id classes/subjects, since courses.class_id/subject_id are
// real foreign keys into the Phase 3/4 normalized tables.
if ($action === 'list_classes') {
    $rows = db()->query('SELECT id, name, level FROM classes ORDER BY name ASC')->fetchAll();
    respond(['classes' => $rows]);
}

if ($action === 'list_subjects') {
    $rows = db()->query('SELECT id, name, code FROM subjects ORDER BY name ASC')->fetchAll();
    respond(['subjects' => $rows]);
}

if ($action === 'resolve_user') {
    $email = trim((string)($_GET['email'] ?? ''));
    if ($email === '') respondError('Missing email');
    $stmt = db()->prepare('SELECT id, role, name FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) respondError('No matching normalized user — has the Phase 4 backfill (lms_migrate.php?action=backfill) been run?', 404);
    respond(['user' => $user]);
}

if ($action === 'mark_lesson_progress') {
    requireFields($body, ['student_id', 'lesson_id', 'status']);
    requireOwnStudent((int)$body['student_id'], $authUser);
    if (!in_array($body['status'], ['in_progress', 'completed'], true)) respondError('Invalid status');

    $stmt = db()->prepare('SELECT m.course_id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE l.id = ?');
    $stmt->execute([(int)$body['lesson_id']]);
    $courseId = $stmt->fetchColumn();
    if (!$courseId) respondError('Lesson not found', 404);

    $completedAt = $body['status'] === 'completed' ? date('Y-m-d H:i:s') : null;
    db()->prepare('INSERT INTO student_progress (student_id, course_id, lesson_id, status, progress_percent, last_accessed_at, completed_at)
                    VALUES (?,?,?,?,?,NOW(),?)
                    ON DUPLICATE KEY UPDATE status = VALUES(status), progress_percent = VALUES(progress_percent),
                                             last_accessed_at = NOW(), completed_at = VALUES(completed_at)')
        ->execute([(int)$body['student_id'], $courseId, (int)$body['lesson_id'], $body['status'],
                   $body['status'] === 'completed' ? 100 : 50, $completedAt]);

    // Course-level percentage is computed on demand in get_student_progress
    // (not stored as a second row here) — a UNIQUE KEY with a NULL column
    // doesn't enforce uniqueness the way you'd expect in MySQL/MariaDB
    // (NULL is never equal to NULL), so an INSERT ... ON DUPLICATE KEY
    // using lesson_id=NULL as a "course rollup" sentinel silently inserts
    // a new row every time instead of updating one. Computing on read
    // avoids that trap entirely and can't drift out of sync.
    $percent = computeCourseProgress((int)$body['student_id'], $courseId);
    respond(['ok' => true, 'courseProgressPercent' => $percent]);
}

function computeCourseProgress(int $studentId, int $courseId): float {
    $stmt = db()->prepare('SELECT COUNT(*) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ? AND l.is_published = 1');
    $stmt->execute([$courseId]);
    $total = (int)$stmt->fetchColumn();
    if ($total === 0) return 0.0;

    $stmt = db()->prepare("SELECT COUNT(*) FROM student_progress WHERE student_id = ? AND course_id = ? AND status = 'completed'");
    $stmt->execute([$studentId, $courseId]);
    $completed = (int)$stmt->fetchColumn();

    return round(($completed / $total) * 100, 2);
}

if ($action === 'get_student_progress') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);

    $stmt = db()->prepare("SELECT c.id AS course_id, c.title AS course_title, sub.name AS subject_name
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id AND c.is_published = 1
                            JOIN subjects sub ON sub.id = c.subject_id
                            WHERE e.student_id = ?
                            ORDER BY c.created_at DESC");
    $stmt->execute([$studentId]);
    $courses = $stmt->fetchAll();

    foreach ($courses as &$c) {
        $percent = computeCourseProgress($studentId, (int)$c['course_id']);
        $c['progress_percent'] = $percent;
        $c['status'] = $percent >= 100 ? 'completed' : ($percent > 0 ? 'in_progress' : 'not_started');
    }
    unset($c);

    respond(['progress' => $courses]);
}

if ($action === 'list_upcoming_lessons') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $limit = min((int)($_GET['limit'] ?? 5), 20);
    // next not-yet-completed published lesson per enrolled course, ordered by course recency then lesson order
    $stmt = db()->prepare("SELECT l.id AS lesson_id, l.title AS lesson_title, m.title AS module_title,
                                   c.id AS course_id, c.title AS course_title, sub.name AS subject_name
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id AND c.is_published = 1
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN modules m ON m.course_id = c.id
                            JOIN lessons l ON l.module_id = m.id AND l.is_published = 1
                            LEFT JOIN student_progress sp ON sp.lesson_id = l.id AND sp.student_id = e.student_id AND sp.status = 'completed'
                            WHERE e.student_id = ? AND sp.id IS NULL
                            ORDER BY c.created_at DESC, m.order_index ASC, l.order_index ASC
                            LIMIT $limit");
    $stmt->execute([$studentId]);
    respond(['lessons' => $stmt->fetchAll()]);
}

if ($action === 'list_pending_assignments') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $stmt = db()->prepare("SELECT a.id, a.title, a.due_date, a.max_marks, c.title AS course_title, sub.name AS subject_name
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN assignments a ON a.course_id = c.id AND a.status = 'published'
                            LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = e.student_id
                            WHERE e.student_id = ? AND s.id IS NULL
                            ORDER BY a.due_date ASC");
    $stmt->execute([$studentId]);
    respond(['assignments' => $stmt->fetchAll()]);
}

if ($action === 'list_upcoming_quizzes') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $stmt = db()->prepare("SELECT q.id, q.title, q.available_from, q.available_until, q.time_limit_minutes,
                                   c.title AS course_title, sub.name AS subject_name
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN quizzes q ON q.course_id = c.id AND q.status = 'published'
                            LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.student_id = e.student_id
                            WHERE e.student_id = ? AND qa.id IS NULL
                            ORDER BY q.available_from ASC");
    $stmt->execute([$studentId]);
    respond(['quizzes' => $stmt->fetchAll()]);
}

// ═══════════════════ PHASE 7: ADMIN LMS MANAGEMENT ═════════════════════
// Statistics for the Admin Dashboard (spec §19). Assignment/quiz/AI-tutor
// counts are correctly 0 today — Phase 8 (quizzes/assignments) and
// Phase 9 (Gemini) haven't shipped yet, so there's genuinely nothing to
// count. "Students Needing Support" is a simple, honest non-AI heuristic
// (low course completion) — the real AI-driven version is Phase 10's job,
// not pulled forward here.

if ($action === 'get_lms_stats') {
    if ($authUser['role'] !== 'admin') respondError('Admin access required.', 403);
    $pdo = db();

    $totalStudents  = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
    $activeStudents = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student' AND is_active = 1")->fetchColumn();
    $totalTeachers  = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'teacher'")->fetchColumn();
    $activeCourses  = (int)$pdo->query("SELECT COUNT(*) FROM courses WHERE is_published = 1")->fetchColumn();
    $totalLessons   = (int)$pdo->query("SELECT COUNT(*) FROM lessons")->fetchColumn();
    $totalAssignments = (int)$pdo->query("SELECT COUNT(*) FROM assignments")->fetchColumn();
    $totalQuizzes   = (int)$pdo->query("SELECT COUNT(*) FROM quizzes")->fetchColumn();

    $avgQuizScoreRow = $pdo->query("SELECT AVG(score / NULLIF(max_score, 0) * 100) AS avg_pct FROM quiz_attempts WHERE is_graded = 1")->fetch();
    $avgQuizScore = $avgQuizScoreRow['avg_pct'] !== null ? round((float)$avgQuizScoreRow['avg_pct'], 1) : null;

    $aiTutorUsage = (int)$pdo->query("SELECT COUNT(*) FROM ai_conversations WHERE persona = 'student_tutor'")->fetchColumn();

    // Completion rate + "needing support" both need per-(student,course)
    // percentages, which aren't stored anywhere (computed on read since
    // Phase 5 — see computeCourseProgress) — so compute them here too,
    // once per enrollment, and derive both stats from the same pass.
    $enrollments = $pdo->query('SELECT student_id, course_id FROM course_enrollments')->fetchAll();
    $percentages = [];
    $lowCompletionStudents = [];
    foreach ($enrollments as $e) {
        $pct = computeCourseProgress((int)$e['student_id'], (int)$e['course_id']);
        $percentages[] = $pct;
        if ($pct < 30) $lowCompletionStudents[(int)$e['student_id']] = true;
    }
    $avgCompletion = count($percentages) > 0 ? round(array_sum($percentages) / count($percentages), 1) : 0;
    $studentsNeedingSupport = count($lowCompletionStudents);

    respond([
        'totalStudents' => $totalStudents,
        'activeStudents' => $activeStudents,
        'totalTeachers' => $totalTeachers,
        'activeCourses' => $activeCourses,
        'totalLessons' => $totalLessons,
        'totalAssignments' => $totalAssignments,
        'totalQuizzes' => $totalQuizzes,
        'avgCompletionRate' => $avgCompletion,
        'avgQuizScore' => $avgQuizScore,
        'studentsNeedingSupport' => $studentsNeedingSupport,
        'aiTutorUsage' => $aiTutorUsage,
    ]);
}

// All courses across every teacher — admin oversight view, unlike
// list_courses&teacher_id=... (Phase 6) which scopes to one teacher.
// Same endpoint, just called without that filter — nothing new needed
// beyond what Phase 4 already built, admin's "All Courses" browser is
// list_courses with no teacher_id.

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
