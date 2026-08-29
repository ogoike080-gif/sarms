-- ============================================================
-- SARMS LMS — Phase 3: LMS Database Models
--
-- Two groups of tables here:
--
-- 1. BASE TABLES (users, classes, subjects, sessions, terms, scores) —
--    these are the normalized schema from sql/sarms_v2_db.sql, recreated
--    here as CREATE TABLE IF NOT EXISTS. They were never actually deployed
--    in production (Phase 1 found the live app only ever created the
--    single sarms_data blob table) — so there is no existing data to
--    conflict with. The LMS tables below need real foreign keys into
--    real rows (per student enrollment, per-question quiz answers, etc.),
--    which a JSON blob can't support, so Phase 3 commits to this schema
--    as the target. Populating these tables with real data migrated out
--    of sarms_data is a Phase 4 (API layer) concern, not this file's.
--
-- 2. NEW LMS TABLES — course hierarchy, quizzes, assignments, progress,
--    AI conversations, notifications, per spec §7, §16, §17, §18, §20.
--
-- Design notes:
-- - session_name/term_name are stored as VARCHAR on every table that
--   needs them (Course, Assignment, etc.), matching the convention
--   already used by `scores` and `academic_calendar_events` (Phase 2) —
--   NOT as foreign keys to sessions.id/terms.id. Kept consistent with
--   the existing app rather than introducing a second convention.
-- - AuditLog is intentionally NOT created here — audit entries continue
--   to go into the existing sarms_data 'auditTrail' slice (see
--   api/calendar.php's appendAudit()), so everything shows up in the one
--   existing Audit Trail page. A parallel SQL audit table would just be
--   a second, unused source of truth.
-- - Run this once against sarms_db via phpMyAdmin, or let a future
--   api/lms.php auto-create it the same way api/calendar.php does.
-- ============================================================

USE sarms_db;

-- ── 1. BASE TABLES (reused, not duplicated — spec §20) ─────────────────

CREATE TABLE IF NOT EXISTS sessions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(20) NOT NULL UNIQUE,
    is_current TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS terms (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(30) NOT NULL UNIQUE,
    is_current TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    level      ENUM('Junior','Senior') DEFAULT 'Junior',
    legacy_id  VARCHAR(20) DEFAULT NULL UNIQUE COMMENT 'original sarms_data blob id, for backfill traceability',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    code       VARCHAR(10) NOT NULL UNIQUE,
    legacy_id  VARCHAR(20) DEFAULT NULL UNIQUE COMMENT 'original sarms_data blob id, for backfill traceability',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    role          ENUM('admin','teacher','student','parent','bursar','principal') NOT NULL,
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    student_id    VARCHAR(30) DEFAULT NULL,
    class_id      INT DEFAULT NULL,
    avatar        VARCHAR(255) DEFAULT NULL,
    child_id      INT DEFAULT NULL,
    is_active     TINYINT(1) DEFAULT 1,
    legacy_id     VARCHAR(20) DEFAULT NULL UNIQUE COMMENT 'original sarms_data blob id, for backfill traceability',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    CONSTRAINT fk_users_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_child FOREIGN KEY (child_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scores (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    student_id   INT NOT NULL,
    subject_id   INT NOT NULL,
    class_id     INT NOT NULL,
    session_name VARCHAR(20) NOT NULL,
    term_name    VARCHAR(20) NOT NULL,
    ca           DECIMAL(5,1) DEFAULT 0.0,
    exam         DECIMAL(5,1) DEFAULT 0.0,
    comment      TEXT,
    is_locked    TINYINT(1) DEFAULT 0,
    entered_by   INT DEFAULT NULL,
    legacy_id    VARCHAR(20) DEFAULT NULL UNIQUE COMMENT 'original sarms_data blob id, for backfill traceability',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_score (student_id, subject_id, session_name, term_name),
    INDEX idx_student (student_id),
    CONSTRAINT fk_scores_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_scores_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_scores_class   FOREIGN KEY (class_id)   REFERENCES classes(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- academic_calendar_events already created by api/calendar.php (Phase 2) —
-- not recreated here to avoid drift between the two definitions.

-- ── 2. COURSE HIERARCHY (spec §7) ───────────────────────────────────────
-- Session -> Term -> Class -> Subject -> Course -> Module -> Lesson -> LearningResource

CREATE TABLE IF NOT EXISTS courses (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    class_id     INT NOT NULL,
    subject_id   INT NOT NULL,
    session_name VARCHAR(20) NOT NULL,
    term_name    VARCHAR(30) NOT NULL,
    teacher_id   INT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    is_published TINYINT(1) DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course_lookup (class_id, subject_id, session_name, term_name),
    CONSTRAINT fk_courses_class   FOREIGN KEY (class_id)   REFERENCES classes(id)  ON DELETE CASCADE,
    CONSTRAINT fk_courses_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_courses_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_enrollments (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    course_id    INT NOT NULL,
    student_id   INT NOT NULL,
    status       ENUM('active','completed','dropped') DEFAULT 'active',
    enrolled_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_enrollment (course_id, student_id),
    CONSTRAINT fk_enroll_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS modules (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    course_id   INT NOT NULL,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_module_course (course_id, order_index),
    CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    module_id    INT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    content      LONGTEXT,
    order_index  INT DEFAULT 0,
    is_published TINYINT(1) DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lesson_module (module_id, order_index),
    CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_resources (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id    INT DEFAULT NULL,
    course_id    INT NOT NULL,
    teacher_id   INT NOT NULL,
    type         ENUM('text','pdf','doc','ppt','image','video','youtube_link','external_link') NOT NULL,
    title        VARCHAR(200) NOT NULL,
    url_or_path  VARCHAR(500) DEFAULT NULL,
    topic        VARCHAR(150) DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_resource_lesson (lesson_id),
    CONSTRAINT fk_resource_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. ASSIGNMENTS (spec §17 — richer than the unused sarms_v2_db.sql version) ──

CREATE TABLE IF NOT EXISTS assignments (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    course_id         INT NOT NULL,
    lesson_id         INT DEFAULT NULL,
    class_id          INT NOT NULL,
    subject_id        INT NOT NULL,
    teacher_id        INT NOT NULL,
    title             VARCHAR(200) NOT NULL,
    instructions      TEXT,
    resource_path     VARCHAR(500) DEFAULT NULL,
    start_date        DATE DEFAULT NULL,
    due_date          DATE NOT NULL,
    max_marks         DECIMAL(6,2) DEFAULT 100.00,
    allow_submissions TINYINT(1) DEFAULT 1,
    status            ENUM('draft','published','closed') DEFAULT 'draft',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_assignment_course (course_id),
    INDEX idx_assignment_due (due_date),
    CONSTRAINT fk_assign_course  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
    CONSTRAINT fk_assign_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id)  ON DELETE SET NULL,
    CONSTRAINT fk_assign_class   FOREIGN KEY (class_id)   REFERENCES classes(id)  ON DELETE CASCADE,
    CONSTRAINT fk_assign_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_assign_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id       INT NOT NULL,
    student_id          INT NOT NULL,
    text_response       LONGTEXT,
    file_path           VARCHAR(500) DEFAULT NULL,
    file_name           VARCHAR(255) DEFAULT NULL,
    submitted_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade               DECIMAL(6,2) DEFAULT NULL,
    feedback             TEXT,
    graded_by           INT DEFAULT NULL,
    graded_at           TIMESTAMP NULL DEFAULT NULL,
    is_published_grade  TINYINT(1) DEFAULT 0,
    UNIQUE KEY unique_submission (assignment_id, student_id),
    CONSTRAINT fk_submission_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_student    FOREIGN KEY (student_id)    REFERENCES users(id)        ON DELETE CASCADE,
    CONSTRAINT fk_submission_grader     FOREIGN KEY (graded_by)     REFERENCES users(id)        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 4. QUIZ SYSTEM (spec §16) ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS question_bank (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    subject_id     INT NOT NULL,
    topic          VARCHAR(150) DEFAULT NULL,
    difficulty     ENUM('easy','medium','hard') DEFAULT 'medium',
    question_type  ENUM('mcq','true_false','fill_blank','short_answer') NOT NULL,
    question_text  TEXT NOT NULL,
    options_json   JSON DEFAULT NULL,
    correct_answer TEXT NOT NULL,
    marks          DECIMAL(5,2) DEFAULT 1.00,
    explanation    TEXT,
    created_by     INT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bank_subject_topic (subject_id, topic),
    CONSTRAINT fk_bank_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_bank_creator FOREIGN KEY (created_by) REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quizzes (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    course_id           INT NOT NULL,
    lesson_id           INT DEFAULT NULL,
    teacher_id          INT NOT NULL,
    title               VARCHAR(200) NOT NULL,
    description         TEXT,
    time_limit_minutes  INT DEFAULT NULL,
    max_attempts        INT DEFAULT 1,
    randomize_questions TINYINT(1) DEFAULT 0,
    shuffle_options     TINYINT(1) DEFAULT 0,
    status              ENUM('draft','published','closed') DEFAULT 'draft',
    available_from      DATETIME DEFAULT NULL,
    available_until     DATETIME DEFAULT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quiz_course (course_id),
    CONSTRAINT fk_quiz_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id) ON DELETE SET NULL,
    CONSTRAINT fk_quiz_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_questions (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id           INT NOT NULL,
    question_bank_id  INT DEFAULT NULL,
    question_type     ENUM('mcq','true_false','fill_blank','short_answer') NOT NULL,
    question_text     TEXT NOT NULL,
    options_json      JSON DEFAULT NULL,
    correct_answer    TEXT NOT NULL,
    marks             DECIMAL(5,2) DEFAULT 1.00,
    explanation       TEXT,
    topic             VARCHAR(150) DEFAULT NULL,
    order_index       INT DEFAULT 0,
    INDEX idx_qq_quiz (quiz_id, order_index),
    CONSTRAINT fk_qq_quiz  FOREIGN KEY (quiz_id)          REFERENCES quizzes(id)       ON DELETE CASCADE,
    CONSTRAINT fk_qq_bank  FOREIGN KEY (question_bank_id) REFERENCES question_bank(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id         INT NOT NULL,
    student_id      INT NOT NULL,
    attempt_number  INT DEFAULT 1,
    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at    TIMESTAMP NULL DEFAULT NULL,
    score           DECIMAL(6,2) DEFAULT NULL,
    max_score       DECIMAL(6,2) DEFAULT NULL,
    is_graded       TINYINT(1) DEFAULT 0,
    UNIQUE KEY unique_attempt (quiz_id, student_id, attempt_number),
    CONSTRAINT fk_attempt_quiz    FOREIGN KEY (quiz_id)    REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_student FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-question answers within an attempt — needed to support automatic +
-- manual grading and explanations per question (spec §16), not explicitly
-- named in the spec's table list but required to implement it.
CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id       INT NOT NULL,
    question_id      INT NOT NULL,
    student_answer   TEXT,
    is_correct       TINYINT(1) DEFAULT NULL,
    marks_awarded    DECIMAL(5,2) DEFAULT NULL,
    UNIQUE KEY unique_answer (attempt_id, question_id),
    CONSTRAINT fk_answer_attempt  FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts(id)  ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 5. PROGRESS & ACTIVITY (feeds Phase 10 AI analytics) ────────────────

CREATE TABLE IF NOT EXISTS student_progress (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    student_id        INT NOT NULL,
    course_id         INT NOT NULL,
    lesson_id         INT DEFAULT NULL,
    status            ENUM('not_started','in_progress','completed') DEFAULT 'not_started',
    progress_percent  DECIMAL(5,2) DEFAULT 0.00,
    last_accessed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at      TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY unique_progress (student_id, course_id, lesson_id),
    CONSTRAINT fk_progress_student FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_progress_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_activities (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    student_id     INT NOT NULL,
    course_id      INT DEFAULT NULL,
    lesson_id      INT DEFAULT NULL,
    activity_type  VARCHAR(50) NOT NULL,
    metadata_json  JSON DEFAULT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_student (student_id, created_at),
    CONSTRAINT fk_activity_student FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_activity_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE SET NULL,
    CONSTRAINT fk_activity_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 6. AI TUTOR / TEACHING ASSISTANT (Phase 9 will populate these) ──────

CREATE TABLE IF NOT EXISTS ai_conversations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    persona         ENUM('student_tutor','teacher_assistant') NOT NULL,
    course_id       INT DEFAULT NULL,
    subject_id      INT DEFAULT NULL,
    title           VARCHAR(200) DEFAULT NULL,
    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conv_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_conv_course  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE SET NULL,
    CONSTRAINT fk_conv_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_messages (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id  INT NOT NULL,
    sender           ENUM('user','ai') NOT NULL,
    content          MEDIUMTEXT NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_message_conv (conversation_id, created_at),
    CONSTRAINT fk_message_conv FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    student_id    INT NOT NULL,
    course_id     INT DEFAULT NULL,
    type          VARCHAR(50) NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    is_dismissed  TINYINT(1) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reco_student (student_id, is_dismissed),
    CONSTRAINT fk_reco_student FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_reco_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 7. NOTIFICATIONS (spec §18) ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    type        VARCHAR(50) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    message     TEXT,
    link        VARCHAR(500) DEFAULT NULL,
    is_read     TINYINT(1) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user (user_id, is_read, created_at),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
