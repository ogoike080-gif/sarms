<?php
// ============================================================
// SARMS LMS — api/auth_jwt.php (Phase 11, spec §21)
//
// Real server-side authentication, finally — tracked as a gap
// since Phase 2 (MIGRATION_PLAN.md §4 step 5). Issues a JWT
// against the NORMALIZED users table (bcrypt password_hash,
// populated by Phase 4's backfill), not the sarms_data blob the
// rest of the app's login still checks client-side.
//
// This does NOT replace the existing client-side login — that
// stays as-is (a large, risky change to touch this late, and out
// of scope for what this phase needs). Instead, the frontend calls
// THIS endpoint right after a successful client-side login, purely
// to get a real bearer token for LMS API calls going forward. See
// PHASE11_SUMMARY.md for the full reasoning.
//
// No external JWT library — composer/packagist isn't reachable
// from this environment (confirmed back when evaluating Phase 3's
// options), and a minimal HS256 implementation is genuinely simple:
// base64url-encoded header+payload, HMAC-SHA256 signature.
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

// ── JWT secret: same env-var-first, local-file-fallback pattern as Gemini's
// key handling (api/ai.php), for the same reason — never hardcoded. ──
function jwtSecret(): string {
    static $secret = null;
    if ($secret !== null) return $secret;
    $secret = getenv('JWT_SECRET') ?: null;
    $localFile = __DIR__ . '/jwt_secret.php';
    if (!$secret && file_exists($localFile)) {
        $secret = (require $localFile)['JWT_SECRET'] ?? null;
    }
    if (!$secret) {
        // Auto-generate and persist one on first run, so a fresh install
        // works out of the box without a manual setup step — unlike the
        // Gemini key, this secret has no external service to register
        // with, so generating it locally is the right default.
        $secret = bin2hex(random_bytes(32));
        file_put_contents(__DIR__ . '/jwt_secret.php', "<?php\nreturn ['JWT_SECRET' => '$secret'];\n");
    }
    return $secret;
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

function issueToken(array $payload, int $ttlSeconds = 86400 * 7): string {
    $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + $ttlSeconds;
    $body = base64UrlEncode(json_encode($payload));
    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$body", jwtSecret(), true));
    return "$header.$body.$signature";
}

// Returns the decoded payload array, or null if invalid/expired/tampered.
function verifyToken(?string $token): ?array {
    if (!$token) return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $signature] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', "$header.$body", jwtSecret(), true));
    if (!hash_equals($expected, $signature)) return null; // tampered or wrong secret
    $payload = json_decode(base64UrlDecode($body), true);
    if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) return null; // expired or malformed
    return $payload;
}

function getBearerToken(): ?string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null);
    if (!$header || !preg_match('/^Bearer\s+(.+)$/i', $header, $m)) return null;
    return $m[1];
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

if ($action === 'login') {
    $email = trim((string)($body['email'] ?? ''));
    $password = (string)($body['password'] ?? '');
    if ($email === '' || $password === '') respondError('Email and password are required.');

    $stmt = db()->prepare('SELECT id, role, name, email, password_hash, is_active FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Same error for "no such user" and "wrong password" — don't reveal
    // which one it was (standard practice, prevents email enumeration).
    if (!$user || !password_verify($password, $user['password_hash'])) {
        respondError('Invalid email or password.', 401);
    }
    if (!$user['is_active']) respondError('This account has been deactivated.', 403);

    $token = issueToken(['sub' => (int)$user['id'], 'role' => $user['role'], 'email' => $user['email']]);
    respond(['ok' => true, 'token' => $token, 'user' => ['id' => (int)$user['id'], 'role' => $user['role'], 'name' => $user['name'], 'email' => $user['email']]]);
}

if ($action === 'verify') {
    $payload = verifyToken(getBearerToken());
    if (!$payload) respondError('Invalid or expired token.', 401);
    respond(['ok' => true, 'user' => ['id' => $payload['sub'], 'role' => $payload['role'], 'email' => $payload['email']]]);
}

http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
