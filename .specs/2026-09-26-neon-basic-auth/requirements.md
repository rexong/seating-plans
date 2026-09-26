# Phase 1 — Neon + Basic Auth

## Context

Phase 0 left a runnable Next.js placeholder (`pnpm dev` shows Seat Planning). The operator has already created the Neon database. This phase is the first lock on the door and the first proof that the app can reach Postgres.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 1.

## Scope

In:

- HTTP Basic Auth for the single operator, using `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD`.
- Gate **all app routes** (pages and any Route Handlers). Unauthenticated requests get **401** and a `WWW-Authenticate` challenge.
- Drizzle + `@neondatabase/serverless` against `DATABASE_URL`.
- First checked-in Drizzle migration that is **empty** (no product tables). Events wait for Phase 2.
- Authenticated `/` shows whether the app can talk to Neon (success and failure).

Out:

- `events` / guests / tables schema and UI.
- Public unauthenticated ping or health URL.
- Share-without-password, OAuth, NextAuth, Clerk.
- Prisma, Redis, extra auth vendors.

## Decisions (2026-09-26)

| Topic | Choice | Why |
| --- | --- | --- |
| First migration | **Empty only** | Prove wiring without locking a product schema. Phase 2 owns `events`. |
| DB confirmation | **Home page status** | Matches roadmap: authenticated users hit a page that confirms connectivity. No dedicated `/health`. |
| Auth coverage | **All app routes** | One operator; share URLs will still require the same login (tech-stack MVP default). No public ping. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16 deprecates `middleware.ts` in favor of root `proxy.ts` (`nodejs` runtime). Use that file for the Basic Auth gate. Product language is still “middleware on all app routes.”
- Exclude `_next/static`, `_next/image`, and common static assets from the matcher so CSS/JS still load after a 401 or 200.
- Never commit real Neon or Basic Auth secrets. `.env.example` already names the three variables.
- Neon is already created; this phase only connects and migrates.

## Constraints

- Tiny MVP: one user, last write wins later; no concurrency work here.
- Free-tier Neon + later Vercel. Prefer pooled `DATABASE_URL` as Neon documents for serverless.
- TypeScript strict; pnpm.

## Success (product)

Unauthenticated users get 401. With valid Basic Auth, `/` loads and shows that the database is reachable (or an explicit failure if it is not).
