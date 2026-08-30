<?php
// ============================================================
// SARMS LMS — api/analytics.php (Phase 10, spec §14-15)
//
// HARD RULE from spec §14: "Do not allow AI to invent performance
// data. All performance statistics must originate from actual
// database records." Every number in this file — strong/weak
// subjects, weak topics, improving/declining trends, incomplete
// lessons, failed quizzes — is computed by plain SQL/PHP from
// real rows. Gemini is never involved in producing any of them.
//
// The ONE optional exception is get_ai_summary, which takes the
// already-computed real data and asks Gemini only to phrase it as
// a short paragraph — with an explicit instruction not to add any
// fact not present in that data. The rest of the analytics/
// recommendation engine works completely without it.
//
// Same auth position as every Phase 4+ file: no server-side role
// check yet (MIGRATION_PLAN.md §4 step 5).
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

// ── Auth (Phase 11) — identical scheme to api/quizzes.php/auth_jwt.php. ──
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
// Analytics is deliberately conservative: a student's own data, or admin —
// not teachers, since no teacher-facing analytics view exists yet and this
// avoids having to verify "assigned to them" (spec §21) without one.
function requireOwnStudentOrAdmin(int $requestedStudentId, array $authUser): void {
    if ($authUser['role'] === 'admin') return;
    if ($authUser['role'] !== 'student' || $authUser['id'] !== $requestedStudentId) {
        respondError('You can only access your own performance data.', 403);
    }
}

// Same rate-limit approach as ai.php's enforceDailyAiLimit — counted from
// real logged usage, duplicated here rather than shared per this project's
// established self-contained-file convention. get_ai_summary doesn't create
// an ai_conversations row (it's a one-off summary, not a back-and-forth
// conversation — a deliberate Phase 10 choice), so this logs its own
// learning_activities row on each call, matching how ai.php's tutor
// sessions are already tracked, and counts against that.
function enforceDailyAiSummaryLimit(int $studentId): void {
    $limit = (int)(getenv('AI_DAILY_LIMIT') ?: 50);
    $stmt = db()->prepare("SELECT COUNT(*) FROM learning_activities WHERE student_id = ? AND activity_type = 'ai_summary' AND created_at >= CURDATE()");
    $stmt->execute([$studentId]);
    if ((int)$stmt->fetchColumn() >= $limit) {
        respondError("Daily AI usage limit reached ($limit requests). Try again tomorrow.", 429);
    }
}

// ── grading thresholds, read from the same admin-configurable gradingSystem
// the rest of the app already uses (sarms_data blob), so "strong"/"weak"
// here means the same thing the report cards mean — not a separately
// invented scale. Falls back to the app's own default if unset. ──
function gradingThresholds(): array {
    $default = [
        ['min' => 70, 'max' => 100, 'grade' => 'A'], ['min' => 60, 'max' => 69, 'grade' => 'B'],
        ['min' => 50, 'max' => 59, 'grade' => 'C'], ['min' => 40, 'max' => 49, 'grade' => 'D'],
        ['min' => 0,  'max' => 39, 'grade' => 'F'],
    ];
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute(['gradingSystem']);
    $raw = $stmt->fetchColumn();
    $system = $raw !== false ? json_decode($raw, true) : null;
    if (!is_array($system) || count($system) === 0) $system = $default;

    usort($system, fn($a, $b) => $b['min'] <=> $a['min']);
    $nonF = array_values(array_filter($system, fn($g) => strtoupper($g['grade']) !== 'F'));
    $strongMin = $nonF[0]['min'] ?? 70;
    $passMin   = end($nonF)['min'] ?? 40;
    return ['strongMin' => (float)$strongMin, 'passMin' => (float)$passMin];
}

