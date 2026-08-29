-- ============================================================
-- SARMS LMS — Phase 10 support: add quiz_questions.topic
--
-- Needed for spec §14's "Weak Topics"/"Frequently Incorrect
-- Concepts" analytics — quiz_questions previously had no topic
-- field (only question_bank did). Safe to run on both fresh and
-- existing installs; api/quizzes.php also checks for this column
-- defensively on first request, so running this file by hand is
-- optional, not required.
-- ============================================================

USE sarms_db;

SET @col_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quiz_questions' AND COLUMN_NAME = 'topic'
);
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE quiz_questions ADD COLUMN topic VARCHAR(150) DEFAULT NULL AFTER explanation',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
