# GATEPrep Pro Architecture Context

This file is a fast context pack for AI agents and future contributors. Read this before changing the app.

## AI Context Index

For future AI agents:

- `AGENTS.md`: repository-level instructions and fast-context search rule.
- `frontend/AI_CONTEXT.md`: compact active-frontend map with routes, commands, data rules, and editing guidance.
- `frontend/README.md`: short setup.
- `frontend/DEPLOY.md`: Vercel deployment details.
- `frontend/prisma/schema.prisma`: canonical active schema.

When semantic search is available, query the repo with `mcp__fast-context__fast_context_search` and exclude `node_modules`, `.next`, `.git`, `dist`, `build`, and `coverage`. If the tool lacks a Windsurf API key, fall back to `rg` plus the files above.

## App Identity

GATEPrep Pro is a GATE Electrical Engineering preparation platform. It includes dashboard analytics, study planning, tasks, notes with PDFs, flashcards, lectures, PYQ uploads, cutoff prediction, sample tests, and AI coaching.

There are two Next.js app trees in this repository:

- `frontend/` is the active Vercel-ready app. It uses Next.js 16, React 19, Prisma/Postgres, NextAuth, Tailwind 4, shadcn/Radix UI, Supabase Storage fallback, and AI calls through Groq/Gemini/Anthropic.
- Root `src/` is an older/smaller Next.js app using Next 14 and Anthropic-first docs in the root `README.md`. Treat it as legacy unless the user explicitly asks to work on the root app.

Most work should happen inside `frontend/`.

## Primary Commands

Run these from `frontend/`:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
npm run build
npm run db:migrate
npm run db:seed
```

Local dev URL: `http://localhost:3000` unless Next chooses another port because 3000 is occupied.

Vercel should import the repository with Root Directory set to `frontend`.

## Key Environment Variables

Required for full production behavior:

- `DATABASE_URL`: PostgreSQL connection used by Prisma.
- `NEXTAUTH_SECRET`: NextAuth signing secret.
- `NEXTAUTH_URL`: production URL.

Optional but important:

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: enables Google login in addition to credentials auth.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`: enables the `/admin` review panel. Store a bcrypt hash only; escape `$` as `\$` in Next.js `.env` files.
- `GROQ_API_KEY`: primary AI provider.
- `GEMINI_API_KEY`: fallback AI provider.
- `ANTHROPIC_API_KEY`: final AI fallback if it starts with `sk-ant`.
- `GROQ_MODEL`, `GEMINI_MODEL`, `ANTHROPIC_MODEL`: override model names.
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: enables Supabase Storage for PDFs.
- `LOCAL_UPLOAD_DIR`: local PDF upload directory when Supabase Storage is not configured. Defaults to `frontend/.local-uploads` at runtime.

## High-Level Structure

```text
frontend/
  app/
    layout.tsx                  Root HTML, providers, Vercel Analytics
    login/page.tsx              Sign-in UI
    (main)/layout.tsx           Main authenticated app shell with sidebar
    (main)/page.tsx             Dashboard
    (main)/study-plan/page.tsx  Timetable and AI planning
    (main)/todos/page.tsx       Task manager and AI task suggestions
    (main)/notes/page.tsx       TipTap notes, AI note tools, note PDFs
    (main)/flashcards/page.tsx  Flashcard review UI
    (main)/lectures/page.tsx    Lecture library and progress tracking
    (main)/pyq/page.tsx         Previous-year paper PDF upload/view
    (main)/cutoffs/page.tsx     GATE EE cutoffs and advisor
    (main)/games/page.tsx       Mind-refresh games surface
    (main)/test/page.tsx        Saved tests, PDF question import, answer-key binding
    (main)/admin/page.tsx       Admin-ish content overview/upload surface
    api/                        Route handlers, mostly Prisma-backed JSON APIs
  components/
    AppProviders.tsx            SessionProvider, ThemeProvider, Sonner toaster
    SidebarNav.tsx              Main desktop/mobile navigation and countdown
    AIInsightCard.tsx           Dashboard AI insight client component
    ui/                         shadcn/Radix component library
  lib/
    prisma.ts                   Singleton Prisma client
    auth.ts                     NextAuth options
    session.ts                  Session lookup plus single-user fallback
    ai.ts                       Groq -> Gemini -> Anthropic AI provider fallback
    gate-ee.ts                  Canonical GATE EE subject taxonomy/constants
    subject-resolve.ts          Subject title/slug/fuzzy resolver
    local-upload-storage.ts     Local PDF storage helpers
    supabase-admin.ts           Server-only Supabase Storage helpers
    sm2.ts                      Simplified SM-2 flashcard scheduler
    streak*.ts                  Streak ledger and active-day aggregation
  prisma/
    schema.prisma               Canonical active DB schema
    seed.ts                     Seeds GATE EE subjects and sample test pack
