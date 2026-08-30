<?php
// ============================================================
// SARMS LMS — api/quizzes.php (Phase 8, spec §16)
//
// Security-critical: get_quiz_for_attempt NEVER includes
// correct_answer or explanation — those only appear in
// get_attempt_result, after the student has submitted, or in
// teacher-facing endpoints (get_quiz_full, list_attempts).
//
// Same position as calendar.php/lms.php/assignments.php on auth:
// no server-side role check yet (MIGRATION_PLAN.md §4 step 5) —
// which matters more here than elsewhere, since without it a
// student could currently call get_quiz_full directly. Flagged
// explicitly, not silently left out.
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

define('DB_HOST', getenv('MYSQLHOST') ?: 'localhost');
define('DB_USER', getenv('MYSQLUSER') ?: 'root');
define('DB_PASS', getenv('MYSQLPASSWORD') ?: '');
define('DB_NAME', getenv('MYSQLDATABASE') ?: 'sarms_db');
define('DB_PORT', getenv('MYSQLPORT') ?: 3306);

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    try {
        $pdo = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
        // Defensive: add quiz_questions.topic if this install predates Phase 10
        // (see sql/004_quiz_question_topic.sql for the standalone version).
        $stmt = $pdo->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quiz_questions' AND COLUMN_NAME = 'topic'");
        if ((int)$stmt->fetchColumn() === 0) {
            $pdo->exec("ALTER TABLE quiz_questions ADD COLUMN topic VARCHAR(150) DEFAULT NULL AFTER explanation");
        }
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
function requireFields(array $body, array $fields): void {
    foreach ($fields as $f) if (!isset($body[$f]) || $body[$f] === '') respondError("Missing required field: $f");
}

// ── Auth (Phase 11) — same JWT scheme as api/auth_jwt.php, duplicated
// inline per this project's established self-contained-file convention.
// Shares the auto-generated api/jwt_secret.php so tokens issued by
// auth_jwt.php validate correctly here too. ──
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
// A student may only act on their own records; admin may act on anyone's.
// (Teachers don't hit student-scoped actions in this file at all.)
function requireOwnStudent(int $requestedStudentId, array $authUser): void {
    if ($authUser['role'] === 'admin') return;
    if ($authUser['role'] !== 'student' || $authUser['id'] !== $requestedStudentId) {
        respondError("You can only access your own records.", 403);
    }
}
function requireTeacherOrAdmin(array $authUser): void {
    if (!in_array($authUser['role'], ['teacher', 'admin'], true)) respondError('Teacher or admin access required.', 403);
}

function normalizeAnswer(string $s): string { return strtolower(trim(preg_replace('/\s+/', ' ', $s))); }

// Recomputes quiz_attempts.score/is_graded from its answers — called after
// any auto-grade or manual-grade write, so the two never drift apart.
function recomputeAttemptScore(int $attemptId): void {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT marks_awarded, is_correct FROM quiz_attempt_answers WHERE attempt_id = ?');
    $stmt->execute([$attemptId]);
    $answers = $stmt->fetchAll();

    $score = 0.0; $allGraded = true;
    foreach ($answers as $a) {
        if ($a['marks_awarded'] === null) { $allGraded = false; continue; }
        $score += (float)$a['marks_awarded'];
    }
    $pdo->prepare('UPDATE quiz_attempts SET score = ?, is_graded = ? WHERE id = ?')
        ->execute([$score, $allGraded ? 1 : 0, $attemptId]);
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// Every action requires a valid token. Which further check applies
// (own-student vs teacher/admin) is decided per action below.
$authUser = authenticatedUser();

// ════════════════════════ TEACHER: QUIZ AUTHORING ════════════════════════

if ($action === 'list_quizzes') {
    requireTeacherOrAdmin($authUser);
    $courseId = (int)($_GET['course_id'] ?? 0);
    if (!$courseId) respondError('Missing course_id');
    $stmt = db()->prepare('SELECT q.*, (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.quiz_id = q.id) AS question_count,
                                   (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.quiz_id = q.id) AS attempt_count
                            FROM quizzes q WHERE q.course_id = ? ORDER BY q.created_at DESC');
    $stmt->execute([$courseId]);
    respond(['quizzes' => $stmt->fetchAll()]);
}

if ($action === 'create_quiz') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['course_id', 'teacher_id', 'title']);
    $stmt = db()->prepare('INSERT INTO quizzes (course_id, lesson_id, teacher_id, title, description, time_limit_minutes, max_attempts, randomize_questions, shuffle_options, status, available_from, available_until)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
    try {
        $stmt->execute([
            (int)$body['course_id'], !empty($body['lesson_id']) ? (int)$body['lesson_id'] : null, (int)$body['teacher_id'],
            $body['title'], $body['description'] ?? '', !empty($body['time_limit_minutes']) ? (int)$body['time_limit_minutes'] : null,
            (int)($body['max_attempts'] ?? 1), (int)(bool)($body['randomize_questions'] ?? false), (int)(bool)($body['shuffle_options'] ?? false),
            $body['status'] ?? 'draft', $body['available_from'] ?? null, $body['available_until'] ?? null,
        ]);
    } catch (PDOException $e) { respondError('Could not create quiz — check course_id/teacher_id exist.', 409); }
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

if ($action === 'update_quiz') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? 0);
    if (!$id) respondError('Missing quiz id');
    db()->prepare('UPDATE quizzes SET title=?, description=?, time_limit_minutes=?, max_attempts=?, randomize_questions=?, shuffle_options=?, status=?, available_from=?, available_until=? WHERE id=?')
        ->execute([
            $body['title'] ?? '', $body['description'] ?? '', !empty($body['time_limit_minutes']) ? (int)$body['time_limit_minutes'] : null,
            (int)($body['max_attempts'] ?? 1), (int)(bool)($body['randomize_questions'] ?? false), (int)(bool)($body['shuffle_options'] ?? false),
            $body['status'] ?? 'draft', $body['available_from'] ?? null, $body['available_until'] ?? null, $id,
        ]);
    respond(['ok' => true]);
}

if ($action === 'delete_quiz') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing quiz id');
    db()->prepare('DELETE FROM quizzes WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

// Teacher's edit view — INCLUDES correct_answer/explanation, unlike get_quiz_for_attempt.
if ($action === 'get_quiz_full') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respondError('Missing quiz id');
    $stmt = db()->prepare('SELECT * FROM quizzes WHERE id = ?');
    $stmt->execute([$id]);
    $quiz = $stmt->fetch();
    if (!$quiz) respondError('Quiz not found', 404);
    $stmt = db()->prepare('SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC, id ASC');
    $stmt->execute([$id]);
    $quiz['questions'] = array_map(function ($q) {
        $q['options_json'] = $q['options_json'] ? json_decode($q['options_json'], true) : null;
        return $q;
    }, $stmt->fetchAll());
    respond(['quiz' => $quiz]);
}

if ($action === 'create_question') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['quiz_id', 'question_type', 'question_text', 'correct_answer']);
    $validTypes = ['mcq', 'true_false', 'fill_blank', 'short_answer'];
    if (!in_array($body['question_type'], $validTypes, true)) respondError('Invalid question_type');

    $orderIndex = $body['order_index'] ?? null;
    if ($orderIndex === null) {
        $stmt = db()->prepare('SELECT COALESCE(MAX(order_index), 0) + 1 FROM quiz_questions WHERE quiz_id = ?');
        $stmt->execute([(int)$body['quiz_id']]);
        $orderIndex = (int)$stmt->fetchColumn();
    }
    $stmt = db()->prepare('INSERT INTO quiz_questions (quiz_id, question_bank_id, question_type, question_text, options_json, correct_answer, marks, explanation, topic, order_index)
                            VALUES (?,?,?,?,?,?,?,?,?,?)');
    try {
        $stmt->execute([
            (int)$body['quiz_id'], null, $body['question_type'], $body['question_text'],
            isset($body['options']) ? json_encode($body['options']) : null,
            $body['correct_answer'], (float)($body['marks'] ?? 1), $body['explanation'] ?? '', $body['topic'] ?? null, (int)$orderIndex,
        ]);
    } catch (PDOException $e) { respondError('Could not add question — check quiz_id exists.', 409); }
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

if ($action === 'delete_question') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) respondError('Missing question id');
    db()->prepare('DELETE FROM quiz_questions WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

// ── Question bank (reusable across quizzes) ──
if ($action === 'list_question_bank') {
    requireTeacherOrAdmin($authUser);
    $sql = 'SELECT * FROM question_bank';
    $where = []; $params = [];
    if (!empty($_GET['subject_id'])) { $where[] = 'subject_id = ?'; $params[] = (int)$_GET['subject_id']; }
    if (!empty($_GET['topic']))      { $where[] = 'topic = ?';      $params[] = $_GET['topic']; }
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    respond(['questions' => array_map(function ($q) {
        $q['options_json'] = $q['options_json'] ? json_decode($q['options_json'], true) : null;
        return $q;
    }, $stmt->fetchAll())]);
}

if ($action === 'create_bank_question') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['subject_id', 'question_type', 'question_text', 'correct_answer', 'created_by']);
    $stmt = db()->prepare('INSERT INTO question_bank (subject_id, topic, difficulty, question_type, question_text, options_json, correct_answer, marks, explanation, created_by)
                            VALUES (?,?,?,?,?,?,?,?,?,?)');
    try {
        $stmt->execute([
            (int)$body['subject_id'], $body['topic'] ?? null, $body['difficulty'] ?? 'medium', $body['question_type'],
            $body['question_text'], isset($body['options']) ? json_encode($body['options']) : null,
            $body['correct_answer'], (float)($body['marks'] ?? 1), $body['explanation'] ?? '', (int)$body['created_by'],
        ]);
    } catch (PDOException $e) { respondError('Could not create bank question — check subject_id/created_by exist.', 409); }
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

if ($action === 'add_question_from_bank') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['quiz_id', 'question_bank_id']);
    $stmt = db()->prepare('SELECT * FROM question_bank WHERE id = ?');
    $stmt->execute([(int)$body['question_bank_id']]);
    $bq = $stmt->fetch();
    if (!$bq) respondError('Bank question not found', 404);

    $stmt = db()->prepare('SELECT COALESCE(MAX(order_index), 0) + 1 FROM quiz_questions WHERE quiz_id = ?');
    $stmt->execute([(int)$body['quiz_id']]);
    $orderIndex = (int)$stmt->fetchColumn();

    db()->prepare('INSERT INTO quiz_questions (quiz_id, question_bank_id, question_type, question_text, options_json, correct_answer, marks, explanation, topic, order_index)
                    VALUES (?,?,?,?,?,?,?,?,?,?)')
        ->execute([(int)$body['quiz_id'], $bq['id'], $bq['question_type'], $bq['question_text'], $bq['options_json'], $bq['correct_answer'], $bq['marks'], $bq['explanation'], $bq['topic'], $orderIndex]);
    respond(['ok' => true, 'id' => db()->lastInsertId()]);
}

