-- ============================================================
-- SARMS LMS — Academic Calendar module (Phase 2)
-- Run this in phpMyAdmin against sarms_db, or let api/calendar.php
-- auto-create it on first request (same pattern as sarms_data).
-- ============================================================

USE sarms_db;

CREATE TABLE IF NOT EXISTS academic_calendar_events (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    session_name VARCHAR(20)  NOT NULL,
    term_name    VARCHAR(30)  NOT NULL,
    event_name   VARCHAR(150) NOT NULL,
    start_date   DATE         NOT NULL,
    end_date     DATE         NOT NULL,
    description  TEXT         NULL,
    status       ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_event (session_name, term_name, event_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit entries for calendar changes are NOT a separate table — they're
-- appended to the existing sarms_data 'auditTrail' slice by api/calendar.php,
-- so they show up in the existing Audit Trail page automatically.
