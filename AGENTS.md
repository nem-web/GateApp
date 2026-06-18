# AI Agent Context

This repository contains two Next.js apps. The active website is in `frontend/`; the root-level `src/` app is legacy context unless the user explicitly asks for it.

## Fast Context Rule

For exploratory code understanding, natural-language code lookup, or architecture mapping, prefer `mcp__fast-context__fast_context_search` when available. Exclude noisy folders such as `node_modules`, `.next`, `.git`, `dist`, `build`, and `coverage`.

If fast-context is unavailable because the Windsurf key is missing, use local search with `rg` and read the focused files listed below.

## Read First

1. `ARCHITECTURE.md` - full repository and active app map.
2. `frontend/AI_CONTEXT.md` - compact frontend-specific context pack.
3. `frontend/README.md` - quick local setup.
4. `frontend/DEPLOY.md` - Vercel deployment notes.
5. `frontend/prisma/schema.prisma` - canonical active database schema.

## Work In The Active App

- Run commands from `frontend/`.
- Start locally with `npm run dev`.
- Main app routes live in `frontend/app/(main)`.
- API route handlers live in `frontend/app/api`.
- Shared domain/server helpers live in `frontend/lib`.
- Shared UI components live in `frontend/components`.

## Safety Notes

- Do not treat root `src/` as production unless requested.
- Do not edit generated or dependency folders such as `.next`, `node_modules`, or `tsconfig.tsbuildinfo`.
- Keep user-scoped database work filtered by `userId` from `frontend/lib/session.ts`.
- Use `frontend/lib/gate-ee.ts` and `frontend/lib/subject-resolve.ts` for GATE EE subject names instead of ad hoc strings.
