# GATEPrep Pro (frontend)

Next.js app ready for **Vercel** with Postgres (Prisma), NextAuth, and **free-tier AI** (Groq + Gemini).

## Quick start

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Free AI keys

1. **Groq** (primary): [console.groq.com/keys](https://console.groq.com/keys) → set `GROQ_API_KEY`.
2. **Google Gemini** (fallback): [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → set `GEMINI_API_KEY`.

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Vercel root directory, env vars, and migrations.
