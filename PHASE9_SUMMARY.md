# Phase 9 — Gemini AI Integration

## What this phase delivers

`api/ai.php` plus frontend wiring — the AI Tutor placeholder that's sat in
the student dashboard since Phase 5, and a brand-new AI Assistant panel for
teachers, are now real.

### Student AI Tutor (spec §10, §11)

A chat modal, reachable from "Ask AI Tutor" on the student dashboard. The
system prompt encodes §11's tutoring behavior explicitly — hint, then
explanation, then guided solution, then final answer, never skipping
straight to the answer for homework-style questions. Conversations persist
(`ai_conversations`/`ai_messages`) and resume correctly across messages.

### Teacher AI Assistant (spec §13)

A new "AI Assistant" tab alongside Assignments/Quizzes in the teacher's
course view. Two generators:

- **MCQ generator** — returns a structured, fully editable draft (question
  text, all four options, correct answer, explanation) with checkboxes.
  Nothing is saved until the teacher selects questions and explicitly adds
  them — either to the reusable question bank or directly into whichever
  quiz they have open — both routed through the existing Phase 8
  `create_bank_question`/`create_question` endpoints, not a new save path.
- **Freeform content generator** — lesson plans, class activities,
  assignments, revision questions, marking guides, explanations, summaries.
  Returned in a plain read-only textarea for the teacher to copy and adapt,
  never auto-inserted anywhere.

This split matters: §13 requires teachers to review and edit AI output
*before* it's used anywhere. Routing saves through the same endpoints a
human teacher would use manually — rather than giving the AI a separate,
more-trusted save path — is what actually enforces that, not just a UI
label saying "draft."

### Context sent to Gemini (spec §12)

Deliberately minimal, and built server-side from real DB rows, never from
whatever the frontend sends: class, subject, term, current lesson, learning
level, and the question/task itself. Never the student's name, email, or
anything else from their account — `callGemini()` only ever receives what
the context-builder explicitly assembles.

## A real, honest limitation of this phase

**The live Gemini API call itself is untested** — `generativelanguage.
googleapis.com` is blocked at this sandbox's network egress level (confirmed
directly: a request to it returns "Host not in allowlist," not a timeout or
a generic failure). Every previous phase in this project was tested against
a real, running service (MariaDB); this is the first one where that wasn't
possible for the core integration point.

What *was* tested, thoroughly, using a temporarily-stubbed copy of the file
(the stub was never part of any delivered file — confirmed by grepping the
final `api/ai.php` for stub markers and finding none, and confirming the
real `generativelanguage.googleapis.com` call is intact):

- Context building — confirmed it pulls real class/subject/term/topic from
  the database via `course_id`/`lesson_id`, not from arbitrary text the
  client could send.
- Conversation persistence and threading — a new conversation gets created
  correctly, a follow-up message correctly receives the prior message as
  history, and `list_tutor_conversations`/`get_tutor_conversation` return
  the right data.
- `learning_activities` logging — confirmed a row is written on every tutor
  message, which is what will make Phase 7's "AI Tutor Usage" stat (always
  0 until now) start reflecting real numbers.
- MCQ JSON parsing, including the fence-repair path — tested with a stub
  that deliberately wraps its response in ` ```json ` fences (a real,
  common Gemini quirk despite prompt instructions) and confirmed the parser
  still recovers it correctly.
- The no-API-key path — confirmed it returns a clear, actionable setup
  error rather than crashing.

**A real bug was caught in this process**: `mb_substr()` isn't available in
this test environment (the `mbstring` PHP extension isn't installed) — it
crashed conversation creation entirely before the fix. Rather than assume
XAMPP always has it (it usually does, but "usually" isn't "always"), added
a `safeTruncate()` helper that falls back to plain `substr()` if `mbstring`
isn't present, so the app degrades gracefully instead of fatal-erroring on
a missing optional extension.

**You'll need to verify the actual Gemini round-trip yourself** — see the
new "Gemini setup" section in `BUILD_AND_INSTALL.md` for getting a free API
key and configuring it. Once that's done, the fastest check is: log in as a
student, open "My Learning," click "Ask AI Tutor," send a message.

## Not done in this phase (intentionally)

- No real AI-based performance analytics or personalized recommendations —
  that's explicitly Phase 10 (§14/§15). The "Recommended Topics" card still
  reads "coming soon."
- Still no server-side auth enforcement — same tracked position since
  Phase 2.

## Next step

Phase 10 per the spec: **AI-based student performance analysis and
personalized learning recommendations** — this is what finally makes
"Recommended Topics" and the "Students Needing Support" heuristic from
Phase 7 into the real thing the spec describes.
