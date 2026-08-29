# Phase 8 — Quizzes and Assignments

## What this phase delivers

Two new backend files — `api/assignments.php` and `api/quizzes.php` — plus
full teacher authoring and student-facing UI wired into the existing
`TeacherCoursesPage` and `StudentLearningPage`. This is what makes the
"Assignments" and "Quizzes" counts on Phase 7's admin dashboard, and the
"Pending Assignments"/"Upcoming Quizzes" cards on the student dashboard,
finally show real numbers instead of honest zeros.

### Assignments (spec §17)

Teacher: create (title, instructions, due date, max marks), grade with
feedback, and — critically — **grades stay hidden from the student until
the teacher explicitly publishes them** (`is_published_grade`), matching the
spec's "students see grade after publication" requirement exactly. Student:
submit a text response and/or a file (any type — PDF, doc, image — not just
images like the app's existing `saveBase64Image` helper only handles, so a
new general-purpose `saveBase64File` was written for this).

### Quizzes (spec §16)

All four question types (MCQ, true/false, fill-in-blank, short answer),
question bank for reuse across quizzes, configurable time limit and max
attempts, `randomize_questions`/`shuffle_options`. MCQ/true-false/fill-blank
auto-grade on submission; short-answer is correctly left ungraded
(`is_correct: null`) for the teacher to grade manually, and the attempt's
`is_graded` flag only flips to true once every question has a score —
so a quiz mixing auto- and manually-graded questions reports the right
state at every point, not just at the end.

**The one absolute must-not-fail requirement here**: a student taking a quiz
must never receive `correct_answer` or `explanation` before submitting.
`get_quiz_for_attempt` deliberately never selects those columns from the
database at all — not filtered client-side, not stripped before sending —
so there's no code path that can leak them by accident. Verified by hitting
the endpoint directly and confirming they're absent from the response.

## Bugs found and fixed by testing, not by reading

1. **`create_assignment` returned `id: "0"`** instead of the real inserted
   ID. Cause: `appendAudit()` (which does its own `INSERT` into `sarms_data`,
   a table with no `AUTO_INCREMENT` column) was called *before*
   `db()->lastInsertId()`, so the second call returned 0 instead of the
   assignment's real ID. Caught immediately by testing the full lifecycle —
   `list_student_assignments` still showed the assignment correctly (it
   never depended on that return value), but the create response itself was
   wrong. Checked every other file with this same `appendAudit`-then-
   `lastInsertId` pattern (`lms.php`, `calendar.php`) — none of them had the
   bug, this was specific to `assignments.php`. Fixed by capturing the ID
   immediately after the insert.

2. Confirmed (not a bug, but worth stating since it's the highest-risk part
   of this phase): a full round-trip test proved the no-leak requirement
   holds — question text and options are returned pre-attempt, but
   `correct_answer`/`explanation` are absent from that response and only
   appear in `get_attempt_result`, after submission.

## What was actually tested

Full assignment lifecycle against live MariaDB: create → student submits →
teacher grades without publishing (confirmed grade/feedback stay hidden from
the student) → teacher publishes → confirmed the student can now see it.

Full quiz lifecycle: created a quiz with one question of each auto-gradable
type plus one short-answer; confirmed the pre-attempt view never leaks
answers; started an attempt, reloaded it immediately (confirmed it resumes
the same attempt rather than creating a duplicate — same idempotency
discipline as every other phase); submitted mixed correct/incorrect/pending
answers and confirmed auto-grading was exactly right per question and the
attempt correctly stayed "not fully graded" while the short-answer was
pending; manually graded it and confirmed the score recomputed correctly
(2+0+2=4) and `is_graded` flipped to true; confirmed `max_attempts`
enforcement correctly blocked a 3rd attempt after 2 were used.

Full clean `npm run build` passes with zero errors.

## Not done in this phase (intentionally)

- No server-side hard deadline enforcement on quiz time limits — the
  attempt's start/submit times are recorded, but a late submission isn't
  rejected server-side (avoids harsh edge cases from client clock skew;
  the frontend handles the countdown UX).
- No fuzzy/partial-credit matching for fill-in-blank — exact
  case-insensitive match only, which matches the spec's scope without
  over-engineering a feature it doesn't ask for.
- Still no server-side auth enforcement — same tracked position since
  Phase 2, and flagged even more explicitly in `quizzes.php`'s header
  comment since it matters most here (nothing currently stops a student
  from calling the teacher-only `get_quiz_full` directly).

## Next step

Phase 9 per the spec: **Integrate Gemini AI** — the AI Tutor and AI Teaching
Assistant placeholders sitting in the student and teacher dashboards since
Phase 5/6 finally get built.
