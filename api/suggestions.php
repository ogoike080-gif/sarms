<?php
// ============================================================
// SARMS — api/suggestions.php
//
// Parent <-> Admin/Principal two-way conversation threads
// ("Suggest an Improvement"). This intentionally does NOT go
// through db.php's generic save_* mechanism: that mechanism lets
// any caller overwrite an entire slice with whatever JSON they
// send, with no permission check at all. For a feature where one
// parent's private conversation must never be readable or
// writable by another parent, that's not good enough — every
// action here is authenticated (JWT, same scheme as auth_jwt.php)
// and every read/write is scoped server-side to what that specific
// user is allowed to see or touch, never trusting a client-sent ID.
//
// Storage still reuses the existing sarms_data slice mechanism
// (one JSON blob under slice_key='suggestions') rather than new
// SQL tables — this app has no relational schema for any of its
// other features either (announcements, payments, attendance all
// work the same way), so a bespoke table pair here would be an
// inconsistent one-off. The validation this feature actually needs
// is enforced in this file, not by the storage shape.
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

// ── Auth — identical scheme to auth_jwt.php / ai.php ───────────────────────
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
// Returns ['id' => normalized-table numeric id, 'role' => ..., 'legacyId' => the
// blob's string id — e.g. "u_ab12cd" — which is what suggestions.parentId /
// senderId are actually stored as, since every other part of the app
// (state.users, everything the React frontend does) uses that string id,
// not the normalized table's numeric one. Without this bridge, an ownership
// check here would compare two IDs that never match by construction.
function authenticatedUser(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null);
    $token = ($header && preg_match('/^Bearer\s+(.+)$/i', $header, $m)) ? $m[1] : null;
    $payload = verifyToken($token);
    if (!$payload) respondError('Authentication required — please log in again.', 401);
    $stmt = db()->prepare('SELECT legacy_id, name FROM users WHERE id = ?');
    $stmt->execute([(int)$payload['sub']]);
    $row = $stmt->fetch();
    if (!$row) respondError('Account not found.', 401);
    return ['id' => (int)$payload['sub'], 'role' => $payload['role'], 'legacyId' => $row['legacy_id'], 'name' => $row['name']];
}
function requireParent(array $authUser): void {
    if ($authUser['role'] !== 'parent') respondError('Parent access required.', 403);
}
function requireReviewer(array $authUser): void {
    if (!in_array($authUser['role'], ['admin', 'principal'], true)) respondError('Admin or principal access required.', 403);
}
function requireFields(array $body, array $fields): void {
    foreach ($fields as $f) if (!isset($body[$f]) || $body[$f] === '') respondError("Missing required field: $f");
}
function generateId(): string {
    return 'sg_' . bin2hex(random_bytes(6));
}
// Defensive: don't assume mbstring is installed.
function safeTruncate(string $s, int $len): string {
    return function_exists('mb_substr') ? mb_substr($s, 0, $len) : substr($s, 0, $len);
}
// Basic sanitization: strip tags so a message can never inject HTML/script
// into either the parent's or admin's view of the thread. Plain text only.
function sanitizeText(string $s): string {
    return trim(strip_tags($s));
}