// Teacher's grading queue — attempts still needing manual (short_answer) grading.
if ($action === 'list_attempts') {
    requireTeacherOrAdmin($authUser);
    $quizId = (int)($_GET['quiz_id'] ?? 0);
    if (!$quizId) respondError('Missing quiz_id');
    $stmt = db()->prepare('SELECT qa.*, u.name AS student_name
                            FROM quiz_attempts qa JOIN users u ON u.id = qa.student_id
                            WHERE qa.quiz_id = ? AND qa.submitted_at IS NOT NULL
                            ORDER BY qa.submitted_at DESC');
    $stmt->execute([$quizId]);
    respond(['attempts' => $stmt->fetchAll()]);
}

if ($action === 'get_attempt_for_grading') {
    requireTeacherOrAdmin($authUser);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respondError('Missing attempt id');
    $stmt = db()->prepare('SELECT qa.*, u.name AS student_name FROM quiz_attempts qa JOIN users u ON u.id = qa.student_id WHERE qa.id = ?');
    $stmt->execute([$id]);
    $attempt = $stmt->fetch();
    if (!$attempt) respondError('Attempt not found', 404);

    $stmt = db()->prepare('SELECT aa.id AS answer_id, aa.student_answer, aa.is_correct, aa.marks_awarded,
                                   q.id AS question_id, q.question_type, q.question_text, q.correct_answer, q.marks, q.explanation
                            FROM quiz_attempt_answers aa JOIN quiz_questions q ON q.id = aa.question_id
                            WHERE aa.attempt_id = ? ORDER BY q.order_index ASC');
    $stmt->execute([$id]);
    $attempt['answers'] = $stmt->fetchAll();
    respond(['attempt' => $attempt]);
}

if ($action === 'grade_attempt_answer') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['answer_id', 'marks_awarded']);
    $stmt = db()->prepare('SELECT attempt_id FROM quiz_attempt_answers WHERE id = ?');
    $stmt->execute([(int)$body['answer_id']]);
    $attemptId = $stmt->fetchColumn();
    if (!$attemptId) respondError('Answer not found', 404);

    db()->prepare('UPDATE quiz_attempt_answers SET marks_awarded = ?, is_correct = ? WHERE id = ?')
        ->execute([(float)$body['marks_awarded'], isset($body['is_correct']) ? (int)(bool)$body['is_correct'] : null, (int)$body['answer_id']]);
    recomputeAttemptScore((int)$attemptId);
    respond(['ok' => true]);
}

