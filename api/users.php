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

// api/users.php  — students, teachers, parents CRUD
require_once __DIR__ . '/../includes/config.php';
setHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db     = getDB();

// ─── GET users by role ────────────────────────────────────────
if ($method === 'GET' && $action === 'list') {
    requireAnyRole(['admin','teacher']);
    $role = $_GET['role'] ?? 'student';
    $stmt = $db->prepare("SELECT u.id, u.role, u.name, u.email, u.student_id, u.class_id,
                                  u.avatar, u.child_id, u.is_active, u.created_at,
                                  c.name AS class_name
                           FROM users u
                           LEFT JOIN classes c ON c.id = u.class_id
                           WHERE u.role = ?
                           ORDER BY u.name");
    $stmt->execute([$role]);
    $users = $stmt->fetchAll();

    // For teachers, add their class/subject assignments
    if ($role === 'teacher') {
        foreach ($users as &$u) {
            $tc = $db->prepare("SELECT class_id FROM teacher_classes WHERE teacher_id = ?");
            $tc->execute([$u['id']]);
            $ts = $db->prepare("SELECT subject_id FROM teacher_subjects WHERE teacher_id = ?");
            $ts->execute([$u['id']]);
            $u['classes']  = array_column($tc->fetchAll(), 'class_id');
            $u['subjects'] = array_column($ts->fetchAll(), 'subject_id');
        }
    }
    respond(['users' => $users]);
}

// ─── POST create user ─────────────────────────────────────────
if ($method === 'POST' && $action === 'create') {
    $auth = requireAuth('admin');
    $body = getBody();

    $role  = $body['role'] ?? 'student';
    $name  = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $pass  = $body['password'] ?? 'password123';

    if (!$name || !$email) respondError('Name and email required');

    // Check email unique
    $chk = $db->prepare("SELECT id FROM users WHERE email = ?");
    $chk->execute([$email]);
    if ($chk->fetch()) respondError('Email already exists');

    $hash     = password_hash($pass, PASSWORD_BCRYPT);
    $classId  = $body['class_id'] ?? null;
    $studentId= $body['student_id'] ?? null;
    $childId  = $body['child_id'] ?? null;

    // Handle avatar
    $avatarUrl = null;
    if (!empty($body['avatar']) && str_starts_with($body['avatar'], 'data:')) {
        $avatarUrl = saveBase64Image($body['avatar'], 'avatars');
    }

    $stmt = $db->prepare("INSERT INTO users (role,name,email,password_hash,student_id,class_id,child_id,avatar)
                          VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$role, $name, $email, $hash, $studentId, $classId, $childId, $avatarUrl]);
    $newId = (int)$db->lastInsertId();

    // Teacher assignments
    if ($role === 'teacher') {
        foreach ($body['classes'] ?? [] as $cid) {
            $db->prepare("INSERT IGNORE INTO teacher_classes VALUES (?,?)")->execute([$newId, $cid]);
        }
        foreach ($body['subjects'] ?? [] as $sid) {
            $db->prepare("INSERT IGNORE INTO teacher_subjects VALUES (?,?)")->execute([$newId, $sid]);
        }
    }

    // Audit
    $db->prepare("INSERT INTO audit_trail (user_id,user_name,action,details) VALUES (?,?,?,?)")
       ->execute([$auth['id'], $auth['name'], 'User Created', "Created $role: $name"]);

    respond(['success' => true, 'id' => $newId, 'avatar' => $avatarUrl]);
}

// ─── PUT update user ──────────────────────────────────────────
if ($method === 'PUT' && $action === 'update') {
    $auth = requireAuth('admin');
    $body = getBody();
    $id   = (int)($body['id'] ?? 0);
    if (!$id) respondError('ID required');

    $name  = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    if (!$name || !$email) respondError('Name and email required');

    $avatarUrl = null;
    if (!empty($body['avatar']) && str_starts_with($body['avatar'], 'data:')) {
        $avatarUrl = saveBase64Image($body['avatar'], 'avatars');
    }

    $sql = "UPDATE users SET name=?, email=?, class_id=?, student_id=?";
    $params = [$name, $email, $body['class_id'] ?? null, $body['student_id'] ?? null];
    if ($avatarUrl) { $sql .= ", avatar=?"; $params[] = $avatarUrl; }
    $sql .= " WHERE id=?"; $params[] = $id;
    $db->prepare($sql)->execute($params);

    // Update teacher assignments
    if (($body['role'] ?? '') === 'teacher') {
        $db->prepare("DELETE FROM teacher_classes WHERE teacher_id=?")->execute([$id]);
        $db->prepare("DELETE FROM teacher_subjects WHERE teacher_id=?")->execute([$id]);
        foreach ($body['classes'] ?? [] as $cid) {
            $db->prepare("INSERT IGNORE INTO teacher_classes VALUES (?,?)")->execute([$id, $cid]);
        }
        foreach ($body['subjects'] ?? [] as $sid) {
            $db->prepare("INSERT IGNORE INTO teacher_subjects VALUES (?,?)")->execute([$id, $sid]);
        }
    }
    respond(['success' => true, 'avatar' => $avatarUrl]);
}

// ─── DELETE user ──────────────────────────────────────────────
if ($method === 'DELETE' && $action === 'delete') {
    requireAuth('admin');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respondError('ID required');
    $db->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
    respond(['success' => true]);
}

// ─── GET classes and subjects lists ──────────────────────────
if ($method === 'GET' && $action === 'classes') {
    requireAnyRole(['admin','teacher']);
    $stmt = $db->query("SELECT * FROM classes ORDER BY id");
    respond(['classes' => $stmt->fetchAll()]);
}

if ($method === 'POST' && $action === 'class') {
    requireAuth('admin');
    $body = getBody();
    $db->prepare("INSERT INTO classes (name, level) VALUES (?,?)")->execute([$body['name'], $body['level'] ?? 'Junior']);
    respond(['success' => true, 'id' => $db->lastInsertId()]);
}

if ($method === 'PUT' && $action === 'class') {
    requireAuth('admin');
    $body = getBody();
    $db->prepare("UPDATE classes SET name=?, level=? WHERE id=?")->execute([$body['name'], $body['level'], $body['id']]);
    respond(['success' => true]);
}

if ($method === 'DELETE' && $action === 'class') {
    requireAuth('admin');
    $db->prepare("DELETE FROM classes WHERE id=?")->execute([(int)$_GET['id']]);
    respond(['success' => true]);
}

if ($method === 'POST' && $action === 'subject') {
    requireAuth('admin');
    $body = getBody();
    $db->prepare("INSERT INTO subjects (name,code) VALUES (?,?)")->execute([$body['name'], strtoupper($body['code'])]);
    respond(['success' => true, 'id' => $db->lastInsertId()]);
}

if ($method === 'PUT' && $action === 'subject') {
    requireAuth('admin');
    $body = getBody();
    $db->prepare("UPDATE subjects SET name=?, code=? WHERE id=?")->execute([$body['name'], strtoupper($body['code']), $body['id']]);
    respond(['success' => true]);
}

if ($method === 'DELETE' && $action === 'subject') {
    requireAuth('admin');
    $db->prepare("DELETE FROM subjects WHERE id=?")->execute([(int)$_GET['id']]);
    respond(['success' => true]);
}

respondError('Unknown action', 404);
