# Phase 6 — Status and counts

## Context

Phase 5 left drag-and-drop seating on `/events/[shareToken]`: nullable `table_id` + `seat_index` on guests, one assign Server Action (swap/unseat on the server), @dnd-kit, sidebar tabs **All / Seated / To seat**, and assignment text on cards (`Table · Seat N` / `No seat`). Phase 5 explicitly deferred **header counts**. Guest-row Seated / Unseated badges are **out** — assignment text already shows seat vs no seat.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 6.

## Scope

In:

- Event **header** counts: **total**, **seated**, **unseated**, derived from the current guest list (not stored).
- Keep Phase 5 assignment text on guest cards (`Table · Seat N` / `No seat`). No extra Seated / Unseated badge on rows.
- Counts stay in sync with the grid after assign, swap, and unseat (including optimistic UI already used for seating).
- Same URL `/events/[shareToken]`. Basic Auth unchanged.

Out:

- Schema or migration for counts.
- Seated / Unseated badges on sidebar guest rows.
- Counts on the home event list (`/`).
- Numeric labels on the All / Seated / To seat tabs.
- A new Server Action or Route Handler for status.
- Auto-save toasts, empty-state polish, README concurrency note, Vercel deploy (Phase 7).
- Stored denormalized counters, realtime, editor locks, floor-plan canvas.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **No schema change — derive only** | Roadmap: counts are derived. Assignment columns already exist. Extra event counters would drift and need writes this phase does not own. |
| URLs | **Event header strip only** | Operator sees totals next to the event they are seating. Home stays a name list. Tabs stay filters, not a second count UI. |
| Mutations | **Follow existing optimistic guests; no new writes** | One assign action already persists. Counts must match the grid the operator just changed; a second RSC-only source would lag or disagree. Last write still wins. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts` (not deprecated `middleware.ts`); await `params` on the event page (`PageProps` / `params` is a Promise).
- Re-check Basic Auth stays in existing Server Actions. Do not add a public counts API.
- Derive from guests already loaded for the event. `total = guests.length`; `seated = guests` with both assignment columns set; `unseated = total - seated`.
- Header must use the **same** guest array as the board after a drop so counts cannot drift from visible seats.
- Unit tests for counts are **not** required this phase (tech-stack still allows them later). Do not block merge on a new test runner if none exists.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation: counts never include another event’s guests.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; no extra ORM.

## Success (product)

The operator can assign, swap, and unseat, see header totals that match the board, refresh, and get the same numbers.
