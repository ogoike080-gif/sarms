<?php
// ============================================================
// SARMS — api/db.php
// Now using Railway MySQL via environment variables
// ============================================================

// ── Headers ─────────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── CONFIG — Use Railway environment variables ──────────────
// For local development, fall back to localhost
define('DB_HOST', getenv('MYSQLHOST') ?: 'localhost');
define('DB_USER', getenv('MYSQLUSER') ?: 'root');
define('DB_PASS', getenv('MYSQLPASSWORD') ?: '');
define('DB_NAME', getenv('MYSQLDATABASE') ?: 'sarms_db');
define('DB_PORT', getenv('MYSQLPORT') ?: 3306);

// ── Connect to MySQL ────────────────────────────────────────
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;

    try {
        // First try to connect to the specific database
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT            => 5,
            ]
        );

        // Auto-create the storage table if it doesn't exist
        $pdo->exec("CREATE TABLE IF NOT EXISTS sarms_data (
            slice_key   VARCHAR(60)  PRIMARY KEY,
            slice_value LONGTEXT     NOT NULL,
            updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    } catch (PDOException $e) {
        $msg = $e->getMessage();

        // Give a clear error if database doesn't exist yet
        if (strpos($msg, 'Unknown database') !== false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Database "' . DB_NAME . '" does not exist.',
                'fix'   => 'The database should have been created automatically. Check Railway MySQL logs.',
            ]);
            exit;
        }

        // Clear error if MySQL is not running
        if (strpos($msg, 'Connection refused') !== false || strpos($msg, 'No connection') !== false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Cannot connect to MySQL.',
                'fix'   => 'Check that your Railway MySQL service is running and environment variables are set correctly.',
            ]);
            exit;
        }

        // Wrong password
        if (strpos($msg, 'Access denied') !== false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Wrong MySQL username or password.',
                'fix'   => 'Verify MYSQLUSER, MYSQLPASSWORD, and MYSQLHOST environment variables are set correctly.',
            ]);
            exit;
        }

        // Generic error
        http_response_code(500);
        echo json_encode(['error' => 'DB Error: ' . $msg]);
        exit;
    }

    return $pdo;
}

// ── Read one slice ───────────────────────────────────────────
function readSlice(string $key, mixed $default = null): mixed {
    $stmt = db()->prepare('SELECT slice_value FROM sarms_data WHERE slice_key = ?');
    $stmt->execute([$key]);
    $val = $stmt->fetchColumn();
    return $val !== false ? json_decode($val, true) : $default;
}

// ── Write one slice ──────────────────────────────────────────
function writeSlice(string $key, mixed $value): void {
    db()->prepare('INSERT INTO sarms_data (slice_key, slice_value)
                   VALUES (?, ?)
                   ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)')
       ->execute([$key, json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
}

// ── Route ────────────────────────────────────────────────────
$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$data   = $body['data'] ?? null;

// ── PING — Test that everything works ────────────────────────
if ($action === 'ping') {
    db(); // Will throw and show a clear error if DB is broken
    echo json_encode([
        'ok'      => true,
        'php'     => PHP_VERSION,
        'db'      => DB_NAME,
        'host'    => DB_HOST,
        'message' => 'SARMS database connection is working!',
    ]);
    exit;
}

// ── LOAD ALL — Called once when React app starts ─────────────
if ($action === 'load_all') {
    $defaults = defaultState();
    $result   = [];
    foreach (array_keys($defaults) as $key) {
        $saved        = readSlice($key);
        $result[$key] = $saved !== null ? $saved : $defaults[$key];
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ── SAVE SLICES — Each called automatically by React updateState ──
$saveMap = [
    'save_institution'   => 'institution',
    'save_users'         => 'users',
    'save_classes'       => 'classes',
    'save_subjects'      => 'subjects',
    'save_scores'        => 'scores',
    'save_announcements' => 'announcements',
    'save_assignments'   => 'assignments',
    'save_pins'          => 'pinCodes',
    'save_audit'         => 'auditTrail',
    'save_grading'       => 'gradingSystem',
    'save_character'     => 'characterReports',
    'save_payments'      => 'payments',
    'save_payment_types' => 'paymentTypes',
    'save_attendance'    => 'attendance',
    'save_gate_code'            => 'gateCode',
    'save_attendance_settings'  => 'attendanceSettings',
];

if (isset($saveMap[$action])) {
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'No data provided for ' . $action]);
        exit;
    }
    writeSlice($saveMap[$action], $data);
    echo json_encode(['ok' => true, 'saved' => $saveMap[$action]]);
    exit;
}

// save_settings handles multiple keys at once
if ($action === 'save_settings') {
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'No settings data provided']);
        exit;
    }
    foreach (['sessions', 'currentSession', 'currentTerm', 'resultPublished'] as $k) {
        if (array_key_exists($k, $data)) {
            writeSlice($k, $data[$k]);
        }
    }
    echo json_encode(['ok' => true, 'saved' => 'settings']);
    exit;
}

// reset_all — wipes all data (used by Reset button in admin)
if ($action === 'reset_all') {
    db()->exec('DELETE FROM sarms_data');
    echo json_encode(['ok' => true, 'message' => 'All data cleared']);
    exit;
}

// Unknown action
http_response_code(404);
echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
exit;

// ── Default fresh state ──────────────────────────────────────
function defaultState(): array {
    return [
        'institution' => [
            'name'             => 'My School',
            'address'          => '',
            'principal'        => '',
            'principalComment' => '',
            'motto'            => '',
            'logo'             => null,
            'signature'        => null,
        ],
        'gateCode' => ['token' => '', 'generatedAt' => '', 'generatedByName' => ''],
        'attendanceSettings' => ['lateCutoffTime' => '08:00', 'absentCutoffTime' => '10:00'],
        'sessions'        => ['2024/2025'],
        'currentSession'  => '2024/2025',
        'currentTerm'     => 'First Term',
        'resultPublished' => false,
        'gradingSystem'   => [
            ['min'=>70,'max'=>100,'grade'=>'A','remark'=>'Excellent'],
            ['min'=>60,'max'=>69, 'grade'=>'B','remark'=>'Very Good'],
            ['min'=>50,'max'=>59, 'grade'=>'C','remark'=>'Good'],
            ['min'=>40,'max'=>49, 'grade'=>'D','remark'=>'Fair'],
            ['min'=>0, 'max'=>39, 'grade'=>'F','remark'=>'Fail'],
        ],
        'characterTraits'  => ['Punctuality','Neatness','Attentiveness',
                                'Cooperation','Honesty','Respect','Diligence'],
        'classes'          => [],
        'subjects'         => [],
        'users'            => [[
            'id'       => 'admin_1',
            'role'     => 'admin',
            'name'     => 'Administrator',
            'email'    => 'admin@school.com',
            'password' => 'admin@2024',
            'avatar'   => null,
        ]],
        'scores'           => [],
        'announcements'    => [],
        'assignments'      => [],
        'pinCodes'         => [],
        'auditTrail'       => [],
        'characterReports' => new stdClass(),
        'payments'         => [],
        'paymentTypes'     => ['School Fees','Exam Fees','Development Levy','Uniform','Books','PTA Levy','Others'],
        'attendance'       => [],
    ];
}

