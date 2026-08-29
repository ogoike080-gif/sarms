# Phase 3 — LMS Database Models

## What this phase delivers

`sql/003_lms_models.sql` — the full LMS schema, **tested end-to-end against a real
MariaDB instance** (not just eyeballed): all 23 tables create cleanly, re-running the
file is safe (idempotent, matching the app's existing `CREATE TABLE IF NOT EXISTS`
convention), all 47 foreign keys were verified to both enforce referential integrity
(an insert with a bogus `subject_id` was correctly rejected) and cascade correctly
(deleting a course correctly cascaded through modules → lessons → quizzes →
enrollments).

## Two groups of tables

**Base tables** (`sessions`, `terms`, `classes`, `subjects`, `users`, `scores`) —
these are the normalized schema from `sarms_v2_db.sql`, which Phase 1 found was
designed but never actually deployed (the live app only ever created the single
`sarms_data` blob table). Since there's no live data in these tables to conflict
with, Phase 3 recreates them as the real foundation the LMS tables need — a JSON
blob can't support foreign keys into individual student/course rows. Populating
them with real data migrated out of `sarms_data` is a Phase 4 (API layer) concern,
per `MIGRATION_PLAN.md` §4 — this phase is schema only.

**New LMS tables**, following the spec's hierarchy exactly
(Session → Term → Class → Subject → Course → Module → Lesson → LearningResource):
`courses`, `course_enrollments`, `modules`, `lessons`, `learning_resources`,
`assignments`, `assignment_submissions`, `question_bank`, `quizzes`,
`quiz_questions`, `quiz_attempts`, `quiz_attempt_answers`, `student_progress`,
`learning_activities`, `ai_conversations`, `ai_messages`, `ai_recommendations`,
`notifications`.

## Two deliberate deviations from the spec's table list, and why

- **`quiz_attempt_answers` was added** — not in the spec's §20 list, but there's no
  way to grade individual questions within an attempt, show per-question
  explanations, or support manual grading (all explicitly required by §16) without
  somewhere to store each answer. Added as a natural child of `quiz_attempts`.

- **`AuditLog` was *not* created** as a table. Phase 2 already wired calendar
  changes into the *existing* `sarms_data` `auditTrail` slice so they show up in
  the app's one existing Audit Trail page. Adding a second, SQL-table audit log
  now would just be an unused parallel source of truth — better to keep everything
  flowing through the one place the app already reads from. If the volume of
  activity later makes the JSON-blob approach too slow to query, that's a
  reasonable thing to revisit in Phase 11 (hardening).

## Design decision worth flagging

`session_name`/`term_name` are stored as plain `VARCHAR` columns on `courses`,
`assignments`, etc. — not as foreign keys to `sessions.id`/`terms.id` — deliberately
matching the convention `scores` and Phase 2's `academic_calendar_events` already
use, rather than introducing a second, inconsistent way of referencing the academic
calendar partway through the same project.

## Next step

Phase 4 per the spec: "Create LMS APIs" — this is where `users`/`classes`/
`subjects`/`scores` actually get populated (migrated out of the `sarms_data` blob,
per the staged migration plan) and the first real `api/lms.php` endpoints get built
on top of the tables in this file.
