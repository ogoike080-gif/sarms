<?php
// api/misc.php  — announcements, assignments, pins, audit
require_once __DIR__ . '/../includes/config.php';
setHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db     = getDB();

// ═══════════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════

if ($method === 'GET' && $action === 'announcements') {
    $auth     = requireAnyRole(['admin','teacher','student','parent']);
    $classId  = $_GET['class_id'] ?? null;

    $sql = "SELECT a.*, u.name AS author_name, c.name AS class_name
            FROM announcements a
            JOIN users u ON u.id = a.author_id
            LEFT JOIN classes c ON c.id = a.target_class";

    $params = [];
    if ($classId && !in_array($auth['role'], ['admin','teacher'])) {
        $sql .= " WHERE (a.target_class IS NULL OR a.target_class = ?)";
        $params[] = $classId;
    }
    $sql .= " ORDER BY a.created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond(['announcements' => $stmt->fetchAll()]);
}

if ($method === 'POST' && $action === 'announcement') {
    $auth  = requireAnyRole(['admin','teacher']);
    $body  = getBody();
    $title = trim($body['title'] ?? '');
    $content = trim($body['content'] ?? '');
    if (!$title || !$content) respondError('Title and content required');
    $targetClass = $body['target_class'] ?? null;

    $db->prepare("INSERT INTO announcements (title,content,author_id,target_class) VALUES (?,?,?,?)")
       ->execute([$title, $content, $auth['id'], $targetClass ?: null]);
    respond(['success' => true, 'id' => $db->lastInsertId()]);
}

if ($method === 'DELETE' && $action === 'announcement') {
    $auth = requireAnyRole(['admin','teacher']);
    $id   = (int)($_GET['id'] ?? 0);
    // Teachers can only delete their own
    if ($auth['role'] === 'teacher') {
        $db->prepare("DELETE FROM announcements WHERE id=? AND author_id=?")->execute([$id, $auth['id']]);
    } else {
        $db->prepare("DELETE FROM announcements WHERE id=?")->execute([$id]);
    }
    respond(['success' => true]);
}

// ═══════════════════════════════════════════════════════════════
// ASSIGNMENTS
// ═══════════════════════════════════════════════════════════════

