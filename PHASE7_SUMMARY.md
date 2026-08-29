# Phase 7 — Admin LMS Management

## What this phase delivers

A new page, `AdminLmsPage`, reachable via a new "LMS Overview" nav item under
a new "Learning Management" section. Covers spec §19 exactly — all 11 stats
it names — plus a cross-teacher "All Courses" oversight table, since a
read-only stats page without any way to act on what it shows isn't much
"management."

## Backend addition: `get_lms_stats`

Computes all 11 §19 metrics. Three of them — Assignments, Quizzes, AI Tutor
Usage — correctly read 0 today, with a note in the UI explaining why (Phase 8
and Phase 9 haven't shipped, so there's genuinely nothing to count yet, not
a bug).

**"Students Needing Support" is a simple, honest non-AI heuristic** — students
with under 30% course completion — clearly scoped as that, not as the real
AI-driven analysis. The spec puts actual AI-based performance analysis in
Phase 10 (§14); pulling that forward here under a different name would be the
same scope-creep mistake flagged in earlier phases. This is a placeholder
metric that's still genuinely useful today, not a stand-in trying to look
smarter than it is.

**Average Completion Rate** required real computation, not a stored value —
per Phase 5's fix, course completion is computed on read (`computeCourseProgress`,
already defined in `lms.php`) rather than stored as a rollup row, since storing
one hit the MySQL NULL-uniqueness trap found back then. This phase reuses that
same function across every enrollment to get the platform-wide average,
rather than introducing a second, parallel way of computing the same number.

The "All Courses" browser needed no new endpoint — it's `list_courses`
(Phase 4) called without the `teacher_id` filter Phase 6 always passed.

## What was actually tested

Seeded 3 students (one inactive, one at 100% course completion, one at 0%)
under one teacher's course, then ran the exact sequence `AdminLmsPage` calls:
`get_lms_stats` on mount, `list_courses` for the all-courses table,
`get_course` for the expand-row detail. Confirmed the inactive student was
correctly excluded from both `activeStudents` and class enrollment, the 0%/100%
split correctly averaged to 50% completion, and the 0%-completion student was
correctly flagged as needing support. Then tested admin's actual management
actions — unpublish (confirmed `activeCourses` dropped to 0) and delete
(confirmed the cascade correctly zeroed out lessons, enrollments, and
completion rate together, no division-by-zero error on the now-empty
enrollment set). Clean `npm run build` too.

## Not done in this phase (intentionally)

- No teacher/class reassignment tools, no bulk operations beyond what
  existed already — kept to what §19 + reasonable oversight actually need.
- No real AI-based "needing support" analysis — Phase 10.
- Still no server-side auth enforcement — same tracked position since Phase 2.

## Next step

Phase 8 per the spec: **Implement quizzes and assignments** — the first
phase where `totalAssignments`, `totalQuizzes`, and `avgQuizScore` on this
very dashboard will start reading real numbers instead of honest zeros.