```

## Authentication Model

Auth is configured in `frontend/lib/auth.ts`.

- NextAuth uses the Prisma adapter.
- Sessions use JWT strategy.
- Credentials login is always enabled.
- Google login is added only when Google OAuth env vars exist.
- Sign-in page is `/login`.
- The configured admin account is verified with `ADMIN_EMAIL` and bcrypt `ADMIN_PASSWORD_HASH`, upserted as `role = ADMIN`, and marked approved on successful credentials login.
- Regular registered users default to `approved = false`; migration `20260610000100_add_user_approval` marks pre-existing users approved.
- Storage-heavy upload routes use `requireApprovedForStorage()` so pending users cannot upload PDFs/workbooks before admin approval.

Important behavior: `frontend/lib/session.ts` has a single-user fallback. If no authenticated session exists, APIs upsert and use a default user:

- email: `nem@gate-ee.local`
- name: `Nem`
- branch/stream: `EE` / `GATE-EE`
- gate date: `2027-02-05`

This keeps the app usable without sign-in walls. Do not assume all API access is truly anonymous; most routes still call `getSessionUserId()`.

## Data Model

The active schema is `frontend/prisma/schema.prisma`. Major models:

- `User`, `Account`, `Session`: auth and user profile.
- `Subject`: canonical seeded GATE EE subjects.
- `UserWeakSubject`: prioritized weak areas per user.
- `StreakDay`, `StudySessionLog`: activity/streak tracking.
- `StudyPlan`, `TimetableSlot`: AI/manual timetable plans.
- `Task`: todo list with priority, due date, subject/topic.
- `Note`, `NotePdf`, `NoteAnnotation`, `PdfReadingProgress`: notes and PDF reading state.
- `Flashcard`, `FlashcardReview`: spaced repetition.
- `Lecture`, `LectureWatch`: video/library progress.
- `PyqPaper`: previous-year paper PDFs by year and subject.
- `GateEeCutoff`: historical/predicted cutoff data.
- `TopicPerformance`: aggregated subject-level correctness.
- `TestPack`, `Question`, `TestAttempt`, `TestPaperUpload`: tests, seeded drills, PDF imports, answer-key uploads.
- `AISuggestion`: persisted AI output history when a user id exists.

Seed data lives in `frontend/prisma/seed.ts`. It seeds the GATE EE subject catalog and a sample mixed fundamentals test pack with slug `gate-ee-sample-drill`.

## Canonical GATE EE Domain

`frontend/lib/gate-ee.ts` is the canonical domain file. It defines:

- `GATE_EE_SUBJECTS`
- `GATE_EXAM_DATE_ISO`
- `PLATFORM_DISPLAY_NAME`
- `SUBJECT_COLORS`
- `isGateEESubject()`

When accepting free-text subject input, use `resolveSubject()` from `frontend/lib/subject-resolve.ts`; it resolves by title, slug, canonical list, and fuzzy contains match, then falls back to the first seeded subject.

## API Route Map

Dashboard and profile:

- `GET /api/dashboard`: aggregates study hours, streaks, tasks, notes, lectures, flashcards, test scores, weak topics, subject progress, and todo preview.
- `GET /api/user/me`: current profile, exam date, weak subjects, stream label.
- `POST /api/study-session`: logs study minutes and touches streak ledger.

Tasks:

- `GET /api/tasks`: list user tasks with subject labels.
- `POST /api/tasks`: create task; resolves subject from `subjectId`, `subjectTag`, or `subject`.
- `PATCH /api/tasks/[id]`: update task and touch streak when newly completed.
- `DELETE /api/tasks/[id]`: delete user-owned task.

Study plan/timetable:

- `GET /api/timetable`: list slots by weekday/time.
- `POST /api/timetable`: create a manual slot.
- `PATCH /api/timetable/slots/[id]`: edit slot and touch streak when completed.
- `DELETE /api/timetable/slots/[id]`: delete slot.
- `POST /api/timetable/apply`: creates a `StudyPlan`, deletes existing user slots, and replaces them with normalized AI/manual slots.

Notes and PDFs:

- `GET /api/notes`: list notes, optional `q` and `subject` filters, includes subject catalog.
- `POST /api/notes`: create note.
- `GET /api/notes/[id]`: fetch note with attached PDFs.
- `PATCH /api/notes/[id]`: update note fields and reading page.
- `DELETE /api/notes/[id]`: delete note.
- `POST /api/notes/[id]/pdf`: upload a note PDF to Supabase Storage if configured, otherwise local storage.
- `GET /api/notes/pdf/[pdfId]/signed-url`: returns Supabase signed URL or local file API URL.
- `GET /api/notes/pdf/[pdfId]/file`: streams locally stored note PDF.
- `POST /api/notes/pdf/[pdfId]/annotations`: upsert page annotations.
- `PATCH /api/notes/pdf/[pdfId]/progress`: save reading progress.

Flashcards:

- `GET /api/flashcards`: list cards; `?due=1` returns due unmastered cards.
- `POST /api/flashcards`: create manual/generated card.
- `POST /api/flashcards/[id]/review`: grades 0-3, applies simplified SM-2 scheduling, writes review, touches streak.

Lectures:

- `GET /api/lectures`: list lectures with per-user watch state.
- `POST /api/lectures`: create lecture and initial watch row.
- `DELETE /api/lectures/[id]`: delete lecture.
- `PATCH /api/lectures/[id]/progress`: update watched percent/position; completes at >=95 percent and touches streak.
- `frontend/app/(main)/lectures/page.tsx` embeds YouTube through the iframe API. Keep the player inside the `playerHostRef` wrapper and let YouTube own only the imperatively-created child node; this avoids React/YouTube DOM ownership crashes such as `removeChild` when switching or unmounting videos. Progress sync must guard `getDuration`/`getCurrentTime` because the iframe API can briefly expose a not-ready player object.

PYQ:

- `GET /api/pyq`: list uploaded PYQ paper rows.
- `POST /api/pyq`: upload question/solution/key PDF for a year+subject. Upserts the paper row.
- `GET /api/pyq/[id]/signed-url?which=question|solution|key`: returns a view URL for Supabase or local storage.
- `GET /api/pyq/[id]/file?which=...`: streams locally stored PYQ PDF.

Tests:

- `GET /api/test/sample`: loads seeded sample pack without correct answers.
- `GET /api/test`: lists user-created saved tests and answer-key readiness.
- `POST /api/test/submit`: scores answers, records `TestAttempt`, updates `TopicPerformance`, returns comparisons, touches streak.
- `POST /api/test/upload-pdf`: parses text-based question PDFs into `TestPack`/`Question` rows, and parses answer-key PDFs to bind correct options to a saved test. Scanned/image PDFs still need OCR before import.

Cutoffs:

- `GET /api/cutoffs`: returns historical cutoff rows and a simple 2027 GEN qualifying prediction.
- `POST /api/cutoffs`: upserts cutoff row by year/category.

Admin:

- `POST /api/admin/questions/upload`: admin question upload route.

AI:

- Shared helper: `frontend/app/api/ai/_shared.ts`.
- Provider helper: `frontend/lib/ai.ts`.
- `POST /api/ai/study-plan`: returns normalized JSON preview slots for a weekly GATE EE timetable.
- `POST /api/ai/reschedule`: returns normalized JSON preview slots from missed/backlog context.
- `POST /api/ai/task-suggestions`: 5 actionable GATE EE tasks.
- `POST /api/ai/dashboard-insight`: short dashboard coaching paragraph.
- `POST /api/ai/summarize-note`: bullet summary.
- `POST /api/ai/explain-concept`: simple GATE-focused explanation.
- `POST /api/ai/generate-quiz`: 5 MCQs from note text.
- `POST /api/ai/generate-flashcards`: JSON flashcard array from note text.
- `POST /api/ai/predict-hot-topics`: hot-topic prediction from frequencies.
- `POST /api/ai/lecture-recommendation`: recommended next lecture topics.
- `POST /api/ai/college-advisor`: college/program suggestions from rank/branch/category.

AI responses are persisted to `AISuggestion` when a user id exists. If no AI key works, routes return a clear unavailable message.

## Storage Model

PDF upload routes prefer Supabase Storage when both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present.

If Supabase is not configured, uploads are written locally using `frontend/lib/local-upload-storage.ts`:

- storage paths are stored as `local://...`
- actual files live under `LOCAL_UPLOAD_DIR` or `frontend/.local-uploads`
- file-serving routes validate path traversal before reading bytes

