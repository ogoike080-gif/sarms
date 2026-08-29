# Phase 11 — Testing and Security Hardening

## What this phase delivers

Real server-side authentication (the gap tracked since Phase 2) applied
across every LMS API file, file upload hardening, AI cost control, and
targeted mobile-layout fixes.

## Authentication (`api/auth_jwt.php`)

A dependency-free HS256 JWT implementation — no external library, since
composer/packagist isn't reachable from this environment (confirmed back in
Phase 3). Issues tokens against the **normalized** `users` table (bcrypt
`password_hash`, populated by Phase 4's backfill), not the blob the rest of
the app's login still checks client-side.

**This does not replace the existing client-side login.** That stays
exactly as it was — a large, risky change to make this late, and outside
what this phase needs. Instead, right after a successful client-side login,
the frontend now also calls this endpoint to get a real bearer token, which
every LMS API bridge (`CalendarAPI`, `LmsAPI`, `AssignmentsAPI`,
`QuizzesAPI`, `AIApi`, `AnalyticsAPI`) attaches to every request.

Tested directly: valid login, wrong password and nonexistent email both
return the *identical* generic error (no email enumeration), valid/missing/
tampered/forged/expired tokens all handled correctly.

## Authorization — applied to all six API files

Every action in `calendar.php`, `lms.php`, `assignments.php`, `quizzes.php`,
`ai.php`, and `analytics.php` now requires a valid token. Two levels of
enforcement:

- **Own-record only** for student-facing actions — a student's JWT can only
  ever touch their own progress, submissions, attempts, and conversations.
  Admin can access any student's records; teachers cannot (no teacher-facing
  per-student view exists yet, so there was nothing to conditionally allow).
- **Role-gated** for teacher/admin actions — course/quiz/assignment
  authoring requires `teacher` or `admin`; calendar mutations and LMS-wide
  stats require `admin` specifically.

**Directly tested the exact attack scenarios spec §33 asks for**, not just
described them: a student's token trying to read another student's
analytics — blocked (403). The same attack against quiz attempts — blocked.
A student token attempting a teacher-only action (`create_quiz`) — blocked.
A teacher token attempting an admin-only calendar mutation — blocked.
Unauthenticated calls to every file — blocked (401). Then confirmed the
*positive* case still works: a full authenticated teacher-creates-quiz →
student-takes-quiz round trip, correctly graded, nothing broken by adding
all this enforcement.

## Two real security holes found and fixed while doing this

Both were the same class of bug: an action took a record `id` with no
`student_id` parameter to check ownership against, and had no ownership
check at all — meaning **any** authenticated user could look up **any**
record by guessing or incrementing its ID.

- `get_attempt_result` (quizzes.php) — fixed by requiring `student_id` and
  verifying the attempt actually belongs to them.
- `get_tutor_conversation` (ai.php) — fixed by looking up who the
  conversation actually belongs to before returning anything.

Neither was caught by reading the code — both surfaced from deliberately
trying to test the "can I access something that isn't mine" scenario
directly, which is exactly why spec §33 asks for that test category
specifically rather than trusting code review alone.

## File Upload Security (§22)

`assignments.php`'s file handling previously accepted any mime type
(silently relabeling unrecognized ones as `.bin`) with no size limit at
all. Now: a strict allow-list (PDF, Word, PNG, JPG — reject everything
else outright), a 10MB cap, and an auto-created `.htaccess` in the uploads
folder disabling script execution as defense-in-depth, even though the
allow-list alone already prevents an executable extension from ever being
written. Tested: valid PDF accepted, a disallowed mime type rejected, an
11MB payload rejected.

## AI Cost Control (§23)

`AI_DAILY_LIMIT` (defaulting to 50) is now enforced on every
Gemini-calling action — the student tutor, both teacher-assistant
generators, and the analytics AI summary — counted from real logged usage
(`learning_activities`/`ai_conversations`) rather than a separate counter
that could drift out of sync with what actually happened. Tested directly:
seeded a student to the limit and confirmed the next request is correctly
rejected with 429, reading the limit from the environment variable as
spec's example shows (`AI_DAILY_LIMIT=`).

## Mobile layout

Found and fixed three form rows (assignment creation, quiz creation, and
the manual question-add form) that used fixed-pixel-width inputs in an
unwrapped flex row — these would overflow horizontally on a narrow phone
screen instead of wrapping to a second line. Added `flexWrap: "wrap"` to
each. Checked the broader mobile foundation first rather than guessing:
the sidebar already has a working hamburger toggle, `.table-wrapper`
already has `overflow-x: auto` for wide tables, and every modal added in
Phases 5-10 already uses a `width: "90%"` + `maxWidth` pattern that scales
correctly — so this was a targeted fix to three specific rows, not a
guess-and-hope pass across the whole app.

## Testing summary against spec §33's categories

| Category | Status |
|---|---|
| Authentication (student/teacher/admin login) | Tested directly |
| Security (student↔student, unauthorized actions, unauthenticated calls) | Tested directly, both attack and legitimate paths |
| LMS (course creation, enrollment, lesson access, assignment submission, quiz attempts, grading) | Tested in Phases 4-8, re-verified end-to-end under the new auth layer |
| Calendar (import, validation, duplicate detection, current-term detection) | Tested in Phase 2 |
| AI (Gemini connection, rate limits, invalid requests) | Rate limits and request handling tested directly; the live Gemini connection itself remains untested — network egress to `generativelanguage.googleapis.com` is blocked from this sandbox (see Phase 9) |

## Not done in this phase (honestly)

- **No per-resource teacher ownership checks** — a teacher can currently
  edit any teacher's course/quiz, not just their own. Role-level
  enforcement exists; resource-level doesn't yet. This is the most
  important remaining gap, and the pattern to close it (look up the
  resource's `teacher_id`, compare against the authenticated user, matching
  exactly how `requireOwnStudent` already works) is proven and mechanical
  to extend — just not done for every action yet.
- **XSS**: not separately hardened this phase — React's default JSX
  escaping covers most of the surface already (nothing in this project uses
  `dangerouslySetInnerHTML`), but wasn't audited line-by-line.
- **CSRF**: the move to header-based bearer tokens (rather than cookies)
  substantially reduces this risk by design — CSRF specifically exploits
  ambient cookie auth, which this doesn't use for the LMS endpoints — but
  no explicit CSRF token mechanism was added on top of that.
- **SQL injection**: not newly addressed because it didn't need to be —
  every query across every phase of this project has used parameterized
  PDO statements from the start.

## Next step

Phase 12 per the spec: **Deployment** — the final phase.
