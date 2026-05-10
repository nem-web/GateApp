# GATEPrep Pro

Full-stack GATE exam prep web app using Next.js, Tailwind, Prisma/PostgreSQL, NextAuth, Claude API, Recharts, dnd-kit, TipTap, and PDF/YouTube integration points.

## Setup

1. Install dependencies:
   - `npm install`
2. Configure env:
   - `cp .env.example .env`
3. Generate Prisma client and migrate:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
4. Run app:
   - `npm run dev`

## Included Modules

- Dashboard with stats, progress grid, AI insight, trend chart, tasks, quick actions
- Study Plan + timetable with drag/drop and Pomodoro widget
- To-Do list with priority and AI suggestions
- Notes (TipTap), AI summarize/explain/quiz, flashcards UI and generation
- Lectures page with YouTube embed, progress, AI recommendations
- PYQ page with PDF viewer slot, chart heatmap, AI hot-topic prediction
- Cutoffs/college section with predictors and AI advisor
- Test section scaffold + question upload stub
- Mind refresh games page (math/memory/breathing/2048 slot/quotes)

## AI Behavior

If `ANTHROPIC_API_KEY` is missing, all AI endpoints return an "AI unavailable" response and UI handles it gracefully.
