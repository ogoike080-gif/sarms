# Phase 4 — LMS APIs

## What this phase delivers

Two new files, both tested end-to-end against a real, seeded MariaDB database
(not just read-through) — the same rigor as Phase 3.

### 1. `api/lms_migrate.php` — the backfill (prerequisite for everything else)

Phase 3 built the normalized schema, but production only ever had the single
`sarms_data` blob table — the normalized tables were empty. This script copies
`users`, `classes`, `subjects`, `scores` out of the blob into them.

- **`action=status`** — read-only, shows blob counts vs. normalized-table counts.
  Safe to call anytime to check where things stand.
- **`action=backfill`** — does the actual copy, inside a transaction (rolls back
  entirely on any failure, never leaves a half-migrated state).

**Found and fixed a real gap while building this:** Phase 3's `users.role` enum
only allowed 4 roles (`admin`/`teacher`/`student`/`parent`), but the live app
actually has 6 — `bursar` and `principal` were missing. Caught by checking the
real role values used in `src/App.jsx` before writing the backfill, not by
guessing. `sql/003_lms_models.sql` is corrected, and the backfill script also
widens the column defensively in case Phase 3 was already run against the old
version.

**Also found:** blob IDs are short random strings (`generateId()` →
`Math.random().toString(36)`), not integers — incompatible with the `INT
AUTO_INCREMENT` primary keys Phase 3 already committed to (correctly, for join
performance and consistency with `sarms_v2_db.sql`'s original design). Added a
`legacy_id` column to `users`/`classes`/`subjects`/`scores` to bridge this: the
backfill maps old string IDs to new integer IDs in memory as it goes (handling
forward references — e.g. a parent's `child_id` — with a two-pass insert), and
`legacy_id` makes re-running the script safe: anything already migrated is
recognized and skipped rather than duplicated or overwritten.

**Passwords:** the blob stores them in plaintext (confirmed back in Phase 1).
The backfill bcrypt-hashes them into `password_hash` on the way in. This does
**not** wire up server-side login yet — the frontend still does its own
client-side check against the blob — that's still a separate step per
`MIGRATION_PLAN.md` §4 step 5. Hashing now was essentially free since the
backfill already touches every password, and there's no reason to carry
plaintext into the new tables just because the login flow hasn't caught up yet.

### 2. `api/lms.php` — the course hierarchy + enrollment API

Covers Course → Module → Lesson → LearningResource (spec §7) and
`course_enrollments`, matching Phase 4's scope in the spec's phase list.
Quiz- and assignment-specific endpoints are explicitly Phase 8, not here.

Actions: `list_courses`, `get_course` (returns the full nested
modules→lessons tree in one call), `create_course`, `update_course`,
`delete_course`; `list_modules`/`create_module`/`update_module`/`delete_module`;
`list_lessons`/`get_lesson`/`create_lesson`/`update_lesson`/`delete_lesson`;
`list_resources`/`create_resource`/`delete_resource`; `enroll_student`,
`unenroll_student`, `list_enrollments`, `list_student_courses`.

**One addition beyond the spec's literal list:** `enroll_class` — bulk-enrolls
every active student in a course's class in one call. Not spec-named, but a
natural convenience for the common case (a class-wide course) rather than
requiring the frontend to loop `enroll_student` per student.

## What was actually tested (not just written)

Seeded a realistic `sarms_data` blob matching the app's real field shapes
(camelCase, string IDs, plaintext passwords) and ran the full pipeline against
a live MariaDB instance:

- Backfill: verified bcrypt hashing, class FK resolution, and the two-pass
  parent→child resolution all produced correct rows — then re-ran it and
  confirmed everything was correctly skipped (idempotent), not duplicated.
- Course lifecycle: created a course → module → lesson → resource, confirmed
  `get_course` returns the correctly nested tree.
- Enrollment: single enroll, bulk `enroll_class` (correctly caught the one
  matching student), re-ran it (0 newly enrolled, correct), tried a duplicate
  single enroll (correctly rejected with 409).
- Validation: missing required fields (400), invalid resource type (400),
  nonexistent course (404), unknown action (404) — all correct.
- Cascade delete: deleted a course, confirmed modules/lessons/enrollments/
  resources all correctly disappeared with it via the FKs from Phase 3.
- Audit trail: confirmed course create/delete events landed correctly in the
  existing `auditTrail` slice, in the same format Phase 2 already established.

## Not done in this phase (intentionally)

- **No server-side auth enforcement** on `lms.php` — same position as
  `api/calendar.php` since Phase 2, tracked in the same place
  (`MIGRATION_PLAN.md` §4 step 5). Still not silently expanding scope to fix
  this mid-phase.
- **No frontend UI** — Phase 4 is API-only per the spec's phase list. Phases
  5/6/7 (student/teacher/admin dashboards) are what will actually call these
  endpoints from the React app.
- **No quiz/assignment endpoints** — explicitly Phase 8.

## Before running this in your XAMPP environment

Run `sql/003_lms_models.sql` (updated in this phase) if you haven't already,
then hit `api/lms_migrate.php?action=status` to see current counts, then
`api/lms_migrate.php?action=backfill` to actually populate the tables. Safe to
call `status` and re-call `backfill` as many times as you want.

## Next step

Phase 5 per the spec: **Create student LMS dashboard** — the first real
frontend surface consuming `api/lms.php`.
