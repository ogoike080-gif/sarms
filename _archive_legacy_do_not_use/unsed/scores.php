<?php
// api/scores.php
require_once __DIR__ . '/../includes/config.php';
setHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db     = getDB();

// ─── GET scores for a class/subject/session/term ──────────────
if ($method === 'GET' && $action === 'list') {
    requireAnyRole(['admin','teacher']);
    $classId = $_GET['class_id'] ?? null;
    $subjectId = $_GET['subject_id'] ?? null;
    $session = $_GET['session'] ?? '';
    $term    = $_GET['term'] ?? '';

    $where = []; $params = [];
    if ($classId)   { $where[] = 's.class_id = ?';   $params[] = $classId; }
    if ($subjectId) { $where[] = 's.subject_id = ?'; $params[] = $subjectId; }
    if ($session)   { $where[] = 's.session_name = ?'; $params[] = $session; }
    if ($term)      { $where[] = 's.term_name = ?';    $params[] = $term; }

    $sql = "SELECT * FROM v_scores_full s" .
           ($where ? " WHERE " . implode(' AND ', $where) : '') .
           " ORDER BY student_name";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond(['scores' => $stmt->fetchAll()]);
}

// ─── POST / PUT upsert score ──────────────────────────────────
if ($method === 'POST' && $action === 'save') {
    $auth = requireAnyRole(['admin','teacher']);
    $body = getBody();

    // Check result not locked
    $locked = $db->query("SELECT setting_value FROM settings WHERE setting_key='result_published'")->fetchColumn();
    if ($locked === '1') respondError('Results are published and locked. Unblock from admin settings.');

    $scores = $body['scores'] ?? [];
    $saved  = 0;

    foreach ($scores as $s) {
        $studentId = (int)($s['student_id'] ?? 0);
        $subjectId = (int)($s['subject_id'] ?? 0);
        $classId   = (int)($s['class_id'] ?? 0);
        $session   = $s['session'] ?? '';
        $term      = $s['term'] ?? '';
        $ca        = min(40, max(0, (float)($s['ca'] ?? 0)));
        $exam      = min(60, max(0, (float)($s['exam'] ?? 0)));
        $comment   = $s['comment'] ?? '';

        if (!$studentId || !$subjectId) continue;

        $db->prepare("INSERT INTO scores (student_id,subject_id,class_id,session_name,term_name,ca,exam,comment,entered_by)
                      VALUES (?,?,?,?,?,?,?,?,?)
                      ON DUPLICATE KEY UPDATE ca=VALUES(ca), exam=VALUES(exam),
                      comment=VALUES(comment), entered_by=VALUES(entered_by)")
           ->execute([$studentId,$subjectId,$classId,$session,$term,$ca,$exam,$comment,$auth['id']]);
        $saved++;
    }

    // Audit
    if ($saved > 0) {
        $db->prepare("INSERT INTO audit_trail (user_id,user_name,action,details) VALUES (?,?,?,?)")
           ->execute([$auth['id'], $auth['name'], 'Score Entry', "Saved $saved score(s)"]);
    }

    respond(['success' => true, 'saved' => $saved]);
}

// ─── GET broadsheet (all students in class for session/term) ──
if ($method === 'GET' && $action === 'broadsheet') {
    $classId = $_GET['class_id'] ?? null;
    $session = $_GET['session'] ?? '';
    $term    = $_GET['term'] ?? '';

    if (!$classId) respondError('class_id required');

    // Get all students in class
    $stStmt = $db->prepare("SELECT u.id, u.name, u.student_id AS reg_no, u.avatar
                             FROM users u WHERE u.class_id = ? AND u.role = 'student' ORDER BY u.name");
    $stStmt->execute([$classId]);
    $students = $stStmt->fetchAll();

    if ($term === 'Annual') {
        // Annual: average of three terms per subject per student
        $terms = ['First Term','Second Term','Third Term'];
        $scStmt = $db->prepare("SELECT s.student_id, s.subject_id, sub.name AS subject_name, sub.code,
                                        s.term_name, (s.ca+s.exam) AS total
                                 FROM scores s
                                 JOIN subjects sub ON sub.id = s.subject_id
                                 WHERE s.class_id = ? AND s.session_name = ?
                                 ORDER BY sub.name");
        $scStmt->execute([$classId, $session]);
        $allScores = $scStmt->fetchAll();

        foreach ($students as &$st) {
            $stScores = array_filter($allScores, fn($r) => $r['student_id'] == $st['id']);
            $bySubject = [];
            foreach ($stScores as $r) {
                $bySubject[$r['subject_id']]['name'] = $r['subject_name'];
                $bySubject[$r['subject_id']]['code'] = $r['code'];
                $bySubject[$r['subject_id']][$r['term_name']] = $r['total'];
            }
            $annualRows = [];
            foreach ($bySubject as $subId => $data) {
                $vals = array_filter([$data['First Term'] ?? null, $data['Second Term'] ?? null, $data['Third Term'] ?? null], fn($v) => $v !== null);
                $avg  = count($vals) > 0 ? round(array_sum($vals) / 3, 1) : 0;
                $annualRows[] = [
                    'subject_id'   => $subId,
                    'subject_name' => $data['name'],
                    'code'         => $data['code'],
                    'term1'        => $data['First Term'] ?? null,
                    'term2'        => $data['Second Term'] ?? null,
                    'term3'        => $data['Third Term'] ?? null,
                    'annual_avg'   => $avg,
                ];
            }
            $totalAvg = count($annualRows) > 0
                ? round(array_sum(array_column($annualRows, 'annual_avg')) / count($annualRows), 1)
                : 0;
            $st['scores']    = $annualRows;
            $st['total_avg'] = $totalAvg;
        }
    } else {
        $scStmt = $db->prepare("SELECT s.student_id, s.subject_id, sub.name AS subject_name, sub.code,
                                        s.ca, s.exam, (s.ca+s.exam) AS total, s.comment
                                 FROM scores s
                                 JOIN subjects sub ON sub.id = s.subject_id
                                 WHERE s.class_id = ? AND s.session_name = ? AND s.term_name = ?
                                 ORDER BY sub.name");
        $scStmt->execute([$classId, $session, $term]);
        $allScores = $scStmt->fetchAll();

        foreach ($students as &$st) {
            $stScores = array_filter($allScores, fn($r) => $r['student_id'] == $st['id']);
            $stScores = array_values($stScores);
            $totalSum = array_sum(array_column($stScores, 'total'));
            $avg      = count($stScores) > 0 ? round($totalSum / count($stScores), 1) : 0;
            $st['scores']    = $stScores;
            $st['total_avg'] = $avg;
        }
    }

    // Rank students
    usort($students, fn($a,$b) => $b['total_avg'] <=> $a['total_avg']);
    $rank = 1; $prev = null;
    foreach ($students as $i => &$st) {
        if ($prev !== null && $st['total_avg'] === $prev) {
            $st['position'] = $students[$i-1]['position'];
        } else {
            $st['position'] = $rank;
        }
        $prev = $st['total_avg'];
        $rank++;
    }

    respond(['students' => $students]);
}

// ─── GET student result for result checker ────────────────────
if ($method === 'GET' && $action === 'student_result') {
    $classId = $_GET['class_id'] ?? null;
    $term    = $_GET['term'] ?? '';
    $session = $_GET['session'] ?? '';

    if (!$classId || !$term) respondError('class_id and term required');

    $stStmt = $db->prepare("SELECT u.id, u.name, u.student_id AS reg_no, u.avatar, u.class_id
                             FROM users u WHERE u.class_id = ? AND u.role='student' ORDER BY u.name");
    $stStmt->execute([$classId]);
    $students = $stStmt->fetchAll();

    $scStmt = $db->prepare("SELECT s.student_id, s.subject_id, sub.name AS subject_name, sub.code,
                                    s.ca, s.exam, (s.ca+s.exam) AS total, s.comment,
                                    cr.punctuality, cr.neatness, cr.attentiveness,
                                    cr.cooperation, cr.honesty, cr.respect, cr.diligence,
                                    cr.teacher_remark
                             FROM scores s
                             JOIN subjects sub ON sub.id = s.subject_id
                             LEFT JOIN character_reports cr
                               ON cr.student_id = s.student_id
                               AND cr.session_name = s.session_name
                               AND cr.term_name = s.term_name
                             WHERE s.class_id = ? AND s.session_name = ? AND s.term_name = ?");
    $scStmt->execute([$classId, $session, $term]);
    $allScores = $scStmt->fetchAll();

    foreach ($students as &$st) {
        $stScores = array_values(array_filter($allScores, fn($r) => $r['student_id'] == $st['id']));
        $st['scores'] = $stScores;
        $totalSum = array_sum(array_column($stScores, 'total'));
        $st['total_avg'] = count($stScores) > 0 ? round($totalSum / count($stScores), 1) : 0;
    }

    usort($students, fn($a,$b) => $b['total_avg'] <=> $a['total_avg']);
    $rank = 1; $prev = null;
    foreach ($students as $i => &$st) {
        if ($prev !== null && $st['total_avg'] === $prev) {
            $st['position'] = $students[$i-1]['position'];
        } else { $st['position'] = $rank; }
        $prev = $st['total_avg']; $rank++;
    }

    respond(['students' => $students, 'term' => $term, 'session' => $session]);
}

// ─── POST character report ────────────────────────────────────
if ($method === 'POST' && $action === 'character') {
    $auth = requireAnyRole(['admin','teacher']);
    $body = getBody();
    $reports = $body['reports'] ?? [];

    foreach ($reports as $r) {
        $db->prepare("INSERT INTO character_reports
                      (student_id,session_name,term_name,punctuality,neatness,attentiveness,
                       cooperation,honesty,respect,diligence,teacher_remark)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?)
                      ON DUPLICATE KEY UPDATE
                      punctuality=VALUES(punctuality), neatness=VALUES(neatness),
                      attentiveness=VALUES(attentiveness), cooperation=VALUES(cooperation),
                      honesty=VALUES(honesty), respect=VALUES(respect),
                      diligence=VALUES(diligence), teacher_remark=VALUES(teacher_remark)")
           ->execute([
               $r['student_id'], $r['session'], $r['term'],
               $r['punctuality'] ?? null, $r['neatness'] ?? null, $r['attentiveness'] ?? null,
               $r['cooperation'] ?? null, $r['honesty'] ?? null, $r['respect'] ?? null,
               $r['diligence'] ?? null, $r['teacher_remark'] ?? null,
           ]);
    }
    respond(['success' => true]);
}

respondError('Unknown action', 404);
