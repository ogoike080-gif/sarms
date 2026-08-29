# Phase 10 — AI-Based Performance Analysis & Personalized Learning

Also included in this delivery: three small feature additions requested
alongside this phase (class streams, form teacher assignment, school motto)
— see the bottom of this document.

## What this phase delivers

`api/analytics.php` — the engine behind spec §14 (performance analysis) and
§15 (recommendations) — plus a new "Performance Insight" section replacing
the "Recommended Topics" placeholder on the student dashboard.

## The one rule that mattered most here

Spec §14 is explicit: **"Do not allow AI to invent performance data. All
performance statistics must originate from actual database records."**

Every number this phase produces — strong/weak subjects, weak topics,
improving/declining trends, incomplete lessons, failed quizzes, and every
recommendation — is computed by plain SQL and PHP. Gemini is never involved
in producing any of them. The only place AI touches this feature at all is
`get_ai_summary`, an entirely optional endpoint that takes the
already-computed real data and asks Gemini only to phrase it as a short
paragraph, with an explicit instruction not to add any fact not present in
that data. Every other part of the Performance Insight section works
completely without it, and without Gemini configured at all.

## What was actually tested — with known ground truth, not just "did it run"

Built a deliberately specific dataset (2 subjects, 2 quizzes on different
topics, one lesson completed and one not, scores pushed to known values) and
verified every output against hand-calculated expected values:

- **Subject classification**: Mathematics (scores only, 35%) correctly
  "weak"; Computer Science (77% from scores, then recalculated as 50% from
  two quiz attempts averaging 100% and 0%) correctly landed at the exact
  combined average (63.5%) and correct "average" classification.
- **Weak/strong topics**: "IP Addressing" (0/3 correct) correctly flagged
  weak; "Networking" (2/2 correct) correctly flagged strong — using each
  quiz question's own `topic` field, not guessed from titles.
- **Frequently incorrect concepts**: correctly ranked IP Addressing by its
  raw incorrect count.
- **Improving/declining trends**: correctly returned empty when there
  wasn't enough data (fewer than 4 quiz attempts in a subject) rather than
  drawing a conclusion from noise — this was a deliberate design choice,
  confirmed working as intended.
- **Incomplete lessons**: correctly listed the one lesson never marked
  complete, correctly excluded the one that was.
- **Failed quizzes**: correctly listed the 0%-scoring quiz, correctly
  excluded the 100%-scoring one, correctly reported attempts remaining.
- **Recommendations**: confirmed the "no fabrication" property directly —
  when Mathematics was weak but had zero courses/lessons/quizzes created
  for it, the engine correctly produced *no* lesson or quiz recommendation
  for it (only the generic "ask AI Tutor" one), rather than inventing
  something. Then, with Computer Science made weak and given real content,
  confirmed the engine correctly recommended the exact real incomplete
  lesson and the exact real not-yet-passed quiz — matching spec §14's
  worked example precisely. Also confirmed a failed quiz with attempts
  remaining correctly produces a "retake" recommendation.
- **AI summary error path**: confirmed a clean, actionable error (not a
  crash) when no Gemini key is configured — consistent with Phase 9.

## A real schema gap found and fixed

`quiz_questions` had no `topic` column — only `question_bank` did — so
directly-authored quiz questions (not pulled from the bank) had no way to
record a topic at all, which would have made "Weak Topics" silently blind
to most real questions. Added the column (`sql/004_quiz_question_topic.sql`
for existing installs, plus a defensive auto-check in `quizzes.php` so it
self-heals even if that file is never run manually — same pattern as every
other schema addition in this project). Wired `topic` through
`create_question`, `add_question_from_bank`, and the teacher's question
form, plus the AI-generated MCQ flow, so topic data actually gets recorded
going forward regardless of which path a question comes from.

## Three additional features included in this delivery

Requested alongside this phase, implemented in the existing (pre-LMS,
still blob-based) Classes, Subjects, and Institution management screens —
no new backend needed, these use the same `updateState()` mechanism
everything else in that part of the app already uses.

- **Class streams** — a new "Add Streams" button next to "Add Class" lets
  an admin type a prefix (e.g. "JS1") and a stream range (e.g. "A-E", or a
  comma list like "A,B,C") to bulk-create every class in one action instead
  of adding them one at a time. Verified the parser handles the range
  syntax, spaced variants, comma lists, mixed case, and safely rejects a
  backwards range instead of erroring.
- **Form teacher assignment** — each class row now has an "Assign Form
  Teacher" button opening a small modal with a dropdown of every teacher;
  the assignment is stored on the class record.
- **School motto** — a new field in Institution Settings, now also
  displayed under the school name on the login page (a stored-but-invisible
  field wouldn't have been very useful, so it's actually surfaced
  somewhere).

## Not done in this phase (intentionally)

- No teacher- or class-level aggregate analytics (e.g. "which topics trip
  up my whole class") — spec §14/§15 are framed from the student's
  perspective; a class-level rollup would be a reasonable future extension
  built on the same real-data-only principle, not a requirement of this
  phase's literal text.
- Still no server-side auth enforcement — same tracked position since
  Phase 2.

## Next step

Phase 11 per the spec: **Testing and security hardening** — the phase where
the auth gap tracked since Phase 2 finally gets addressed, along with
broader security review across everything built so far.
