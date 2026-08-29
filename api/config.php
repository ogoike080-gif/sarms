
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}



// ─── includes/config.php ─────────────────────────────────────
// Edit these values to match your XAMPP setup
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // XAMPP default
define('DB_PASS', '');            // XAMPP default (empty)
define('DB_NAME', 'sarms_db');
define('DB_PORT', 3306);

define('BASE_URL',  'http://localhost/sarms');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('JWT_SECRET', 'sarms_super_secret_key_change_in_production_2024');
define('JWT_EXPIRY', 86400); // 24 hours

// ─── Database connection (PDO) ────────────────────────────────
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT .
                   ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }
    return $pdo;
}

// ─── CORS + JSON headers ──────────────────────────────────────
function setHeaders(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

// ─── Send JSON response ───────────────────────────────────────
function respond(mixed $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function respondError(string $msg, int $code = 400): void {
    respond(['error' => $msg], $code);
}

// ─── Simple JWT (no external library needed) ─────────────────
function jwtEncode(array $payload): string {
    $header  = base64url_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $payload['exp'] = time() + JWT_EXPIRY;
    $body    = base64url_encode(json_encode($payload));
    $sig     = base64url_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    return "$header.$body.$sig";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(base64url_decode($body), true);
    if (!$payload || $payload['exp'] < time()) return null;
    return $payload;
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

// ─── Auth middleware ──────────────────────────────────────────
function requireAuth(?string $role = null): array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $auth, $m)) respondError('Unauthorized', 401);
    $payload = jwtDecode($m[1]);
    if (!$payload) respondError('Invalid or expired token', 401);
    if ($role && $payload['role'] !== $role) respondError('Forbidden', 403);
    return $payload;
}

function requireAnyRole(array $roles): array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $auth, $m)) respondError('Unauthorized', 401);
    $payload = jwtDecode($m[1]);
    if (!$payload) respondError('Invalid or expired token', 401);
    if (!in_array($payload['role'], $roles)) respondError('Forbidden', 403);
    return $payload;
}

// ─── Get request body ────────────────────────────────────────
function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// ─── Save base64 image to disk ────────────────────────────────
function saveBase64Image(string $base64, string $subdir): ?string {
    if (!preg_match('/^data:image\/(\w+);base64,/', $base64, $m)) return null;
    $ext  = strtolower($m[1]);
    $data = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64));
    if ($data === false) return null;
    $dir  = UPLOAD_DIR . $subdir . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $fname = uniqid() . '.' . $ext;
    file_put_contents($dir . $fname, $data);
    return BASE_URL . '/uploads/' . $subdir . '/' . $fname;
}
