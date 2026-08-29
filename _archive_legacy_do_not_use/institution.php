<?php
// api/institution.php  — settings, sessions, terms, grading
require_once __DIR__ . '/../includes/config.php';
setHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db     = getDB();

// ─── GET all settings (public — needed for login page) ────────
if ($method === 'GET' && $action === 'settings') {
    $inst = $db->query("SELECT * FROM institution LIMIT 1")->fetch();
    $sess = $db->query("SELECT * FROM sessions ORDER BY name")->fetchAll();
    $trms = $db->query("SELECT * FROM terms ORDER BY id")->fetchAll();
    $grad = $db->query("SELECT * FROM grading_system ORDER BY min_score DESC")->fetchAll();
    $sett = $db->query("SELECT * FROM settings")->fetchAll(PDO::FETCH_KEY_PAIR);
    $clss = $db->query("SELECT * FROM classes ORDER BY id")->fetchAll();
    $subs = $db->query("SELECT * FROM subjects ORDER BY name")->fetchAll();
    respond([
        'institution'   => $inst,
        'sessions'      => $sess,
        'terms'         => $trms,
        'gradingSystem' => $grad,
        'settings'      => $sett,
        'classes'       => $clss,
        'subjects'      => $subs,
    ]);
}

// ─── PUT institution ─────────────────────────────────────────
if ($method === 'PUT' && $action === 'institution') {
    requireAuth('admin');
    $body = getBody();
    $fields = ['name','address','principal','principal_comment'];
    $set = []; $params = [];
    foreach ($fields as $f) {
        if (isset($body[$f])) { $set[] = "$f = ?"; $params[] = $body[$f]; }
    }
    // Handle image uploads
    foreach (['logo','signature'] as $img) {
        if (!empty($body[$img]) && str_starts_with($body[$img], 'data:')) {
            $url = saveBase64Image($body[$img], $img === 'logo' ? 'logos' : 'signatures');
            if ($url) { $set[] = "$img = ?"; $params[] = $url; }
        } elseif (isset($body[$img])) {
            $set[] = "$img = ?"; $params[] = $body[$img];
        }
    }
    if ($set) {
        $params[] = 1;
        $db->prepare("UPDATE institution SET " . implode(',', $set) . " WHERE id = ?")->execute($params);
    }
    respond(['success' => true]);
}

// ─── Sessions CRUD ────────────────────────────────────────────
if ($method === 'POST' && $action === 'session') {
    requireAuth('admin');
    $body = getBody();
    $name = trim($body['name'] ?? '');
    if (!preg_match('/^\d{4}\/\d{4}$/', $name)) respondError('Invalid session format');
    $db->prepare("INSERT INTO sessions (name) VALUES (?)")->execute([$name]);
    respond(['success' => true, 'id' => $db->lastInsertId()]);
}

if ($method === 'DELETE' && $action === 'session') {
    requireAuth('admin');
    $id = $_GET['id'] ?? 0;
    $db->prepare("DELETE FROM sessions WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}

if ($method === 'PUT' && $action === 'current_session') {
    requireAuth('admin');
    $body = getBody();
    $db->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = 'current_session'")->execute([$body['name']]);
    respond(['success' => true]);
}

if ($method === 'PUT' && $action === 'current_term') {
    requireAnyRole(['admin','teacher']);
    $body = getBody();
    $db->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = 'current_term'")->execute([$body['name']]);
    respond(['success' => true]);
}

// ─── Grading system ───────────────────────────────────────────
if ($method === 'PUT' && $action === 'grading') {
    requireAuth('admin');
    $body = getBody();
    $grades = $body['grades'] ?? [];
    $db->query("DELETE FROM grading_system");
    $stmt = $db->prepare("INSERT INTO grading_system (grade,min_score,max_score,remark) VALUES (?,?,?,?)");
    foreach ($grades as $g) {
        $stmt->execute([$g['grade'], $g['min'], $g['max'], $g['remark']]);
    }
    respond(['success' => true]);
}

// ─── Result published toggle ──────────────────────────────────
if ($method === 'PUT' && $action === 'publish') {
    requireAuth('admin');
    $body = getBody();
    $val  = $body['published'] ? '1' : '0';
    $db->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = 'result_published'")->execute([$val]);
    respond(['success' => true]);
}

respondError('Unknown action', 404);