if ($method === 'GET' && $action === 'assignments') {
    $auth     = requireAnyRole(['admin','teacher','student','parent']);
    $classId  = $_GET['class_id'] ?? null;
    $teacherId= $_GET['teacher_id'] ?? null;

    $where = []; $params = [];
    if ($classId)  { $where[] = "a.class_id = ?"; $params[] = $classId; }
    if ($teacherId){ $where[] = "a.teacher_id = ?"; $params[] = $teacherId; }

    $sql = "SELECT a.*, u.name AS teacher_name, c.name AS class_name, sub.name AS subject_name
            FROM assignments a
            JOIN users u ON u.id = a.teacher_id
            JOIN classes c ON c.id = a.class_id
            JOIN subjects sub ON sub.id = a.subject_id" .
           ($where ? " WHERE " . implode(' AND ', $where) : '') .
           " ORDER BY a.due_date DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $assignments = $stmt->fetchAll();

    // Attach submissions
    foreach ($assignments as &$asgn) {
        $sub = $db->prepare("SELECT s.*, u.name AS student_name
                             FROM assignment_submissions s
                             JOIN users u ON u.id = s.student_id
                             WHERE s.assignment_id = ?");
        $sub->execute([$asgn['id']]);
        $asgn['submissions'] = $sub->fetchAll();
    }

    respond(['assignments' => $assignments]);
}

if ($method === 'POST' && $action === 'assignment') {
    $auth = requireAnyRole(['admin','teacher']);
    $body = getBody();

    $title    = trim($body['title'] ?? '');
    $classId  = $body['class_id'] ?? null;
    $subjectId= $body['subject_id'] ?? null;
    $dueDate  = $body['due_date'] ?? '';

    if (!$title || !$classId || !$subjectId || !$dueDate) respondError('Title, class, subject and due date required');

    $filePath = null; $fileName = null;
    if (!empty($body['file']) && str_starts_with($body['file'], 'data:')) {
        $dir = UPLOAD_DIR . 'assignments/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        // detect extension
        preg_match('/data:([^;]+);base64,/', $body['file'], $mime);
        $ext = match($mime[1] ?? '') {
            'application/pdf' => 'pdf',
            'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            default => 'bin',
        };
        $fname = uniqid() . '.' . $ext;
        file_put_contents($dir . $fname, base64_decode(preg_replace('/^data:[^;]+;base64,/', '', $body['file'])));
        $filePath = BASE_URL . '/uploads/assignments/' . $fname;
        $fileName = $body['file_name'] ?? $fname;
    }

    $db->prepare("INSERT INTO assignments (title,description,class_id,subject_id,teacher_id,due_date,file_path,file_name)
                  VALUES (?,?,?,?,?,?,?,?)")
       ->execute([$title, $body['description'] ?? '', $classId, $subjectId, $auth['id'], $dueDate, $filePath, $fileName]);
    respond(['success' => true, 'id' => $db->lastInsertId()]);
}

if ($method === 'DELETE' && $action === 'assignment') {
    $auth = requireAnyRole(['admin','teacher']);
    $id   = (int)($_GET['id'] ?? 0);
    $db->prepare("DELETE FROM assignments WHERE id=?")->execute([$id]);
    respond(['success' => true]);
}

if ($method === 'POST' && $action === 'submit_assignment') {
    $auth = requireAnyRole(['student','parent']);
    $body = getBody();
    $assignId  = (int)($body['assignment_id'] ?? 0);
    $studentId = $body['student_id'] ?? $auth['id'];
    $text      = $body['text'] ?? '';

    $filePath = null; $fileName = null;
    if (!empty($body['file']) && str_starts_with($body['file'], 'data:')) {
        $dir = UPLOAD_DIR . 'assignments/submissions/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $ext   = 'bin';
        $fname = uniqid() . '.' . $ext;
        file_put_contents($dir . $fname, base64_decode(preg_replace('/^data:[^;]+;base64,/', '', $body['file'])));
        $filePath = BASE_URL . '/uploads/assignments/submissions/' . $fname;
        $fileName = $body['file_name'] ?? $fname;
    }

    $db->prepare("INSERT INTO assignment_submissions (assignment_id,student_id,text_response,file_path,file_name)
                  VALUES (?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE text_response=VALUES(text_response),
                  file_path=VALUES(file_path), file_name=VALUES(file_name), submitted_at=NOW()")
       ->execute([$assignId, $studentId, $text, $filePath, $fileName]);
    respond(['success' => true]);
}

// ═══════════════════════════════════════════════════════════════
// PIN CODES
// ═══════════════════════════════════════════════════════════════

if ($method === 'GET' && $action === 'pins') {
    requireAuth('admin');
    $stmt = $db->query("SELECT p.*, u.name AS claimed_by_name
                        FROM pin_codes p
                        LEFT JOIN users u ON u.id = p.claimed_by
                        ORDER BY p.id DESC");
    respond(['pins' => $stmt->fetchAll()]);
}

if ($method === 'POST' && $action === 'generate_pins') {
    requireAuth('admin');
    $body  = getBody();
    $count = min(200, max(1, (int)($body['count'] ?? 10)));
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $added = 0;
    for ($i = 0; $i < $count * 3 && $added < $count; $i++) {
        $code = 'GFA-';
        for ($j = 0; $j < 5; $j++) $code .= $chars[random_int(0, strlen($chars) - 1)];
        try {
            $db->prepare("INSERT INTO pin_codes (code) VALUES (?)")->execute([$code]);
            $added++;
        } catch (\PDOException $e) { /* duplicate — skip */ }
    }
    respond(['success' => true, 'added' => $added]);
}

if ($method === 'PUT' && $action === 'reset_pin') {
    requireAuth('admin');
    $body = getBody();
    $db->prepare("UPDATE pin_codes SET claimed_by=NULL, used_count=0 WHERE id=?")->execute([$body['id']]);
    respond(['success' => true]);
}

if ($method === 'DELETE' && $action === 'pin') {
    requireAuth('admin');
    $db->prepare("DELETE FROM pin_codes WHERE id=?")->execute([(int)$_GET['id']]);
    respond(['success' => true]);
}

// ═══════════════════════════════════════════════════════════════
// AUDIT TRAIL
// ═══════════════════════════════════════════════════════════════

if ($method === 'GET' && $action === 'audit') {
    requireAuth('admin');
    $limit = (int)($_GET['limit'] ?? 100);
    $stmt  = $db->prepare("SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT ?");
    $stmt->execute([$limit]);
    respond(['audit' => $stmt->fetchAll()]);
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════

if ($method === 'GET' && $action === 'analytics') {
    requireAnyRole(['admin','teacher']);
    $session = $_GET['session'] ?? '';
    $term    = $_GET['term'] ?? '';

    $totals = [
        'students' => $db->query("SELECT COUNT(*) FROM users WHERE role='student'")->fetchColumn(),
        'teachers' => $db->query("SELECT COUNT(*) FROM users WHERE role='teacher'")->fetchColumn(),
        'classes'  => $db->query("SELECT COUNT(*) FROM classes")->fetchColumn(),
        'subjects' => $db->query("SELECT COUNT(*) FROM subjects")->fetchColumn(),
    ];

    // Class performance
    $stmt = $db->prepare("SELECT c.name, ROUND(AVG(s.ca+s.exam),1) AS avg_score, COUNT(DISTINCT s.student_id) AS student_count
                          FROM scores s JOIN classes c ON c.id=s.class_id
                          WHERE s.session_name=? AND s.term_name=?
                          GROUP BY c.id ORDER BY avg_score DESC");
    $stmt->execute([$session, $term]);
    $classPerf = $stmt->fetchAll();

    // Subject pass rates
    $stmt2 = $db->prepare("SELECT sub.name, sub.code,
                            ROUND(AVG(s.ca+s.exam),1) AS avg_score,
                            COUNT(*) AS total,
                            SUM(CASE WHEN (s.ca+s.exam)>=40 THEN 1 ELSE 0 END) AS passed
                           FROM scores s JOIN subjects sub ON sub.id=s.subject_id
                           WHERE s.session_name=? AND s.term_name=?
                           GROUP BY sub.id ORDER BY avg_score DESC");
    $stmt2->execute([$session, $term]);
    $subjectPerf = $stmt2->fetchAll();

    // Top 5 students
    $stmt3 = $db->prepare("SELECT u.name, u.student_id, c.name AS class_name,
                            ROUND(AVG(s.ca+s.exam),1) AS avg_score
                           FROM scores s JOIN users u ON u.id=s.student_id
                           JOIN classes c ON c.id=s.class_id
                           WHERE s.session_name=? AND s.term_name=?
                           GROUP BY s.student_id ORDER BY avg_score DESC LIMIT 5");
    $stmt3->execute([$session, $term]);
    $topStudents = $stmt3->fetchAll();

    respond(['totals' => $totals, 'classPerformance' => $classPerf,
             'subjectPerformance' => $subjectPerf, 'topStudents' => $topStudents]);
}

respondError('Unknown action', 404);
