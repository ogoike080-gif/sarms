<?php
// ============================================================
// SARMS LMS — api/ai.php (Phase 9, spec §10-13)
//
// Two personas, sharing one Gemini call but different system
// prompts and context:
//   - student_tutor    — spec §10/§11: explains, hints, never just
//                         gives answers outright (Hint -> Explanation
//                         -> Guided solution -> Final answer).
//   - teacher_assistant — spec §13: generates draft content
//                         (questions, lesson plans, etc.) for the
//                         teacher to review/edit before anything is
//                         actually saved — this file never writes
//                         AI output into courses/quizzes/assignments
//                         directly; the frontend calls the existing
//                         Phase 8 create_bank_question etc. endpoints
//                         only after the teacher approves it.
//
// Context sent to Gemini is deliberately minimal (spec §12): class,
// subject, term, topic, current lesson, learning level, and the
// question/task itself. Never the student's name, email, password,
// or anything else from their account.
//
// Same auth position as every other Phase 4+ file: no server-side
// role check yet (MIGRATION_PLAN.md §4 step 5).
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

// ── Auth (Phase 11) — identical scheme to every other Phase 11-hardened file. ──
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

// ── AI cost control (spec §23) — per-user daily cap on Gemini calls,
// counted from real usage already being logged (learning_activities for
// students, ai_conversations for teacher-assistant generations), not a
// separate counter that could drift out of sync with what actually happened. ──
function enforceDailyAiLimit(int $userId, string $kind): void {
    $limit = (int)(getenv('AI_DAILY_LIMIT') ?: 50);
    if ($kind === 'tutor') {
        $stmt = db()->prepare("SELECT COUNT(*) FROM learning_activities WHERE student_id = ? AND activity_type = 'ai_tutor_session' AND created_at >= CURDATE()");
    } else {
        $stmt = db()->prepare("SELECT COUNT(*) FROM ai_conversations WHERE user_id = ? AND persona = 'teacher_assistant' AND started_at >= CURDATE()");
    }
    $stmt->execute([$userId]);
    if ((int)$stmt->fetchColumn() >= $limit) {
        respondError("Daily AI usage limit reached ($limit requests). Try again tomorrow.", 429);
    }
}
function requireFields(array $body, array $fields): void {
    foreach ($fields as $f) if (!isset($body[$f]) || $body[$f] === '') respondError("Missing required field: $f");
}
// Defensive: don't assume the mbstring extension is installed (found missing
// during testing) — fall back to plain substr() rather than fatal-erroring.
function safeTruncate(string $s, int $len): string {
    return function_exists('mb_substr') ? mb_substr($s, 0, $len) : substr($s, 0, $len);
}

// ── Gemini credentials: real env var first, local (git-ignored) file second ──
function geminiConfig(): array {
    static $config = null;
    if ($config !== null) return $config;

    $apiKey = getenv('GEMINI_API_KEY') ?: null;
    $model  = getenv('GEMINI_MODEL') ?: null;
    $maxTok = getenv('GEMINI_MAX_TOKENS') ?: null;

    $localFile = __DIR__ . '/gemini_config.php';
    if ((!$apiKey || !$model) && file_exists($localFile)) {
        $local = require $localFile;
        $apiKey = $apiKey ?: ($local['GEMINI_API_KEY'] ?? null);
        $model  = $model  ?: ($local['GEMINI_MODEL'] ?? null);
        $maxTok = $maxTok ?: ($local['MAX_OUTPUT_TOKENS'] ?? null);
    }

    $config = [
        'apiKey' => $apiKey,
        'model'  => $model ?: 'gemini-3.1-flash-lite',
        'maxOutputTokens' => (int)($maxTok ?: 800),
    ];
    return $config;
}

