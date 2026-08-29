-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2026 at 10:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sarms_v2_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `target_class` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `author_id`, `target_class`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to 2024/2025 Academic Session', 'We warmly welcome all students and staff to the new academic session. Let us make it a great year!', 1, NULL, '2026-04-15 17:08:08', '2026-04-15 17:08:08'),
(2, 'Mathematics Test Next Week', 'JSS 1 students should prepare for a mathematics test on Monday.', 2, 1, '2026-04-15 17:08:08', '2026-04-15 17:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `class_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `text_response` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_trail`
--

CREATE TABLE `audit_trail` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(150) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `character_reports`
--

CREATE TABLE `character_reports` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `session_name` varchar(20) NOT NULL,
  `term_name` varchar(20) NOT NULL,
  `punctuality` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `neatness` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `attentiveness` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `cooperation` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `honesty` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `respect` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `diligence` enum('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `teacher_remark` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `level` enum('Junior','Senior') DEFAULT 'Junior',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `level`, `created_at`) VALUES
(1, 'JSS 1', 'Junior', '2026-04-15 17:08:06'),
(2, 'JSS 2', 'Junior', '2026-04-15 17:08:06'),
(3, 'JSS 3', 'Junior', '2026-04-15 17:08:06'),
(4, 'SSS 1', 'Senior', '2026-04-15 17:08:06'),
(5, 'SSS 2', 'Senior', '2026-04-15 17:08:06'),
(6, 'SSS 3', 'Senior', '2026-04-15 17:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `grading_system`
--

CREATE TABLE `grading_system` (
  `id` int(11) NOT NULL,
  `grade` char(2) NOT NULL,
  `min_score` decimal(5,1) NOT NULL,
  `max_score` decimal(5,1) NOT NULL,
  `remark` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grading_system`
--

INSERT INTO `grading_system` (`id`, `grade`, `min_score`, `max_score`, `remark`) VALUES
(1, 'A', 70.0, 100.0, 'Excellent'),
(2, 'B', 60.0, 69.0, 'Very Good'),
(3, 'C', 50.0, 59.0, 'Good'),
(4, 'D', 40.0, 49.0, 'Fair'),
(5, 'F', 0.0, 39.0, 'Fail');

-- --------------------------------------------------------

--
-- Table structure for table `institution`
--

CREATE TABLE `institution` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL DEFAULT 'Greenfield Academy',
  `address` text DEFAULT NULL,
  `principal` varchar(150) DEFAULT NULL,
  `principal_comment` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution`
--

INSERT INTO `institution` (`id`, `name`, `address`, `principal`, `principal_comment`, `logo`, `signature`, `updated_at`) VALUES
(1, 'Greenfield Academy', '123 Learning Lane, Education City', 'Dr. Margaret Thompson', 'Diligence and hard work are keys to success. Keep striving for excellence!', NULL, NULL, '2026-04-15 17:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `pin_codes`
--

CREATE TABLE `pin_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `claimed_by` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pin_codes`
--

INSERT INTO `pin_codes` (`id`, `code`, `claimed_by`, `used_count`, `created_at`) VALUES
(1, 'GFA-X7K2M', NULL, 0, '2026-04-15 17:08:08'),
(2, 'GFA-P9N4R', NULL, 0, '2026-04-15 17:08:08'),
(3, 'GFA-Q3T8W', NULL, 0, '2026-04-15 17:08:08'),
(4, 'GFA-L5H7J', NULL, 0, '2026-04-15 17:08:08'),
(5, 'GFA-B2C6F', NULL, 0, '2026-04-15 17:08:08'),
(6, 'GFA-Z1V9D', NULL, 0, '2026-04-15 17:08:08'),
(7, 'GFA-M8G3K', NULL, 0, '2026-04-15 17:08:08'),
(8, 'GFA-F5J9L', NULL, 0, '2026-04-15 17:08:08'),
(9, 'GFA-R2T6W', NULL, 0, '2026-04-15 17:08:08'),
(10, 'GFA-N4D8P', NULL, 0, '2026-04-15 17:08:08'),
(11, 'GFA-V3C8M', NULL, 0, '2026-04-15 17:08:08'),
(12, 'GFA-H7Z1Q', NULL, 0, '2026-04-15 17:08:08'),
(13, 'GFA-J9K4R', NULL, 0, '2026-04-15 17:08:08'),
(14, 'GFA-S2M7N', NULL, 0, '2026-04-15 17:08:08'),
(15, 'GFA-W5L3F', NULL, 0, '2026-04-15 17:08:08'),
(16, 'GFA-Y8P2G', NULL, 0, '2026-04-15 17:08:08'),
(17, 'GFA-A4T6H', NULL, 0, '2026-04-15 17:08:08'),
(18, 'GFA-C1V9J', NULL, 0, '2026-04-15 17:08:08'),
(19, 'GFA-E6Z3K', NULL, 0, '2026-04-15 17:08:08'),
(20, 'GFA-I2N7M', NULL, 0, '2026-04-15 17:08:08'),
(21, 'GFA-O5R4W', NULL, 0, '2026-04-15 17:08:08'),
(22, 'GFA-U7S1X', NULL, 0, '2026-04-15 17:08:08'),
(23, 'GFA-K3F8Y', NULL, 0, '2026-04-15 17:08:08'),
(24, 'GFA-G9L2D', NULL, 0, '2026-04-15 17:08:08'),
(25, 'GFA-B6H4P', NULL, 0, '2026-04-15 17:08:08'),
(26, 'GFA-X1M5T', NULL, 0, '2026-04-15 17:08:08'),
(27, 'GFA-Q8N3V', NULL, 0, '2026-04-15 17:08:08'),
(28, 'GFA-J2L7C', NULL, 0, '2026-04-15 17:08:08'),
(29, 'GFA-R5Z9K', NULL, 0, '2026-04-15 17:08:08'),
(30, 'GFA-P4M8F', NULL, 0, '2026-04-15 17:08:08'),
(31, 'GFA-D3T6H', NULL, 0, '2026-04-15 17:08:08'),
(32, 'GFA-L9V1W', NULL, 0, '2026-04-15 17:08:08'),
(33, 'GFA-C7K4N', NULL, 0, '2026-04-15 17:08:08'),
(34, 'GFA-Z2J6R', NULL, 0, '2026-04-15 17:08:08'),
(35, 'GFA-F8M3S', NULL, 0, '2026-04-15 17:08:08'),
(36, 'GFA-H1L5Y', NULL, 0, '2026-04-15 17:08:08'),
(37, 'GFA-N6T2P', NULL, 0, '2026-04-15 17:08:08'),
(38, 'GFA-S9R4W', NULL, 0, '2026-04-15 17:08:08'),
(39, 'GFA-W3C8K', NULL, 0, '2026-04-15 17:08:08'),
(40, 'GFA-V5G7Z', NULL, 0, '2026-04-15 17:08:08'),
(41, 'GFA-M2D9X', NULL, 0, '2026-04-15 17:08:08'),
(42, 'GFA-T4L1Q', NULL, 0, '2026-04-15 17:08:08'),
(43, 'GFA-E8J6F', NULL, 0, '2026-04-15 17:08:08'),
(44, 'GFA-A3N5H', NULL, 0, '2026-04-15 17:08:08'),
(45, 'GFA-Y7K2M', NULL, 0, '2026-04-15 17:08:08'),
(46, 'GFA-U1P9R', NULL, 0, '2026-04-15 17:08:08'),
(47, 'GFA-O6S3W', NULL, 0, '2026-04-15 17:08:08'),
(48, 'GFA-I4V8C', NULL, 0, '2026-04-15 17:08:08'),
(49, 'GFA-B9Z2L', NULL, 0, '2026-04-15 17:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `session_name` varchar(20) NOT NULL,
  `term_name` varchar(20) NOT NULL,
  `ca` decimal(5,1) DEFAULT 0.0,
  `exam` decimal(5,1) DEFAULT 0.0,
  `comment` text DEFAULT NULL,
  `is_locked` tinyint(1) DEFAULT 0,
  `entered_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `student_id`, `subject_id`, `class_id`, `session_name`, `term_name`, `ca`, `exam`, `comment`, `is_locked`, `entered_by`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 1, '2024/2025', 'First Term', 25.0, 60.0, 'Excellent work!', 0, 2, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(2, 4, 2, 1, '2024/2025', 'First Term', 28.0, 55.0, 'Good performance.', 0, 3, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(3, 5, 1, 1, '2024/2025', 'First Term', 20.0, 45.0, 'Needs improvement.', 0, 2, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(4, 5, 2, 1, '2024/2025', 'First Term', 22.0, 48.0, 'Average performance.', 0, 3, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(5, 6, 5, 4, '2024/2025', 'First Term', 30.0, 65.0, 'Top performer!', 0, 2, '2026-04-15 17:08:07', '2026-04-15 17:08:07');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `name`, `is_current`, `created_at`) VALUES
(1, '2022/2023', 0, '2026-04-15 17:08:06'),
(2, '2023/2024', 0, '2026-04-15 17:08:06'),
(3, '2024/2025', 1, '2026-04-15 17:08:06'),
(4, '2025/2026', 0, '2026-04-15 17:08:06'),
(5, '2026/2027', 0, '2026-04-15 17:08:06'),
(6, '2027/2028', 0, '2026-04-15 17:08:06'),
(7, '2028/2029', 0, '2026-04-15 17:08:06'),
(8, '2029/2030', 0, '2026-04-15 17:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('current_session', '2025/2026', '2026-04-15 17:40:48'),
('current_term', 'Second Term', '2026-04-15 17:40:49'),
('result_published', '0', '2026-04-15 17:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `code`, `created_at`) VALUES
(1, 'Mathematics', 'MTH', '2026-04-15 17:08:06'),
(2, 'English Language', 'ENG', '2026-04-15 17:08:06'),
(3, 'Basic Science', 'BSC', '2026-04-15 17:08:06'),
(4, 'Social Studies', 'SST', '2026-04-15 17:08:06'),
(5, 'Physics', 'PHY', '2026-04-15 17:08:06'),
(6, 'Chemistry', 'CHM', '2026-04-15 17:08:06'),
(7, 'Biology', 'BIO', '2026-04-15 17:08:06'),
(8, 'Further Mathematics', 'FMT', '2026-04-15 17:08:06'),
(9, 'Economics', 'ECO', '2026-04-15 17:08:06'),
(10, 'Civic Education', 'CIV', '2026-04-15 17:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_classes`
--

CREATE TABLE `teacher_classes` (
  `teacher_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_classes`
--

INSERT INTO `teacher_classes` (`teacher_id`, `class_id`) VALUES
(2, 1),
(2, 4),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_subjects`
--

CREATE TABLE `teacher_subjects` (
  `teacher_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_subjects`
--

INSERT INTO `teacher_subjects` (`teacher_id`, `subject_id`) VALUES
(2, 1),
(2, 5),
(3, 2),
(3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `terms`
--

CREATE TABLE `terms` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `is_current` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `terms`
--

INSERT INTO `terms` (`id`, `name`, `is_current`) VALUES
(1, 'First Term', 1),
(2, 'Second Term', 0),
(3, 'Third Term', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` enum('admin','teacher','student','parent') NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `student_id` varchar(30) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `child_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `password_hash`, `student_id`, `class_id`, `avatar`, `child_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Admin User', 'admin@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(2, 'teacher', 'Mr. James Okafor', 'teacher1@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(3, 'teacher', 'Mrs. Adaeze Nwosu', 'teacher2@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(4, 'student', 'Chioma Eze', 'student1@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STD001', 1, NULL, NULL, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(5, 'student', 'Emeka Obi', 'student2@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STD002', 1, NULL, NULL, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(6, 'student', 'Fatima Bello', 'student3@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STD003', 4, NULL, NULL, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07'),
(7, 'parent', 'Mr. Eze (Parent)', 'parent1@greenfield.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, 4, 1, '2026-04-15 17:08:07', '2026-04-15 17:08:07');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_scores_full`
-- (See below for the actual view)
--
CREATE TABLE `v_scores_full` (
`id` int(11)
,`student_id` int(11)
,`student_name` varchar(150)
,`reg_no` varchar(30)
,`subject_id` int(11)
,`subject_name` varchar(100)
,`subject_code` varchar(10)
,`class_id` int(11)
,`class_name` varchar(50)
,`session_name` varchar(20)
,`term_name` varchar(20)
,`ca` decimal(5,1)
,`exam` decimal(5,1)
,`total` decimal(6,1)
,`comment` text
,`is_locked` tinyint(1)
,`entered_by` int(11)
,`entered_by_name` varchar(150)
);

-- --------------------------------------------------------

--
-- Structure for view `v_scores_full`
--
DROP TABLE IF EXISTS `v_scores_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_scores_full`  AS SELECT `s`.`id` AS `id`, `s`.`student_id` AS `student_id`, `u`.`name` AS `student_name`, `u`.`student_id` AS `reg_no`, `s`.`subject_id` AS `subject_id`, `sub`.`name` AS `subject_name`, `sub`.`code` AS `subject_code`, `s`.`class_id` AS `class_id`, `c`.`name` AS `class_name`, `s`.`session_name` AS `session_name`, `s`.`term_name` AS `term_name`, `s`.`ca` AS `ca`, `s`.`exam` AS `exam`, `s`.`ca`+ `s`.`exam` AS `total`, `s`.`comment` AS `comment`, `s`.`is_locked` AS `is_locked`, `s`.`entered_by` AS `entered_by`, `eu`.`name` AS `entered_by_name` FROM ((((`scores` `s` join `users` `u` on(`u`.`id` = `s`.`student_id`)) join `subjects` `sub` on(`sub`.`id` = `s`.`subject_id`)) join `classes` `c` on(`c`.`id` = `s`.`class_id`)) left join `users` `eu` on(`eu`.`id` = `s`.`entered_by`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_author` (`author_id`),
  ADD KEY `target_class` (`target_class`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`class_id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_teacher` (`teacher_id`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_submission` (`assignment_id`,`student_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Indexes for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_action` (`action`);

--
-- Indexes for table `character_reports`
--
ALTER TABLE `character_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_char` (`student_id`,`session_name`,`term_name`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grading_system`
--
ALTER TABLE `grading_system`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `grade` (`grade`);

--
-- Indexes for table `institution`
--
ALTER TABLE `institution`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pin_codes`
--
ALTER TABLE `pin_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `claimed_by` (`claimed_by`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_score` (`student_id`,`subject_id`,`session_name`,`term_name`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_class` (`class_id`),
  ADD KEY `entered_by` (`entered_by`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `teacher_classes`
--
ALTER TABLE `teacher_classes`
  ADD PRIMARY KEY (`teacher_id`,`class_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  ADD PRIMARY KEY (`teacher_id`,`subject_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `terms`
--
ALTER TABLE `terms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `child_id` (`child_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_trail`
--
ALTER TABLE `audit_trail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `character_reports`
--
ALTER TABLE `character_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `grading_system`
--
ALTER TABLE `grading_system`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `institution`
--
ALTER TABLE `institution`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pin_codes`
--
ALTER TABLE `pin_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `terms`
--
ALTER TABLE `terms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`target_class`) REFERENCES `classes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignments_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignment_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD CONSTRAINT `audit_trail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `character_reports`
--
ALTER TABLE `character_reports`
  ADD CONSTRAINT `character_reports_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pin_codes`
--
ALTER TABLE `pin_codes`
  ADD CONSTRAINT `pin_codes_ibfk_1` FOREIGN KEY (`claimed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scores_ibfk_4` FOREIGN KEY (`entered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `teacher_classes`
--
ALTER TABLE `teacher_classes`
  ADD CONSTRAINT `teacher_classes_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  ADD CONSTRAINT `teacher_subjects_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
