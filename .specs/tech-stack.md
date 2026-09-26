# Tech stack

Chosen for a **one-person, free-tier MVP**: one deployable app, Postgres on Neon, and the simplest auth that still blocks strangers.

## Application

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js (App Router) + React + TypeScript** | One repo for UI + server routes. Vercel Hobby is free. Server Components and Route Handlers talk to Neon without a separate API service. |
| UI | **Tailwind CSS** | Fast tabular layout; no design system required. |
| Drag and drop | **@dnd-kit** | Keyboard-accessible drag/drop and swap for a desktop grid. |
| Validation | **Zod** | Shared types for guests, tables, seats, and API payloads. |

Vite SPA was considered and rejected: Neon + basic auth still need a server. Next.js is the smaller *system* even if the frontend is slightly heavier than Vite.

## Data

| Layer | Choice | Why |
| --- | --- | --- |
| Database | **Neon** (serverless Postgres, free tier) | Requested. Scales to zero, works from Vercel serverless. |
| Access | **`@neondatabase/serverless`** + **Drizzle ORM** | Lightweight, typed SQL, good Neon story. Prefer Drizzle migrations checked into the repo. |

### Suggested core model (MVP)

- `events` — id, name, timestamps, **share token** (unguessable, used in the public/edit URL).
- `guests` — event_id, name, colour, optional seat assignment (table + seat index) or a separate `assignments` table.
- `tables` — event_id, label, seat_count (8–10).

Keep assignments consistent: a guest has at most one seat; a seat has at most one guest.

## Auth and sharing

| Concern | Choice |
| --- | --- |
| Operator login | **HTTP Basic Auth** (username + password from environment variables). This app has **one user**. |
| App access | All mutating UI and APIs sit behind basic auth **except** if we later decide share links bypass login. **MVP default:** share URL still requires the same basic auth (one operator). The “secret link” is the **unguessable event token in the path** so events are not enumerable (`/events/[shareToken]`). |
| Sharing | Anyone who has the operator password **and** the event URL can edit. No per-guest accounts. |
| Concurrency | **Not implemented.** Last write wins. Document this in the UI or README. |

If share-without-password is needed later, add a separate token-gated route. Do not build that until asked.

## Hosting (free tier)

| Piece | Choice |
| --- | --- |
| App | **Vercel Hobby** — Next.js native, HTTPS, preview deploys. |
| DB | **Neon free** — one project, one branch for MVP. |
| Secrets | Vercel env: `BASIC_AUTH_USER`, `BASIC_AUTH_PASSWORD`, `DATABASE_URL`. Never commit them. |

No Redis, no extra auth vendor, no Cloudflare Workers unless Neon + Vercel become a problem.

## Tooling

- **pnpm** (or npm if the repo already standardizes on it) + TypeScript strict mode.
- **ESLint** + **Prettier** as used by `create-next-app`.
- Tests: start with a few **unit tests** for seating rules (assign, swap, unseat, counts). Add Playwright later if needed.

## Non-goals in the stack

- Firebase, Supabase Auth, NextAuth, Clerk.
- Prisma (unless Drizzle proves painful; do not dual-ORM).
- Mobile-specific CSS or PWA.
- WebSockets / PartyKit / Liveblocks.
