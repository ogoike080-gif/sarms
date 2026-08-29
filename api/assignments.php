<?php
// ============================================================
// SARMS LMS — api/assignments.php (Phase 8, spec §17)
// Assignment lifecycle: teacher creates -> student submits ->
// teacher grades + gives feedback -> student sees grade only
// after the teacher explicitly publishes it (is_published_grade).
//
// Same position as calendar.php/lms.php on auth: no server-side
// role check yet (MIGRATION_PLAN.md §4 step 5).
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
define('UPLOAD_DIR', __DIR__ . '/../uploads/');

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    try {
        $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
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

// ── Auth (Phase 11) — identical scheme to lms.php/quizzes.php/analytics.php. ──
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
function requireFields(array $body, array $fields): void {
    foreach ($fields as $f) if (!isset($body[$f]) || $body[$f] === '') respondError("Missing required field: $f");
}

// Allow-list only — spec §22 requires validating file type, not merely
// accepting anything and relabeling the unrecognized ones. Also enforces
// a size cap (10MB) since base64 payloads have no inherent limit otherwise.
define('MAX_UPLOAD_BYTES', 10 * 1024 * 1024);
const ALLOWED_UPLOAD_MIMES = [
    'application/pdf' => 'pdf',
    'application/msword' => 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
    'image/png' => 'png',
    'image/jpeg' => 'jpg',
];

function saveBase64File(string $base64, string $subdir): array {
    if (!preg_match('/^data:([\w\/\-\.]+);base64,/', $base64, $m)) {
        return ['error' => 'Unrecognized file data.'];
    }
    $mime = $m[1];
    if (!isset(ALLOWED_UPLOAD_MIMES[$mime])) {
        return ['error' => 'File type not allowed. Accepted: PDF, Word (.doc/.docx), PNG, JPG.'];
    }
    $ext = ALLOWED_UPLOAD_MIMES[$mime];
    $data = base64_decode(preg_replace('#^data:[\w/\-.]+;base64,#', '', $base64));
    if ($data === false) return ['error' => 'Could not decode the uploaded file.'];
    if (strlen($data) > MAX_UPLOAD_BYTES) return ['error' => 'File too large — 10MB maximum.'];

    $dir = UPLOAD_DIR . $subdir . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    // Defense in depth alongside the mime allow-list above: even though no
    // upload here can produce a .php/.exe/.sh extension, block execution
    // of anything in this directory at the web-server level too.
    $htaccess = UPLOAD_DIR . '.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "php_flag engine off\n<FilesMatch \"\\.(php|phtml|php3|php4|php5|phar|cgi|pl|py|sh|exe)$\">\n  Require all denied\n</FilesMatch>\n");
    }
    $fname = uniqid('sub_', true) . '.' . $ext;
    file_put_contents($dir . $fname, $data);
    return ['path' => '/uploads/' . $subdir . '/' . $fname, 'name' => $fname];
}