Buckets assumed by code:

- `notes`
- `pyq`

## Frontend Conventions

- Routes under `frontend/app/(main)` are client-heavy pages.
- `frontend/app/(main)/layout.tsx` wraps the main UI with `SidebarNav`.
- `frontend/components/AppProviders.tsx` provides NextAuth session, theme, and Sonner toasts.
- `frontend/components/ui` is shadcn/Radix generated component code. Avoid broad edits there unless changing shared UI intentionally.
- Icons use `lucide-react`.
- Animations commonly use `framer-motion`.
- Charts use `recharts`.
- Notes use TipTap.

## Important Behavioral Notes

- The dashboard computes weak topics from four signals: test attempts, open tasks, difficult flashcard reviews, and aggregated `TopicPerformance`.
- Streaks are based on `StreakDay` plus legacy activity sources. Completing tasks/slots, reviewing flashcards, lecture completion, tests, and study sessions can touch the streak ledger.
- `next.config.mjs` currently ignores TypeScript build errors. Do not rely on that as proof of correctness; run focused checks when changing types.
- `frontend/DEPLOY.md` says Vercel root directory must be `frontend`.
- `frontend/app/api/test/upload-pdf/route.ts` creates saved tests from text-based MCQ PDFs. It supports common question formats like `1. ...` plus `A.` to `D.` options and answer keys like `1 A`; scanned PDFs require OCR.
- Root-level `.env.example`, `package.json`, `src/`, and `prisma/` exist for the older app. For production deployment, prefer `frontend/`.

## Safe Change Guidelines

- For backend changes, start with `frontend/prisma/schema.prisma`, route handlers in `frontend/app/api`, and related client pages in `frontend/app/(main)`.
- For subject-aware features, use `GATE_EE_SUBJECTS` and `resolveSubject()` instead of hardcoding ad hoc subject strings.
- For new user-scoped APIs, call `getSessionUserId()` and filter all DB reads/writes by `userId`.
- For PDF URLs, do not expose raw storage paths directly; return signed URLs or local file API URLs.
- For AI timetable generation, keep prompts constrained to exact GATE EE subjects and parse through `parse-ai-plan.ts`.
- For flashcard scheduling, use `scheduleFlashcard()` instead of duplicating SM-2 logic.
- Keep changes scoped. This repository currently has unrelated modified/deleted files in git status; do not revert user work unless explicitly asked.