// ════════════════════════ STUDENT: TAKE & VIEW RESULTS ════════════════════════

if ($action === 'get_quiz_for_attempt') {
    $id = (int)($_GET['id'] ?? 0);
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$id || !$studentId) respondError('Missing id or student_id');
    requireOwnStudent($studentId, $authUser);

    $stmt = db()->prepare('SELECT id, title, description, time_limit_minutes, max_attempts, randomize_questions, shuffle_options, status, available_from, available_until
                            FROM quizzes WHERE id = ?');
    $stmt->execute([$id]);
    $quiz = $stmt->fetch();
    if (!$quiz) respondError('Quiz not found', 404);
    if ($quiz['status'] !== 'published') respondError('This quiz is not currently available.', 403);

    $stmt = db()->prepare('SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?');
    $stmt->execute([$id, $studentId]);
    $attemptsUsed = (int)$stmt->fetchColumn();
    if ($attemptsUsed >= $quiz['max_attempts']) respondError('No attempts remaining for this quiz.', 403);
    $quiz['attemptsUsed'] = $attemptsUsed;
    $quiz['attemptsRemaining'] = $quiz['max_attempts'] - $attemptsUsed;

    $stmt = db()->prepare('SELECT id, question_type, question_text, options_json, marks FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC, id ASC');
    $stmt->execute([$id]);
    $questions = $stmt->fetchAll();
    // correct_answer/explanation deliberately never selected above — see file header.

    foreach ($questions as &$q) {
        $q['options'] = $q['options_json'] ? json_decode($q['options_json'], true) : null;
        unset($q['options_json']);
        if ($quiz['shuffle_options'] && is_array($q['options'])) shuffle($q['options']);
    }
    unset($q);
    if ($quiz['randomize_questions']) shuffle($questions);

    $quiz['questions'] = $questions;
    respond(['quiz' => $quiz]);
}