function appendAudit(string $action, ?array $oldValue, ?array $newValue, ?string $userName): void {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute(['auditTrail']);
    $raw = $stmt->fetchColumn();
    $trail = $raw !== false ? json_decode($raw, true) : [];
    if (!is_array($trail)) $trail = [];
    $subject = $newValue['title'] ?? $oldValue['title'] ?? null;
    $trail[] = ['id' => uniqid('audit_', true), 'userId' => null, 'userName' => $userName ?: 'Unknown',
                'action' => $action, 'details' => $subject ? "$action: $subject" : $action, 'timestamp' => date('c')];
    db()->prepare('INSERT INTO sarms_data (slice_key, slice_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)')
        ->execute(['auditTrail', json_encode($trail, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$actor  = trim((string)($body['actorName'] ?? $_GET['actorName'] ?? 'Unknown'));
$authUser = authenticatedUser();

// ════════════════════════ TEACHER: AUTHORING ════════════════════════

if ($action === 'list_assignments') {
    requireTeacherOrAdmin($authUser);
    $courseId = (int)($_GET['course_id'] ?? 0);
    if (!$courseId) respondError('Missing course_id');
    $stmt = db()->prepare('SELECT a.*, (SELECT COUNT(*) FROM assignment_submissions s WHERE s.assignment_id = a.id) AS submission_count
                            FROM assignments a WHERE a.course_id = ? ORDER BY a.due_date ASC');
    $stmt->execute([$courseId]);
    respond(['assignments' => $stmt->fetchAll()]);
}

if ($action === 'create_assignment') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['course_id', 'class_id', 'subject_id', 'teacher_id', 'title', 'due_date']);
    try {
        $stmt = db()->prepare('INSERT INTO assignments (course_id, lesson_id, class_id, subject_id, teacher_id, title, instructions, resource_path, start_date, due_date, max_marks, allow_submissions, status)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
            (int)$body['course_id'], !empty($body['lesson_id']) ? (int)$body['lesson_id'] : null,
            (int)$body['class_id'], (int)$body['subject_id'], (int)$body['teacher_id'],
            $body['title'], $body['instructions'] ?? '', $body['resource_path'] ?? null,
            $body['start_date'] ?? null, $body['due_date'], (float)($body['max_marks'] ?? 100),
            (int)(bool)($body['allow_submissions'] ?? true), $body['status'] ?? 'published',
        ]);
    } catch (PDOException $e) { respondError('Could not create assignment — check course_id/class_id/subject_id/teacher_id exist.', 409); }
    $id = db()->lastInsertId();
    appendAudit('Assignment created', null, ['title' => $body['title']], $actor);
    respond(['ok' => true, 'id' => $id]);
}

if ($action === 'update_assignment') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? 0);
    if (!$id) respondError('Missing assignment id');
    $stmt = db()->prepare('SELECT title FROM assignments WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Assignment not found', 404);

    db()->prepare('UPDATE assignments SET title=?, instructions=?, resource_path=?, start_date=?, due_date=?, max_marks=?, allow_submissions=?, status=? WHERE id=?')
        ->execute([
            $body['title'] ?? $existing['title'], $body['instructions'] ?? '', $body['resource_path'] ?? null,
            $body['start_date'] ?? null, $body['due_date'] ?? null, (float)($body['max_marks'] ?? 100),
            (int)(bool)($body['allow_submissions'] ?? true), $body['status'] ?? 'published', $id,
        ]);
    appendAudit('Assignment updated', $existing, ['title' => $body['title'] ?? $existing['title']], $actor);
    respond(['ok' => true]);
}

if ($action === 'delete_assignment') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing assignment id');
    $stmt = db()->prepare('SELECT title FROM assignments WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Assignment not found', 404);
    db()->prepare('DELETE FROM assignments WHERE id = ?')->execute([$id]);
    appendAudit('Assignment deleted', $existing, null, $actor);
    respond(['ok' => true]);
}

// Teacher's grading queue for one assignment
if ($action === 'list_submissions') {
    requireTeacherOrAdmin($authUser);
    $assignmentId = (int)($_GET['assignment_id'] ?? 0);
    if (!$assignmentId) respondError('Missing assignment_id');
    $stmt = db()->prepare('SELECT s.*, u.name AS student_name
                            FROM assignment_submissions s JOIN users u ON u.id = s.student_id
                            WHERE s.assignment_id = ? ORDER BY s.submitted_at DESC');
    $stmt->execute([$assignmentId]);
    respond(['submissions' => $stmt->fetchAll()]);
}

if ($action === 'grade_submission') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['submission_id', 'grade']);
    $stmt = db()->prepare('SELECT s.*, a.title FROM assignment_submissions s JOIN assignments a ON a.id = s.assignment_id WHERE s.id = ?');
    $stmt->execute([(int)$body['submission_id']]);
    $existing = $stmt->fetch();
    if (!$existing) respondError('Submission not found', 404);

    db()->prepare('UPDATE assignment_submissions SET grade=?, feedback=?, graded_by=?, graded_at=NOW(), is_published_grade=? WHERE id=?')
        ->execute([
            (float)$body['grade'], $body['feedback'] ?? '', !empty($body['graded_by']) ? (int)$body['graded_by'] : null,
            (int)(bool)($body['is_published_grade'] ?? false), (int)$body['submission_id'],
        ]);
    appendAudit('Assignment graded', $existing, ['title' => $existing['title']], $actor);
    respond(['ok' => true]);
}

