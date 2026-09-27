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

## Deploy (Vercel Hobby + Neon)

Operator checklist. Do not commit secrets or the production URL.

1. Create a **Neon** project (free tier). Copy the **pooled** connection string (`-pooler` in the hostname).
2. From this repo, set `DATABASE_URL` to that production string locally (or in a one-off shell) and run `pnpm db:migrate` so production has the same schema as `main`.
3. Create a **Vercel Hobby** project from this Git repo. Framework: Next.js. Install command can stay `pnpm install`.
4. In Vercel → Environment Variables, set `BASIC_AUTH_USER`, `BASIC_AUTH_PASSWORD`, and `DATABASE_URL` (pooled) for Production.
5. Deploy. Open the production host — the browser should prompt for HTTP Basic Auth.
6. After signing in, create or open one event at `/events/[shareToken]` and confirm guests/tables persist after refresh.

No `vercel.json` is required for a standard Next.js Hobby deploy. If the build fails only because of a Vercel setting, fix that in the dashboard first.

## Using the app

1. Sign in with Basic Auth.
2. Create an event on `/`. Each event has a share token in the path: `/events/[shareToken]`.
3. Add guests with name plus optional designation and organisation (or bulk-add lines as `name;designation;organisation`). Click a guest card to set colour. Search matches name, designation, or organisation; filter with **All / Seated / To seat**.
4. Add tables. Each table has **10** seats. Deleting a table unseats anyone on it. Tables stack downward in the board (another column only if there is leftover width). The guest sidebar stays put while the board scrolls; **Add table** stays top-right of the board. **Export** opens a print-friendly seating snapshot (Print → Save as PDF). That export URL is shareable **without** Basic Auth; **Back to seating** asks for the operator password on that page (Cancel stays on export).
5. Drag guests onto empty seats, between seats, or back to the guest list. Dropping on an occupied seat **swaps** the two guests.
6. Guest colour stays on the person as a **heavy left card border** (no colour keeps a thin zinc border). Cards show the full name (wrapped), then designation and organisation (designation first, also wrapped), then `Table · Seat N` or `No seat`. The event header shows **total / seated / unseated** (derived from assignments, not stored).

Edits persist through the existing Server Actions. There is no separate Save button. A brief **saved** toast confirms each write; failed writes show an **error** toast (inline form errors stay as well).

An empty home list points at the create-event form. An event with no guests or no tables explains the next step and uses the existing add controls.

Anyone who has **both** the Basic Auth password **and** the event URL can edit. Anyone with `/events/[shareToken]/export` can **read** the snapshot (the token is unguessable). The token also stops events from being listed by guessing `/events/1`, `/events/2`, and so on.

## Concurrency

There is **no editor lock** and **no realtime sync**. If two people edit the same event, **the last write wins** and can overwrite the other. Use one operator at a time.

## Stack

Next.js 16 (App Router, `proxy.ts` for Basic Auth), TypeScript, Tailwind, Drizzle, Neon, @dnd-kit. Intended for Vercel Hobby + Neon free tier.

## Out of scope

Floor-plan canvas, mobile layout, households/notes, CSV import, and multi-editor presence.