if ($action === 'start_attempt') {
    requireFields($body, ['quiz_id', 'student_id']);
    $quizId = (int)$body['quiz_id']; $studentId = (int)$body['student_id'];
    requireOwnStudent($studentId, $authUser);

    // Resume an already-started, not-yet-submitted attempt instead of
    // creating a duplicate if the student reloads the page mid-quiz.
    $stmt = db()->prepare('SELECT id FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? AND submitted_at IS NULL ORDER BY id DESC LIMIT 1');
    $stmt->execute([$quizId, $studentId]);
    $existing = $stmt->fetchColumn();
    if ($existing) respond(['ok' => true, 'attemptId' => (int)$existing, 'resumed' => true]);

    $stmt = db()->prepare('SELECT COALESCE(MAX(attempt_number), 0) + 1 FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?');
    $stmt->execute([$quizId, $studentId]);
    $attemptNumber = (int)$stmt->fetchColumn();

    $stmt = db()->prepare('SELECT COALESCE(SUM(marks), 0) FROM quiz_questions WHERE quiz_id = ?');
    $stmt->execute([$quizId]);
    $maxScore = (float)$stmt->fetchColumn();

    try {
        db()->prepare('INSERT INTO quiz_attempts (quiz_id, student_id, attempt_number, max_score) VALUES (?,?,?,?)')
            ->execute([$quizId, $studentId, $attemptNumber, $maxScore]);
    } catch (PDOException $e) { respondError('Could not start attempt — check quiz_id/student_id exist.', 409); }
    respond(['ok' => true, 'attemptId' => (int)db()->lastInsertId(), 'resumed' => false]);
}