if ($action === 'publish_grade') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['submission_id'] ?? 0);
    if (!$id) respondError('Missing submission_id');
    db()->prepare('UPDATE assignment_submissions SET is_published_grade = 1 WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

// ════════════════════════ STUDENT: VIEW & SUBMIT ════════════════════════

if ($action === 'list_student_assignments') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $stmt = db()->prepare("SELECT a.id, a.title, a.due_date, a.max_marks, a.status,
                                   c.title AS course_title, sub.name AS subject_name,
                                   s.id AS submission_id, s.submitted_at, s.grade,
                                   s.feedback, s.is_published_grade
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN assignments a ON a.course_id = c.id AND a.status = 'published'
                            LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = e.student_id
                            WHERE e.student_id = ?
                            ORDER BY a.due_date ASC");
    $stmt->execute([$studentId]);
    respond(['assignments' => $stmt->fetchAll()]);
}

if ($action === 'get_assignment') {
    $id = (int)($_GET['id'] ?? 0);
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$id) respondError('Missing assignment id');
    // A student may only look at their own attached submission; fetching
    // without a student_id (teacher/admin reviewing the assignment itself)
    // requires the higher role.
    if ($studentId) requireOwnStudent($studentId, $authUser);
    else requireTeacherOrAdmin($authUser);
    $stmt = db()->prepare('SELECT a.*, c.title AS course_title, sub.name AS subject_name
                            FROM assignments a JOIN courses c ON c.id = a.course_id JOIN subjects sub ON sub.id = c.subject_id
                            WHERE a.id = ?');
    $stmt->execute([$id]);
    $assignment = $stmt->fetch();
    if (!$assignment) respondError('Assignment not found', 404);

    if ($studentId) {
        $stmt = db()->prepare('SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?');
        $stmt->execute([$id, $studentId]);
        $submission = $stmt->fetch();
        // Hide grade/feedback until the teacher explicitly publishes it — spec §17: "See grade after publication"
        if ($submission && !$submission['is_published_grade']) {
            $submission['grade'] = null;
            $submission['feedback'] = null;
        }
        $assignment['submission'] = $submission ?: null;
    }
    respond(['assignment' => $assignment]);
}

if ($action === 'submit_assignment') {
    requireFields($body, ['assignment_id', 'student_id']);
    $assignmentId = (int)$body['assignment_id'];
    $studentId = (int)$body['student_id'];
    requireOwnStudent($studentId, $authUser);

    $stmt = db()->prepare('SELECT allow_submissions, due_date FROM assignments WHERE id = ?');
    $stmt->execute([$assignmentId]);
    $assignment = $stmt->fetch();
    if (!$assignment) respondError('Assignment not found', 404);
    if (!$assignment['allow_submissions']) respondError('This assignment is no longer accepting submissions.', 403);

    $filePath = null; $fileName = null;
    if (!empty($body['file_base64'])) {
        $saved = saveBase64File($body['file_base64'], 'assignment_submissions');
        if (isset($saved['error'])) respondError($saved['error']);
        $filePath = $saved['path'];
        $fileName = $body['file_name'] ?? $saved['name'];
    }
    if (empty($body['text_response']) && !$filePath) respondError('Submit either a text response or a file.');

    try {
        db()->prepare('INSERT INTO assignment_submissions (assignment_id, student_id, text_response, file_path, file_name, submitted_at)
                        VALUES (?,?,?,?,?,NOW())
                        ON DUPLICATE KEY UPDATE text_response = VALUES(text_response), file_path = VALUES(file_path),
                                                 file_name = VALUES(file_name), submitted_at = NOW()')
            ->execute([$assignmentId, $studentId, $body['text_response'] ?? null, $filePath, $fileName]);
    } catch (PDOException $e) { respondError('Could not submit — check assignment_id/student_id exist.', 409); }
    respond(['ok' => true]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
