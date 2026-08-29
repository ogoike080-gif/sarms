# Phase 5 — Student LMS Dashboard

## What this phase delivers

A new page, `StudentLearningPage`, reachable via a new "My Learning" nav item
for the student role — the first frontend surface that actually calls
`api/lms.php`. Covers every section spec §9 asks for:

Welcome header, Academic Session/Current Term (reuses Phase 2's
`CurrentTermWidget` directly), My Subjects, Continue Learning, Upcoming
Lessons, Pending Assignments, Upcoming Quizzes, Recent Results, Learning
Progress (per-subject % bars, matching the spec's exact example format).

**Recommended Topics and AI Tutor are honest placeholders**, not fake data —
those are Phase 10 (AI analytics) and Phase 9 (Gemini) respectively, neither
built yet. They render as "Coming soon" cards rather than pretending to work.

## Backend additions (`api/lms.php`, extended from Phase 4)

- `resolve_user` — bridges the still-blob-based session to the normalized
  `users.id` the LMS tables need, via email (unique in both). Auth migration
  is still deliberately deferred (see `MIGRATION_PLAN.md` §4 step 5) — this
  is the minimum needed to let the LMS pages work without pulling that whole
  migration forward.
- `mark_lesson_progress` / `get_student_progress` — the actual progress
  tracking. `list_upcoming_lessons` — next lessons across enrolled courses
  the student hasn't completed. `list_pending_assignments` /
  `list_upcoming_quizzes` — read from tables that exist (Phase 3) but have no
  writer yet (Phase 8 builds that) — they return real, correctly-empty
  results today rather than being stubbed, so the dashboard won't need
  rework once Phase 8 ships.

## A real bug found and fixed while testing

First version stored a course-level "rollup" progress row using
`lesson_id = NULL` as a sentinel, upserted via `ON DUPLICATE KEY UPDATE`.
Testing against real MariaDB caught this immediately: `NULL` is never equal
to `NULL` in a MySQL/MariaDB unique constraint, so instead of updating one
row, every call inserted a new one — confirmed by seeing two rows for the
same course after two `mark_lesson_progress` calls. Fixed by computing course
progress on read (aggregate query over the real per-lesson rows) instead of
maintaining a separate stored rollup — simpler, can't drift out of sync, and
avoids the NULL-uniqueness trap entirely. Retested and confirmed: one row per
lesson, correct percentages, and re-marking the same lesson complete twice
doesn't create a duplicate.

## What was actually tested

Full simulation of the real call sequence `StudentLearningPage` makes on
mount, against live MariaDB with two courses (one with a lesson, one without):
`resolve_user` → `list_student_courses` → `list_upcoming_lessons` →
`list_pending_assignments` → `list_upcoming_quizzes` → `get_student_progress`
→ `get_lesson` (lesson viewer) → `mark_lesson_progress` → `get_student_progress`
again. Confirmed the progress percentage correctly moved from 0% to 100% after
marking the one lesson complete, and that a course with zero lessons
correctly shows 0% rather than a division-by-zero error.

Also caught and fixed a smaller bug in my own frontend code before it ever
shipped: referenced `COLORS.border`, which doesn't exist in this app's color
palette (it's `COLORS.surfaceBorder`) — would have silently rendered
invisible borders. Fixed in the 4 places I'd introduced it. (Left 3
pre-existing instances of the same typo elsewhere in the codebase alone —
not introduced by this phase, out of scope to fix here.)

Full clean `npm run build` also passes with zero errors.

## Not done in this phase (intentionally)

- No teacher- or admin-facing course management UI — that's Phases 6 and 7.
- No assignment submission or quiz-taking UI — Phase 8, once those APIs exist.
- No AI Tutor / Recommended Topics — Phases 9 and 10.
- Still no server-side auth enforcement on `lms.php` — same tracked position
  as every phase since Phase 2.

## Next step

Phase 6 per the spec: **Create teacher LMS dashboard** — course/module/lesson
authoring, the other side of what students now see.