if ($action === 'submit_attempt') {
    requireFields($body, ['attempt_id', 'answers']);
    $attemptId = (int)$body['attempt_id'];

    $stmt = db()->prepare('SELECT quiz_id, student_id, submitted_at FROM quiz_attempts WHERE id = ?');
    $stmt->execute([$attemptId]);
    $attempt = $stmt->fetch();
    if (!$attempt) respondError('Attempt not found', 404);
    requireOwnStudent((int)$attempt['student_id'], $authUser);
    if ($attempt['submitted_at']) respondError('This attempt was already submitted.', 409);

    $stmt = db()->prepare('SELECT id, question_type, correct_answer, marks FROM quiz_questions WHERE quiz_id = ?');
    $stmt->execute([$attempt['quiz_id']]);
    $questions = [];
    foreach ($stmt->fetchAll() as $q) $questions[$q['id']] = $q;

    $ins = db()->prepare('INSERT INTO quiz_attempt_answers (attempt_id, question_id, student_answer, is_correct, marks_awarded) VALUES (?,?,?,?,?)');
    foreach ($body['answers'] as $ans) {
        $qid = (int)($ans['question_id'] ?? 0);
        if (!isset($questions[$qid])) continue;
        $q = $questions[$qid];
        $studentAnswer = (string)($ans['student_answer'] ?? '');

        if (in_array($q['question_type'], ['mcq', 'true_false', 'fill_blank'], true)) {
            $isCorrect = normalizeAnswer($studentAnswer) === normalizeAnswer($q['correct_answer']);
            $marksAwarded = $isCorrect ? (float)$q['marks'] : 0.0;
        } else { // short_answer — left for manual grading
            $isCorrect = null; $marksAwarded = null;
        }
        $ins->execute([$attemptId, $qid, $studentAnswer, $isCorrect === null ? null : (int)$isCorrect, $marksAwarded]);
    }

    db()->prepare('UPDATE quiz_attempts SET submitted_at = NOW() WHERE id = ?')->execute([$attemptId]);
    recomputeAttemptScore($attemptId);
    respond(['ok' => true]);
}

if ($action === 'get_attempt_result') {
    $id = (int)($_GET['id'] ?? 0);
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$id || !$studentId) respondError('Missing id or student_id');
    requireOwnStudent($studentId, $authUser);

    $stmt = db()->prepare('SELECT qa.*, q.title AS quiz_title FROM quiz_attempts qa JOIN quizzes q ON q.id = qa.quiz_id WHERE qa.id = ? AND qa.student_id = ?');
    $stmt->execute([$id, $studentId]);
    $attempt = $stmt->fetch();
    if (!$attempt) respondError('Attempt not found', 404);

    // Explanations and correct answers ARE included here — this is the
    // post-submission result view spec §16 asks for, unlike the
    // pre-attempt get_quiz_for_attempt above.
    $stmt = db()->prepare('SELECT aa.student_answer, aa.is_correct, aa.marks_awarded,
                                   q.question_text, q.question_type, q.correct_answer, q.marks, q.explanation
                            FROM quiz_attempt_answers aa JOIN quiz_questions q ON q.id = aa.question_id
                            WHERE aa.attempt_id = ? ORDER BY q.order_index ASC');
    $stmt->execute([$id]);
    $attempt['answers'] = $stmt->fetchAll();
    respond(['attempt' => $attempt]);
}

if ($action === 'list_student_quizzes') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $stmt = db()->prepare("SELECT q.id, q.title, q.max_attempts, c.title AS course_title, sub.name AS subject_name,
                                   (SELECT COUNT(*) FROM quiz_attempts a WHERE a.quiz_id = q.id AND a.student_id = ?) AS attempts_used,
                                   (SELECT a.id FROM quiz_attempts a WHERE a.quiz_id = q.id AND a.student_id = ? ORDER BY a.attempt_number DESC LIMIT 1) AS latest_attempt_id,
                                   (SELECT a.score FROM quiz_attempts a WHERE a.quiz_id = q.id AND a.student_id = ? AND a.is_graded = 1 ORDER BY a.attempt_number DESC LIMIT 1) AS latest_score
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            JOIN quizzes q ON q.course_id = c.id AND q.status = 'published'
                            WHERE e.student_id = ?
                            ORDER BY q.created_at DESC");
    $stmt->execute([$studentId, $studentId, $studentId, $studentId]);
    respond(['quizzes' => $stmt->fetchAll()]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