// ── The one function that actually talks to Gemini — isolated so the
// request/response handling around it (context building, DB writes,
// error handling) can be tested independently of network access. ──
function callGemini(string $systemInstruction, array $history, string $userMessage, ?string $forceJsonSchema = null): string {
    $cfg = geminiConfig();
    if (!$cfg['apiKey'] || $cfg['apiKey'] === 'your_api_key_here') {
        throw new RuntimeException('Gemini API key not configured. Set the GEMINI_API_KEY environment variable, or copy api/gemini_config.example.php to api/gemini_config.php and fill it in.');
    }

    $contents = $history; // [{role: 'user'|'model', parts: [{text}]}]
    $contents[] = ['role' => 'user', 'parts' => [['text' => $userMessage]]];

    $payload = [
        'system_instruction' => ['parts' => [['text' => $systemInstruction]]],
        'contents' => $contents,
        'generationConfig' => [
            'temperature' => 0.7,
            'maxOutputTokens' => $cfg['maxOutputTokens'],
        ],
    ];
    if ($forceJsonSchema) {
        $payload['generationConfig']['responseMimeType'] = 'application/json';
    }

    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$cfg['model']}:generateContent?key={$cfg['apiKey']}";
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        CURLOPT_TIMEOUT => 30,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) throw new RuntimeException('Could not reach Gemini: ' . $curlError);
    $decoded = json_decode($response, true);
    if ($httpCode !== 200) {
        $msg = $decoded['error']['message'] ?? "Gemini returned HTTP $httpCode";
        throw new RuntimeException('Gemini API error: ' . $msg);
    }
    $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? null;
    if ($text === null) throw new RuntimeException('Gemini returned an unexpected response shape.');
    return $text;
}