// ── Storage (same slice mechanism as db.php, read/written here directly
//    so this file owns every write to 'suggestions' and can validate first) ──
function readSuggestions(): array {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute(['suggestions']);
    $val = $stmt->fetchColumn();
    $all = $val !== false ? json_decode($val, true) : [];
    return is_array($all) ? migrateOldShape($all) : [];
}
function writeSuggestions(array $all): void {
    db()->prepare('INSERT INTO sarms_data (slice_key, slice_value) VALUES (?, ?)
                   ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)')
       ->execute(['suggestions', json_encode($all, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
}

// One-time, idempotent migration: the original "Suggest an Improvement"
// feature stored one message + one optional admin reply per suggestion,
// flat on the record itself. Any record missing a `messages` array is in
// that old shape — convert it in place (both the original suggestion and
// the existing admin reply are preserved as the first two chat messages)
// so nothing already submitted is lost when this ships.
function migrateOldShape(array $all): array {
    $changed = false;
    $out = [];
    foreach ($all as $s) {
        if (isset($s['messages']) && is_array($s['messages'])) { $out[] = $s; continue; }
        $changed = true;
        $messages = [[
            'id' => generateId(), 'senderRole' => 'parent',
            'senderName' => $s['authorName'] ?? 'Parent',
            'text' => $s['message'] ?? '', 'createdAt' => $s['date'] ?? gmdate('c'),
        ]];
        if (!empty($s['adminResponse'])) {
            $messages[] = [
                'id' => generateId(), 'senderRole' => 'admin',
                'senderName' => $s['respondedByName'] ?? 'Admin',
                'text' => $s['adminResponse'], 'createdAt' => $s['respondedAt'] ?? ($s['date'] ?? gmdate('c')),
            ];
        }
        $out[] = [
            'id' => $s['id'] ?? generateId(),
            'parentId' => $s['authorId'] ?? '',
            'parentName' => $s['authorName'] ?? 'Parent',
            'studentName' => $s['studentName'] ?? '',
            'category' => $s['category'] ?? 'Other',
            'subject' => $s['category'] ?? 'Suggestion',
            'status' => $s['status'] ?? 'New',
            'parentUnread' => false,
            'createdAt' => $s['date'] ?? gmdate('c'),
            'updatedAt' => $s['respondedAt'] ?? ($s['date'] ?? gmdate('c')),
            'closedAt' => ($s['status'] ?? '') === 'Closed' ? ($s['respondedAt'] ?? '') : '',
            'messages' => $messages,
        ];
    }
    if ($changed) writeSuggestions($out); // persist the migration immediately, not just in-memory
    return $out;
}

// Resolves the parent's linked child's name from the blob users list —
// kept separate from the normalized table since childId only lives in
// the blob today.
function studentNameFor(string $parentLegacyId): string {
    $stmt = db()->prepare("SELECT slice_value FROM sarms_data WHERE slice_key = 'users'");
    $stmt->execute();
    $usersJson = $stmt->fetchColumn();
    $users = $usersJson ? (json_decode($usersJson, true) ?: []) : [];
    $parent = null;
    foreach ($users as $u) if (($u['id'] ?? null) === $parentLegacyId) { $parent = $u; break; }
    if (!$parent || empty($parent['childId'])) return '';
    foreach ($users as $u) if (($u['id'] ?? null) === $parent['childId']) return $u['name'] ?? '';
    return '';
}

$action  = $_GET['action'] ?? '';
$body    = json_decode(file_get_contents('php://input'), true) ?? [];
$authUser = authenticatedUser(); // every action below requires a valid session

// ── LIST — parent sees only their own threads; admin/principal see all ──
if ($action === 'list') {
    $all = readSuggestions();
    if ($authUser['role'] === 'parent') {
        $all = array_values(array_filter($all, fn($t) => ($t['parentId'] ?? null) === $authUser['legacyId']));
    } else {
        requireReviewer($authUser);
    }
    // newest activity first
    usort($all, fn($a, $b) => strcmp($b['updatedAt'] ?? '', $a['updatedAt'] ?? ''));
    respond(['ok' => true, 'threads' => $all]);
}

// ── CREATE — parent starts a new conversation ──────────────────────────
if ($action === 'create') {
    requireParent($authUser);
    requireFields($body, ['category', 'subject', 'message']);
    $message = sanitizeText((string)$body['message']);
    $subject = sanitizeText((string)$body['subject']);
    if ($message === '' || $subject === '') respondError('Subject and message cannot be empty.');

    $now = gmdate('c');
    $thread = [
        'id' => generateId(),
        'parentId' => $authUser['legacyId'],
        'parentName' => $authUser['name'],
        'studentName' => studentNameFor($authUser['legacyId']),
        'category' => sanitizeText((string)$body['category']),
        'subject' => safeTruncate($subject, 120),
        'status' => 'New',
        'parentUnread' => false,
        'createdAt' => $now,
        'updatedAt' => $now,
        'closedAt' => '',
        'messages' => [[
            'id' => generateId(), 'senderRole' => 'parent', 'senderName' => $authUser['name'],
            'text' => safeTruncate($message, 4000), 'createdAt' => $now,
        ]],
    ];
    $all = readSuggestions();
    array_unshift($all, $thread);
    writeSuggestions($all);
    respond(['ok' => true, 'thread' => $thread]);
}

// Every action below acts on one existing thread — load + locate it once.
if (in_array($action, ['reply', 'set_status', 'mark_read'], true)) {
    requireFields($body, ['threadId']);
    $all = readSuggestions();
    $idx = null;
    foreach ($all as $i => $t) if ($t['id'] === $body['threadId']) { $idx = $i; break; }
    if ($idx === null) respondError('Conversation not found.', 404);
    $thread = $all[$idx];

    // Ownership check — a parent may only ever touch their own thread,
    // checked here against the server-resolved legacyId, never against
    // anything the client claims about itself.
    if ($authUser['role'] === 'parent' && $thread['parentId'] !== $authUser['legacyId']) {
        respondError('You do not have access to this conversation.', 403);
    }
    if ($authUser['role'] !== 'parent') requireReviewer($authUser);

    if ($action === 'reply') {
        $text = sanitizeText((string)($body['message'] ?? ''));
        if ($text === '') respondError('Message cannot be empty.');
        $now = gmdate('c');
        $thread['messages'][] = [
            'id' => generateId(), 'senderRole' => $authUser['role'] === 'parent' ? 'parent' : 'admin',
            'senderName' => $authUser['name'], 'text' => safeTruncate($text, 4000), 'createdAt' => $now,
        ];
        $thread['updatedAt'] = $now;
        if ($authUser['role'] === 'parent') {
            // Any parent message — first one or a follow-up — means the
            // school has something new to look at, whatever the prior
            // status was (this is also what "reopens" a Closed thread,
            // with no separate reopen action needed for that case).
            $thread['status'] = 'New';
            $thread['parentUnread'] = false;
        } else {
            // Spec: an admin reply must NOT auto-change status — only
            // flag it unread for the parent.
            $thread['parentUnread'] = true;
        }
        $all[$idx] = $thread;
        writeSuggestions($all);
        respond(['ok' => true, 'thread' => $thread]);
    }

    if ($action === 'set_status') {
        requireReviewer($authUser); // only admin/principal change status, including reopening
        $status = $body['status'] ?? '';
        if (!in_array($status, ['New', 'Reviewed', 'Actioned', 'Closed'], true)) respondError('Invalid status.');
        $thread['status'] = $status;
        $thread['updatedAt'] = gmdate('c');
        $thread['closedAt'] = $status === 'Closed' ? gmdate('c') : '';
        $all[$idx] = $thread;
        writeSuggestions($all);
        respond(['ok' => true, 'thread' => $thread]);
    }

    if ($action === 'mark_read') {
        // Parent opening the thread clears their own unread flag. Admin
        // has no separate per-thread read flag — their signal is the
        // thread's status, changed explicitly via set_status instead.
        if ($authUser['role'] === 'parent') {
            $thread['parentUnread'] = false;
            $all[$idx] = $thread;
            writeSuggestions($all);
        }
        respond(['ok' => true, 'thread' => $thread]);
    }
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