// ── The core, 100% real-data analytics computation. Both get_student_insight
// and get_recommendations call this so the two never drift out of sync. ──
function computeInsight(int $studentId): array {
    $pdo = db();
    $thresholds = gradingThresholds();
    $strongMin = $thresholds['strongMin'];
    $passMin   = $thresholds['passMin'];

    // Per-subject: combine result-sheet scores (ca+exam) and graded quiz
    // percentages, wherever each exists — never fabricated for a subject
    // with no records at all (that subject is simply omitted).
    $stmt = $pdo->prepare('SELECT sub.id, sub.name, AVG(s.ca + s.exam) AS avg_score, COUNT(*) AS n
                            FROM scores s JOIN subjects sub ON sub.id = s.subject_id
                            WHERE s.student_id = ? GROUP BY sub.id');
    $stmt->execute([$studentId]);
    $resultsBySubject = [];
    foreach ($stmt->fetchAll() as $r) $resultsBySubject[$r['id']] = ['name' => $r['name'], 'avg' => (float)$r['avg_score'], 'n' => (int)$r['n']];

    $stmt = $pdo->prepare("SELECT sub.id, sub.name, AVG(qa.score / NULLIF(qa.max_score, 0) * 100) AS avg_pct, COUNT(*) AS n
                            FROM quiz_attempts qa
                            JOIN quizzes q ON q.id = qa.quiz_id
                            JOIN courses c ON c.id = q.course_id
                            JOIN subjects sub ON sub.id = c.subject_id
                            WHERE qa.student_id = ? AND qa.is_graded = 1
                            GROUP BY sub.id");
    $stmt->execute([$studentId]);
    $quizBySubject = [];
    foreach ($stmt->fetchAll() as $r) $quizBySubject[$r['id']] = ['name' => $r['name'], 'avg' => (float)$r['avg_pct'], 'n' => (int)$r['n']];

    $subjectIds = array_unique(array_merge(array_keys($resultsBySubject), array_keys($quizBySubject)));
    $subjects = [];
    foreach ($subjectIds as $sid) {
        $parts = [];
        if (isset($resultsBySubject[$sid])) $parts[] = $resultsBySubject[$sid]['avg'];
        if (isset($quizBySubject[$sid]))    $parts[] = $quizBySubject[$sid]['avg'];
        $avg = round(array_sum($parts) / count($parts), 1);
        $level = $avg >= $strongMin ? 'strong' : ($avg < $passMin ? 'weak' : 'average');
        $subjects[] = [
            'subjectId' => $sid, 'subject' => $resultsBySubject[$sid]['name'] ?? $quizBySubject[$sid]['name'],
            'avgScore' => $avg, 'level' => $level,
            'sources' => ['resultsAvg' => $resultsBySubject[$sid]['avg'] ?? null, 'quizAvg' => $quizBySubject[$sid]['avg'] ?? null],
        ];
    }
    usort($subjects, fn($a, $b) => $b['avgScore'] <=> $a['avgScore']);

    // Topic-level accuracy — only auto-gradable answers count (is_correct IS NOT NULL),
    // and only topics with at least 2 answered questions, to avoid single-question noise.
    $stmt = $pdo->prepare("SELECT q.topic, COUNT(*) AS n, SUM(aa.is_correct) AS correct, SUM(aa.is_correct = 0) AS incorrect
                            FROM quiz_attempt_answers aa
                            JOIN quiz_attempts qat ON qat.id = aa.attempt_id
                            JOIN quiz_questions q ON q.id = aa.question_id
                            WHERE qat.student_id = ? AND aa.is_correct IS NOT NULL AND q.topic IS NOT NULL AND q.topic != ''
                            GROUP BY q.topic HAVING n >= 2");
    $stmt->execute([$studentId]);
    $topicRows = $stmt->fetchAll();
    $weakTopics = []; $strongTopics = [];
    foreach ($topicRows as $t) {
        $pct = round(((int)$t['correct'] / (int)$t['n']) * 100, 1);
        if ($pct < $passMin) $weakTopics[] = ['topic' => $t['topic'], 'accuracy' => $pct, 'answered' => (int)$t['n']];
        elseif ($pct >= $strongMin) $strongTopics[] = ['topic' => $t['topic'], 'accuracy' => $pct, 'answered' => (int)$t['n']];
    }

    // Frequently incorrect concepts — ranked by raw incorrect count (distinct
    // from weakTopics' percentage view; spec §14 lists both separately).
    $stmt = $pdo->prepare("SELECT q.topic, SUM(aa.is_correct = 0) AS incorrect_count
                            FROM quiz_attempt_answers aa
                            JOIN quiz_attempts qat ON qat.id = aa.attempt_id
                            JOIN quiz_questions q ON q.id = aa.question_id
                            WHERE qat.student_id = ? AND aa.is_correct = 0 AND q.topic IS NOT NULL AND q.topic != ''
                            GROUP BY q.topic ORDER BY incorrect_count DESC LIMIT 5");
    $stmt->execute([$studentId]);
    $frequentlyIncorrect = $stmt->fetchAll();

    // Improving / declining — chronological first-half vs second-half comparison
    // of quiz percentages per subject (scores table lacks a reliable per-entry
    // timestamp ordering meaningful within a single term, so this uses quiz
    // history specifically, where each attempt has a real submitted_at).
    $stmt = $pdo->prepare("SELECT sub.id AS subject_id, sub.name, qa.score / NULLIF(qa.max_score, 0) * 100 AS pct, qa.submitted_at
                            FROM quiz_attempts qa
                            JOIN quizzes q ON q.id = qa.quiz_id JOIN courses c ON c.id = q.course_id JOIN subjects sub ON sub.id = c.subject_id
                            WHERE qa.student_id = ? AND qa.is_graded = 1 AND qa.submitted_at IS NOT NULL
                            ORDER BY sub.id, qa.submitted_at ASC");
    $stmt->execute([$studentId]);
    $grouped = [];
    foreach ($stmt->fetchAll() as $r) { $grouped[$r['subject_id']]['name'] = $r['name']; $grouped[$r['subject_id']]['pcts'][] = (float)$r['pct']; }
    $improving = []; $declining = [];
    foreach ($grouped as $sid => $g) {
        $pcts = $g['pcts'];
        if (count($pcts) < 4) continue; // need at least 2 per half to mean anything
        $mid = intdiv(count($pcts), 2);
        $firstAvg = array_sum(array_slice($pcts, 0, $mid)) / $mid;
        $secondAvg = array_sum(array_slice($pcts, $mid)) / (count($pcts) - $mid);
        $delta = round($secondAvg - $firstAvg, 1);
        if ($delta >= 5) $improving[] = ['subject' => $g['name'], 'change' => $delta];
        elseif ($delta <= -5) $declining[] = ['subject' => $g['name'], 'change' => $delta];
    }

    // Incomplete lessons — published lessons in enrolled+published courses
    // with no 'completed' progress row for this student.
    $stmt = $pdo->prepare("SELECT c.title AS course, l.title AS lesson, l.id AS lesson_id, c.id AS course_id,
                                   COALESCE(sp.status, 'not_started') AS status
                            FROM course_enrollments e
                            JOIN courses c ON c.id = e.course_id AND c.is_published = 1
                            JOIN modules m ON m.course_id = c.id
                            JOIN lessons l ON l.module_id = m.id AND l.is_published = 1
                            LEFT JOIN student_progress sp ON sp.student_id = e.student_id AND sp.lesson_id = l.id
                            WHERE e.student_id = ? AND (sp.status IS NULL OR sp.status != 'completed')
                            ORDER BY c.title, m.order_index, l.order_index");
    $stmt->execute([$studentId]);
    $incompleteLessons = $stmt->fetchAll();

    // Failed quizzes — graded attempts below the pass threshold.
    $stmt = $pdo->prepare("SELECT qa.id AS attempt_id, q.id AS quiz_id, q.title, qa.score, qa.max_score,
                                   ROUND(qa.score / NULLIF(qa.max_score, 0) * 100, 1) AS pct, qa.attempt_number, q.max_attempts
                            FROM quiz_attempts qa JOIN quizzes q ON q.id = qa.quiz_id
                            WHERE qa.student_id = ? AND qa.is_graded = 1 AND (qa.score / NULLIF(qa.max_score, 0) * 100) < ?
                            ORDER BY qa.submitted_at DESC");
    $stmt->execute([$studentId, $passMin]);
    $failedQuizzes = $stmt->fetchAll();

    return [
        'thresholds' => $thresholds,
        'subjects' => $subjects,
        'weakTopics' => $weakTopics,
        'strongTopics' => $strongTopics,
        'frequentlyIncorrectConcepts' => $frequentlyIncorrect,
        'improvingSubjects' => $improving,
        'decliningSubjects' => $declining,
        'incompleteLessons' => $incompleteLessons,
        'failedQuizzes' => $failedQuizzes,
    ];
}

// ── Recommendation engine (spec §15) — every recommendation points at a
// real lesson/quiz that actually exists, found by querying for it, never
// invented. ──
function computeRecommendations(int $studentId, array $insight): array {
    $pdo = db();
    $recommendations = [];

    $weakSubjectIds = array_map(fn($s) => $s['subjectId'], array_filter($insight['subjects'], fn($s) => $s['level'] === 'weak'));

    foreach ($weakSubjectIds as $subjectId) {
        // an incomplete lesson within a course for this weak subject
        $stmt = $pdo->prepare("SELECT c.id AS course_id, c.title AS course_title, l.id AS lesson_id, l.title AS lesson_title
                                FROM course_enrollments e
                                JOIN courses c ON c.id = e.course_id AND c.is_published = 1 AND c.subject_id = ?
                                JOIN modules m ON m.course_id = c.id
                                JOIN lessons l ON l.module_id = m.id AND l.is_published = 1
                                LEFT JOIN student_progress sp ON sp.student_id = e.student_id AND sp.lesson_id = l.id
                                WHERE e.student_id = ? AND (sp.status IS NULL OR sp.status != 'completed')
                                ORDER BY m.order_index, l.order_index LIMIT 1");
        $stmt->execute([$subjectId, $studentId]);
        $lesson = $stmt->fetch();
        if ($lesson) {
            $recommendations[] = ['type' => 'review_lesson', 'title' => "Review: {$lesson['lesson_title']}",
                'courseId' => (int)$lesson['course_id'], 'lessonId' => (int)$lesson['lesson_id']];
        }

        // a published quiz in that subject the student hasn't passed yet
        $stmt = $pdo->prepare("SELECT q.id AS quiz_id, q.title, c.id AS course_id
                                FROM course_enrollments e
                                JOIN courses c ON c.id = e.course_id AND c.is_published = 1 AND c.subject_id = ?
                                JOIN quizzes q ON q.course_id = c.id AND q.status = 'published'
                                LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.student_id = e.student_id
                                    AND (qa.score / NULLIF(qa.max_score, 0) * 100) >= ?
                                WHERE e.student_id = ? AND qa.id IS NULL
                                LIMIT 1");
        $stmt->execute([$subjectId, $insight['thresholds']['passMin'], $studentId]);
        $quiz = $stmt->fetch();
        if ($quiz) {
            $recommendations[] = ['type' => 'take_quiz', 'title' => "Practice quiz: {$quiz['title']}",
                'courseId' => (int)$quiz['course_id'], 'quizId' => (int)$quiz['quiz_id']];
        }

        $stmt = $pdo->prepare('SELECT name FROM subjects WHERE id = ?');
        $stmt->execute([$subjectId]);
        $subjectName = $stmt->fetchColumn();
        $recommendations[] = ['type' => 'ask_ai_tutor', 'title' => "Ask AI Tutor for a simplified explanation of {$subjectName}", 'subject' => $subjectName];
    }

    // Failed quizzes with attempts remaining -> explicit retake recommendation
    foreach ($insight['failedQuizzes'] as $fq) {
        if ((int)$fq['attempt_number'] < (int)$fq['max_attempts']) {
            $recommendations[] = ['type' => 'retake_quiz', 'title' => "Retake: {$fq['title']} (scored {$fq['pct']}%)", 'quizId' => (int)$fq['quiz_id']];
        }
    }

    return $recommendations;
}

// ── Gemini phrasing layer (optional, spec §14's "AI-based" framing) —
// self-contained, mirrors api/ai.php's callGemini(). Duplicated rather
// than shared via include, matching every other API file in this project
// being independently self-contained. ──
function geminiConfig(): array {
    static $config = null;
    if ($config !== null) return $config;
    $apiKey = getenv('GEMINI_API_KEY') ?: null;
    $model  = getenv('GEMINI_MODEL') ?: null;
    $localFile = __DIR__ . '/gemini_config.php';
    if (!$apiKey && file_exists($localFile)) {
        $local = require $localFile;
        $apiKey = $local['GEMINI_API_KEY'] ?? null;
        $model  = $model ?: ($local['GEMINI_MODEL'] ?? null);
    }
    $config = ['apiKey' => $apiKey, 'model' => $model ?: 'gemini-3.1-flash-lite'];
    return $config;
}

function callGeminiForSummary(array $realData): string {
    $cfg = geminiConfig();
    if (!$cfg['apiKey'] || $cfg['apiKey'] === 'your_api_key_here') {
        throw new RuntimeException('Gemini API key not configured — see BUILD_AND_INSTALL.md.');
    }
    $systemInstruction = 'You summarize student performance data for a secondary school platform. '
        . 'You will be given real, already-computed statistics as JSON. Describe ONLY what is in that data, '
        . 'in an encouraging, plain-language paragraph (3-5 sentences). '
        . 'Do NOT invent, estimate, or add any subject, topic, score, or fact that is not explicitly present in the JSON.';
    $payload = [
        'system_instruction' => ['parts' => [['text' => $systemInstruction]]],
        'contents' => [['role' => 'user', 'parts' => [['text' => json_encode($realData, JSON_UNESCAPED_UNICODE)]]]],
        'generationConfig' => ['temperature' => 0.4, 'maxOutputTokens' => 300],
    ];
    $ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/{$cfg['model']}:generateContent?key={$cfg['apiKey']}");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE), CURLOPT_TIMEOUT => 30,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    if ($curlError) throw new RuntimeException('Could not reach Gemini: ' . $curlError);
    $decoded = json_decode($response, true);
    if ($httpCode !== 200) throw new RuntimeException('Gemini API error: ' . ($decoded['error']['message'] ?? "HTTP $httpCode"));
    $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? null;
    if ($text === null) throw new RuntimeException('Gemini returned an unexpected response shape.');
    return $text;
}

$action = $_GET['action'] ?? '';
$authUser = authenticatedUser();

if ($action === 'get_student_insight') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudentOrAdmin($studentId, $authUser);
    respond(['insight' => computeInsight($studentId)]);
}

if ($action === 'get_recommendations') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudentOrAdmin($studentId, $authUser);
    $insight = computeInsight($studentId);
    respond(['recommendations' => computeRecommendations($studentId, $insight)]);
}

if ($action === 'get_ai_summary') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudentOrAdmin($studentId, $authUser);
    enforceDailyAiSummaryLimit($studentId);
    $insight = computeInsight($studentId);
    try {
        $summary = callGeminiForSummary($insight);
    } catch (Throwable $e) {
        respondError($e->getMessage(), 502);
    }
    db()->prepare("INSERT INTO learning_activities (student_id, activity_type) VALUES (?, 'ai_summary')")->execute([$studentId]);
    respond(['ok' => true, 'summary' => $summary]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