function appendAudit(string $action, ?array $newValue, ?string $userName): void {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute(['auditTrail']);
    $raw = $stmt->fetchColumn();
    $trail = $raw !== false ? json_decode($raw, true) : [];
    if (!is_array($trail)) $trail = [];
    $trail[] = ['id' => uniqid('audit_', true), 'userId' => null, 'userName' => $userName ?: 'Unknown',
                'action' => $action, 'details' => $action . ($newValue['title'] ?? '' ? ': ' . $newValue['title'] : ''), 'timestamp' => date('c')];
    db()->prepare('INSERT INTO sarms_data (slice_key, slice_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)')
        ->execute(['auditTrail', json_encode($trail, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$authUser = authenticatedUser();

// ════════════════════════ STUDENT TUTOR (spec §10, §11) ════════════════════════

$TUTOR_SYSTEM_PROMPT = <<<PROMPT
You are a patient, encouraging learning tutor for a Nigerian secondary school student, embedded in their school's learning platform.

You will be told the student's class, subject, term, and current topic/lesson — use this to pitch every explanation at the right level. Do not assume anything about the student beyond what's given.

Core behavior — you are a TUTOR, not an answer machine:
- For questions that have a "solve this" or homework-style answer, NEVER give the final answer immediately. Follow this order: Hint -> Explanation -> Guided solution -> Final answer. Ask a guiding question first and let the student attempt the next step before revealing more.
- For open "explain this" questions, you may explain directly, but simplify, use concrete examples relevant to the student's context, and check understanding.
- You can: explain concepts, simplify difficult topics, give examples, ask practice questions, generate short quizzes, give hints, explain why a wrong answer is wrong, create revision exercises, summarize lessons, generate flashcards, suggest study plans, and encourage active learning.
- Adapt your depth and tone to what the student's messages suggest about their current understanding.
- Keep responses focused and not too long — this is a chat, not an essay.
PROMPT;

if ($action === 'tutor_message') {
    requireFields($body, ['student_id', 'message']);
    $studentId = (int)$body['student_id'];
    requireOwnStudent($studentId, $authUser);
    enforceDailyAiLimit($studentId, 'tutor');
    $courseId  = !empty($body['course_id']) ? (int)$body['course_id'] : null;

    // Minimal context, built server-side from real enrollment/course data —
    // never trust class/subject/topic strings sent directly from the client.
    $context = ['learningLevel' => 'secondary school'];
    if ($courseId) {
        $stmt = db()->prepare('SELECT c.title AS topic, cl.name AS studentClass, sub.name AS subject, c.term_name AS term
                                FROM courses c JOIN classes cl ON cl.id = c.class_id JOIN subjects sub ON sub.id = c.subject_id
                                WHERE c.id = ?');
        $stmt->execute([$courseId]);
        $courseCtx = $stmt->fetch();
        if ($courseCtx) $context = array_merge($context, $courseCtx);
    }
    if (!empty($body['lesson_id'])) {
        $stmt = db()->prepare('SELECT title FROM lessons WHERE id = ?');
        $stmt->execute([(int)$body['lesson_id']]);
        $lessonTitle = $stmt->fetchColumn();
        if ($lessonTitle) $context['currentLesson'] = $lessonTitle;
    }
    $context['question'] = $body['message'];

    // Conversation: resume if given, else create.
    $conversationId = !empty($body['conversation_id']) ? (int)$body['conversation_id'] : null;
    if (!$conversationId) {
        db()->prepare("INSERT INTO ai_conversations (user_id, persona, course_id, title) VALUES (?, 'student_tutor', ?, ?)")
            ->execute([$studentId, $courseId, safeTruncate($body["message"], 60)]);
        $conversationId = (int)db()->lastInsertId();
    }

    $stmt = db()->prepare('SELECT sender, content FROM ai_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 20');
    $stmt->execute([$conversationId]);
    $history = array_map(fn($m) => ['role' => $m['sender'] === 'ai' ? 'model' : 'user', 'parts' => [['text' => $m['content']]]], $stmt->fetchAll());

    db()->prepare("INSERT INTO ai_messages (conversation_id, sender, content) VALUES (?, 'user', ?)")->execute([$conversationId, $body['message']]);

    try {
        $reply = callGemini($TUTOR_SYSTEM_PROMPT, $history, json_encode($context, JSON_UNESCAPED_UNICODE));
    } catch (Throwable $e) {
        respondError($e->getMessage(), 502);
    }

    db()->prepare("INSERT INTO ai_messages (conversation_id, sender, content) VALUES (?, 'ai', ?)")->execute([$conversationId, $reply]);
    db()->prepare('UPDATE ai_conversations SET last_message_at = NOW() WHERE id = ?')->execute([$conversationId]);
    db()->prepare("INSERT INTO learning_activities (student_id, course_id, activity_type) VALUES (?, ?, 'ai_tutor_session')")
        ->execute([$studentId, $courseId]);

    respond(['ok' => true, 'conversationId' => $conversationId, 'reply' => $reply]);
}

if ($action === 'list_tutor_conversations') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) respondError('Missing student_id');
    requireOwnStudent($studentId, $authUser);
    $stmt = db()->prepare("SELECT id, title, course_id, last_message_at FROM ai_conversations WHERE user_id = ? AND persona = 'student_tutor' ORDER BY last_message_at DESC");
    $stmt->execute([$studentId]);
    respond(['conversations' => $stmt->fetchAll()]);
}

if ($action === 'get_tutor_conversation') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respondError('Missing conversation id');
    // No student_id is passed for this action — verify ownership by looking
    // up who the conversation actually belongs to, the same pattern used in
    // quizzes.php's submit_attempt (attempt_id alone, no student_id either).
    $stmt = db()->prepare("SELECT user_id FROM ai_conversations WHERE id = ?");
    $stmt->execute([$id]);
    $ownerId = $stmt->fetchColumn();
    if ($ownerId === false) respondError('Conversation not found', 404);
    requireOwnStudent((int)$ownerId, $authUser);
    $stmt = db()->prepare('SELECT sender, content, created_at FROM ai_messages WHERE conversation_id = ? ORDER BY created_at ASC');
    $stmt->execute([$id]);
    respond(['messages' => $stmt->fetchAll()]);
}

// ════════════════════════ TEACHER ASSISTANT (spec §13) ════════════════════════

$TEACHER_SYSTEM_PROMPT = <<<PROMPT
You are a teaching assistant for a secondary school teacher in Nigeria, embedded in their school's learning platform. You help draft teaching content that the teacher will review and edit before publishing — you are producing a draft, not a final artifact, so prioritize being genuinely useful over being overly polished.
PROMPT;

if ($action === 'generate_mcq') {
    requireTeacherOrAdmin($authUser);
    enforceDailyAiLimit($authUser['id'], 'teacher');
    requireFields($body, ['teacher_id', 'subject_name', 'topic', 'count']);
    $count = min((int)$body['count'], 30);
    $difficulty = $body['difficulty'] ?? 'mixed';

    $task = "Generate {$count} multiple-choice questions for {$body['subject_name']}"
          . (!empty($body['class_name']) ? " for {$body['class_name']} students" : '')
          . ", on the topic: {$body['topic']}. Difficulty: {$difficulty}.\n\n"
          . 'Respond with ONLY a JSON array, no other text, where each item has exactly this shape: '
          . '{"question": string, "options": {"A": string, "B": string, "C": string, "D": string}, '
          . '"correct_answer": "A"|"B"|"C"|"D", "explanation": string, "difficulty": "easy"|"medium"|"hard", "topic": string}';

    try {
        $raw = callGemini($TEACHER_SYSTEM_PROMPT, [], $task, 'json');
    } catch (Throwable $e) {
        respondError($e->getMessage(), 502);
    }

    $questions = json_decode($raw, true);
    if (!is_array($questions)) {
        // Gemini occasionally wraps JSON in ```json fences despite instructions — one repair attempt before giving up.
        $cleaned = trim(preg_replace('/^```json\s*|\s*```$/m', '', $raw));
        $questions = json_decode($cleaned, true);
    }
    if (!is_array($questions)) {
        respond(['ok' => false, 'error' => 'Gemini did not return valid JSON — try again.', 'raw' => $raw], 502);
    }

    db()->prepare("INSERT INTO ai_conversations (user_id, persona, subject_id, title) VALUES (?, 'teacher_assistant', ?, ?)")
        ->execute([(int)$body['teacher_id'], !empty($body['subject_id']) ? (int)$body['subject_id'] : null, "MCQ: {$body['topic']}"]);
    appendAudit('AI-generated MCQ draft', ['title' => $body['topic']], $body['actorName'] ?? null);

    respond(['ok' => true, 'questions' => $questions]);
}

if ($action === 'generate_content') {
    requireTeacherOrAdmin($authUser);
    enforceDailyAiLimit($authUser['id'], 'teacher');
    requireFields($body, ['teacher_id', 'task_type', 'details']);
    $validTasks = ['lesson_plan', 'class_activity', 'assignment', 'revision_questions', 'marking_guide', 'explanation', 'summarize_material'];
    if (!in_array($body['task_type'], $validTasks, true)) respondError('Invalid task_type');

    $taskLabels = [
        'lesson_plan' => 'a lesson plan', 'class_activity' => 'a class activity', 'assignment' => 'an assignment',
        'revision_questions' => 'a set of revision questions', 'marking_guide' => 'a marking guide',
        'explanation' => 'a clear explanation', 'summarize_material' => 'a summary',
    ];
    $task = 'Generate ' . $taskLabels[$body['task_type']] . '. Details: ' . $body['details'];

    try {
        $result = callGemini($TEACHER_SYSTEM_PROMPT, [], $task);
    } catch (Throwable $e) {
        respondError($e->getMessage(), 502);
    }

    db()->prepare("INSERT INTO ai_conversations (user_id, persona, title) VALUES (?, 'teacher_assistant', ?)")
        ->execute([(int)$body['teacher_id'], ucfirst(str_replace('_', ' ', $body['task_type']))]);
    appendAudit('AI-generated ' . str_replace('_', ' ', $body['task_type']), ['title' => safeTruncate($body['details'], 60)], $body['actorName'] ?? null);

    respond(['ok' => true, 'result' => $result]);
}

// ════════════════════════ ANALYTICS INSIGHTS (Admin dashboard) ════════════════════════
// Powers the "Generate Insights" button on the Analytics page. Takes the
// already-computed class/subject/top-student stats from the frontend
// (no extra DB query needed here — the frontend has already assembled
// exactly what it wants summarized) and asks Gemini to turn it into a
// few plain-English, actionable observations.
if ($action === 'analytics_insights') {
    requireTeacherOrAdmin($authUser);
    requireFields($body, ['context']);

    $systemPrompt = 'You are an academic analytics assistant for a Nigerian secondary school. '
        . 'Given class averages, subject averages, and top students as JSON, '
        . 'write 3-4 short, specific, actionable insights in plain text — no markdown, no headers, '
        . 'just clear sentences. Focus on performance gaps between classes/subjects, notable '
        . 'strengths, and one or two concrete recommendations a school admin could act on.';

    try {
        $result = callGemini($systemPrompt, [], json_encode($body['context'], JSON_UNESCAPED_UNICODE));
    } catch (Throwable $e) {
        respondError($e->getMessage(), 502);
    }

    respond(['ok' => true, 'result' => $result]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
