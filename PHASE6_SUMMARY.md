# Phase 6 — Teacher LMS Dashboard

## What this phase delivers

A new page, `TeacherCoursesPage`, reachable via a new "My Courses" nav item
for the teacher role. The spec has no single dedicated "Teacher Dashboard"
section (unlike §9 for students and §19 for admin) — this phase synthesizes
it from §7 (Course Structure) and §8 (Learning Materials), covering exactly
what §8 says teachers should be able to do: create courses, build out
Module → Lesson structure, attach resources (text/PDF/Word/PPT/image/video/
YouTube/external link — all 8 types from §8, already defined in Phase 3's
schema), and manage who's enrolled.

Quiz and assignment authoring stay Phase 8. AI Teaching Assistant (§13)
stays Phase 9.

## Backend additions (`api/lms.php`)

Two small read-only lookups: `list_classes`, `list_subjects` — real
normalized rows (with real integer IDs) for the "create course" form's
dropdowns. Necessary because the blob's `classes`/`subjects` still use
string IDs, but `courses.class_id`/`subject_id` are real foreign keys into
the Phase 3/4 normalized tables — same bridging problem Phase 5 solved for
the logged-in user via `resolve_user`, applied here to the two other pickers
the create-course form needs.

Everything else the teacher UI calls (`create_course`, `create_module`,
`create_lesson`, `create_resource`, `enroll_class`, `unenroll_student`,
`list_enrollments`, etc.) already existed from Phase 4 — this phase is
mostly the frontend that finally uses them.

## What was actually tested

Full simulated teacher session against live MariaDB: fetched the real
class/subject dropdowns, created a course as a specific teacher, confirmed
`list_courses&teacher_id=` correctly filtered to just that teacher's
courses, built out a module → lesson → resource tree and confirmed
`get_course` returns exactly the nested shape the UI renders, toggled
publish state, bulk-enrolled an entire class (correctly caught both students
in it), then unenrolled one and confirmed the list updated. Full clean
`npm run build` also passes with zero errors.

## Design choices worth flagging

- **No class/subject restriction on teachers** — any teacher can currently
  create a course for any class/subject, not just ones they're assigned to.
  The schema has `teacher_classes`/`teacher_subjects` join tables (inherited
  from `sarms_v2_db.sql`) that could enforce this, but wiring that up would
  be scope creep beyond "create the dashboard" — and matches the app's
  existing trust model everywhere else (no server-side auth enforcement).
- **Inline expand/collapse UI**, not modals — matches Phase 2's
  `AcademicCalendarPage` style rather than introducing a new interaction
  pattern.

## Not done in this phase (intentionally)

- No quiz/assignment authoring — Phase 8.
- No AI Teaching Assistant — Phase 9.
- Still no server-side auth enforcement — same tracked position since Phase 2.

## Next step

Phase 7 per the spec: **Create admin LMS management** (§19) — the
cross-class, cross-teacher oversight view.
