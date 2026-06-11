# Deploy GATEPrep Pro on Vercel

## Project root

Import this repo in Vercel and set **Root Directory** to `frontend` (this Next.js app).

## Environment variables (Production + Preview)

| Variable | Required | Where to get it (free) |
|----------|----------|-------------------------|
| `DATABASE_URL` | Yes for DB features | [Neon](https://neon.tech) (free Postgres), [Supabase](https://supabase.com), or Vercel Postgres |
| `NEXTAUTH_SECRET` | Yes for auth | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your production URL, e.g. `https://your-app.vercel.app` |
| `GROQ_API_KEY` | Recommended (AI) | [Groq Console](https://console.groq.com/keys) — free, fast inference |
| `GEMINI_API_KEY` | Optional fallback | [Google AI Studio](https://aistudio.google.com/apikey) — free Gemini tier |

AI calls try **Groq first**, then **Gemini**. No paid Anthropic key is required.

Optional:

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — enable Google sign-in in `lib/auth.ts`
- `GROQ_MODEL` — default `llama-3.3-70b-versatile`
- `GEMINI_MODEL` — default `gemini-2.0-flash`

## Database migrations

After the first deploy (or from your machine with `DATABASE_URL` set):

```bash
cd frontend
npx prisma migrate deploy
```

If you have no migration history yet:

```bash
npx prisma db push
```

(or create an initial migration locally with `npx prisma migrate dev --name init` and commit `prisma/migrations`.)

## Build

Default Vercel build:

- `npm install` → runs `postinstall` → `prisma generate`
- `buildCommand` in `vercel.json`: `prisma generate && next build`

To run migrations **on every production build** (optional), change `buildCommand` to:

`prisma generate && prisma migrate deploy && next build`

(requires `DATABASE_URL` available at build time)

## Limits

- **PDF uploads**: Vercel Serverless request bodies are limited (~4.5MB on Hobby). Larger PDFs should use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) client uploads (planned in “Create test” Phase 2).

## Other hosts

Same app runs anywhere Node 18+ is supported:

- **Railway / Render / Fly.io**: set env vars, run `npm run build` and `npm start`, run Prisma migrate against your Postgres.
- **Docker**: multi-stage build with `npm ci`, `prisma generate`, `next build`, start with `next start`.
