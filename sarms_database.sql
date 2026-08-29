-- ============================================================
-- SARMS Database Setup
-- Run this once in phpMyAdmin to get started.
-- That's all you need — the app creates its own table structure.
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS sarms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Select it
USE sarms_db;

-- 3. Create the single storage table
--    (The PHP app also auto-creates this on first run,
--     but running it here ensures it exists before the app opens.)
CREATE TABLE IF NOT EXISTS sarms_data (
    slice_key   VARCHAR(60)  PRIMARY KEY,
    slice_value LONGTEXT     NOT NULL,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Done! Open http://localhost/sarms in your browser.
-- Default admin login:
--   Email   : admin@school.com
--   Password: admin@2024
-- Change these immediately from Settings > My Profile after first login.
