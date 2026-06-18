# Frontend AI Context

This is the active GATEPrep Pro website. Use this file as the quick orientation layer before editing.

## Identity

GATEPrep Pro is a GATE Electrical Engineering study platform with dashboard analytics, study planning, tasks, notes/PDFs, flashcards, lecture progress, PYQ uploads, cutoff prediction, tests, games, and AI coaching.

## Runtime

- Framework: Next.js 16 App Router with React 19.
- Styling: Tailwind CSS 4 plus shadcn/Radix components in `components/ui`.
- Database: Prisma 5 with PostgreSQL, schema in `prisma/schema.prisma`.
- Auth: NextAuth 4 with credentials login and optional Google OAuth.
- Admin: `/admin` is a server-rendered review panel for the configured admin account.
- AI: `lib/ai.ts` tries Groq, then Gemini, then Anthropic-compatible fallback.
- Storage: Supabase Storage when configured; otherwise local uploads in `.local-uploads`.

## Local Commands

```bash
cd frontend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

Use `npm run build` for production validation. The build runs `prisma generate` first.

## Core Files

- `app/layout.tsx`: root HTML, providers, metadata, analytics.
- `app/(main)/layout.tsx`: authenticated app frame and sidebar layout.
- `components/SidebarNav.tsx`: desktop/mobile navigation, theme toggle, auth actions, GATE countdown.
- `components/AppProviders.tsx`: NextAuth `SessionProvider`, theme provider, Sonner toaster, service worker registration.
- `app/(main)/page.tsx`: dashboard client page.
- `app/api/dashboard/route.ts`: dashboard aggregation from Prisma and streak helpers.
- `lib/session.ts`: returns authenticated user id or creates/uses the single-user fallback.
- `lib/auth.ts`: NextAuth adapter, credentials provider, optional Google provider.
- `lib/admin-config.ts`: configured admin email/hash verification and admin user upsert.
- `lib/admin-access.ts`: admin access lookup plus storage-upload approval guard.
- `lib/prisma.ts`: Prisma singleton.
- `lib/gate-ee.ts`: canonical GATE EE subjects, colors, exam date, weightage constants.
- `lib/subject-resolve.ts`: subject resolver for user/API input.
- `lib/local-upload-storage.ts`: local PDF storage helpers.
- `lib/supabase-admin.ts`: server-only Supabase Storage helpers.
- `lib/sm2.ts`: flashcard scheduling.

## Route Map

Main pages under `app/(main)`:

- `/`: dashboard.
- `/study-plan`: timetable, AI plan preview/apply, manual slots.
- `/todos`: task list and AI suggestions.
- `/notes`: TipTap notes, AI summarize/explain/quiz/flashcard tools, PDF reading state.
- `/flashcards`: due card review with simplified SM-2 scheduling.
- `/lectures`: YouTube lecture library and watch progress.
- `/pyq`: previous-year paper upload/viewing.
- `/cutoffs`: GATE EE cutoff table and advisor.
- `/games`: mind-refresh games and user HTML games.
- `/test`: seeded/sample tests, saved tests, PDF question import, answer key binding.
- `/other`: miscellaneous file/link tools.
- `/admin`: content upload/overview surface; sidebar intentionally hides here.

Authentication pages:

- `/login`: credentials login, account creation path through `/api/auth/register`.

API groups under `app/api`:

- `dashboard`, `user/me`, `study-session`
- `tasks`, `timetable`
- `notes`, `flashcards`, `lectures`, `pyq`, `test`, `cutoffs`, `games`, `other`
- `ai/*`: study plan, reschedule, task suggestions, dashboard insight, note tools, hot topics, lecture recommendation, college advisor
- `auth/[...nextauth]`, `auth/register`

## Data Rules

- Active schema is `prisma/schema.prisma`; root-level Prisma files are legacy.
- `User.role`, `User.approved`, and `User.approvedAt` drive admin access and upload approval.
- Most API routes call `getSessionUserId()` and then scope reads/writes by `userId`.
- In no-login mode, `getSessionUserId()` upserts default user `nem@gate-ee.local` so the app remains usable.
- Existing users were approved by migration `20260610000100_add_user_approval`; newly registered users default to pending approval.
- Pending users can sign in and use normal study data, but storage-heavy upload routes call `requireApprovedForStorage()`.
- Subject-aware writes should resolve subjects via `resolveSubject()` or canonical constants.
- Activity that should affect streaks should touch the streak helpers in `lib/streak-touch.ts`.

## Environment

Minimum useful local env:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/gateprep?sslmode=require"
NEXTAUTH_SECRET="replace-with-a-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Optional:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GROQ_API_KEY=""
GEMINI_API_KEY=""
ANTHROPIC_API_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
LOCAL_UPLOAD_DIR=""
```

When storing bcrypt hashes in `.env`, escape `$` as `\$` so Next.js dotenv expansion keeps the hash intact.

## Editing Guidance

- Prefer existing page patterns in `app/(main)` and existing components before adding new abstractions.
- Avoid broad edits in `components/ui` unless intentionally changing the shared design system.
- Do not expose raw PDF storage paths to clients; return signed URLs or local API file URLs.
- For YouTube lecture work, keep the iframe API isolated inside the existing player host wrapper to avoid React/YouTube DOM ownership crashes.
- For AI JSON outputs, parse/normalize through the relevant helper such as `lib/parse-ai-plan.ts` before persisting.
