# Seat Planning

Single-operator app for dinner and wedding seating. Create an event, add guests and 10-seat tables, then drag people onto seats. Plans persist in Neon and open at an unguessable URL.

Product notes live in [`.specs/`](.specs/mission.md).

## How to run

You need [pnpm](https://pnpm.io/) and a Neon Postgres database.

```bash
cp .env.example .env
# Fill in BASIC_AUTH_USER, BASIC_AUTH_PASSWORD, and DATABASE_URL.
pnpm install
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The browser will prompt for HTTP Basic Auth.

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm db:migrate` | Apply checked-in Drizzle migrations to Neon |
| `pnpm db:generate` | Generate a new migration after schema edits |
| `pnpm lint` | ESLint |

Use Neon’s **pooled** connection string for `DATABASE_URL` (hostname includes `-pooler`).

## Environment variables

Copy [`.env.example`](.env.example). Do not commit real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `BASIC_AUTH_USER` | Yes | Operator username |
| `BASIC_AUTH_PASSWORD` | Yes | Operator password |
| `DATABASE_URL` | Yes | Neon Postgres URL |

On Vercel, set the same three secrets. There is no OAuth or per-user accounts.

## Using the app

1. Sign in with Basic Auth.
2. Create an event on `/`. Each event has a share token in the path: `/events/[shareToken]`.
3. Add guests by name (one at a time, or the bulk-add icon next to the name field). Click a guest card to set colour. Search sits with the guest list; filter with **All / Seated / To seat**.
4. Add tables. Each table has **10** seats. Deleting a table unseats anyone on it.
5. Drag guests onto empty seats, between seats, or back to the guest list. Dropping on an occupied seat **swaps** the two guests.
6. Guest colour stays on the person. Cards show `Table · Seat N` or `No seat`. The event header shows **total / seated / unseated** (derived from assignments, not stored).

Edits persist through the existing Server Actions. There is no separate Save button.

Anyone who has **both** the Basic Auth password **and** the event URL can edit. The token stops events from being listed by guessing `/events/1`, `/events/2`, and so on. Share-without-password is not implemented.

## Concurrency

There is **no editor lock** and **no realtime sync**. If two people edit the same event, **the last write wins** and can overwrite the other. Use one operator at a time.

## Stack

Next.js 16 (App Router, `proxy.ts` for Basic Auth), TypeScript, Tailwind, Drizzle, Neon, @dnd-kit. Intended for Vercel Hobby + Neon free tier.

## Out of scope

Floor-plan canvas, mobile layout, view-only links, households/notes, CSV/print, and multi-editor presence.
