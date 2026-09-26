# Phase 5 — Seat assignment

## Context

Phase 4 left empty 10-seat tables on `/events/[shareToken]`: guest ops in the sidebar (full list), tables in the main column as vertical seat stacks that grow sideways. This phase is **drag-and-drop seating** that persists on Neon. Seated/unseated **badges and counts** wait for Phase 6.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 5.

## Scope

In:

- Seat assignment on guests: nullable `table_id` + `seat_index`. No separate `assignments` table.
- A guest has **at most one** seat. A seat has **at most one** guest (unique `(table_id, seat_index)` when seated).
- Drag with **@dnd-kit**: unseated → empty seat; seat → seat (including other tables); seated → unseated list; drop on occupied seat **swaps**.
- Colour stays on the guest when they move.
- Same URL `/events/[shareToken]`. Sidebar still lists guests and keeps search / add / bulk-add. Sidebar has **three tabs**: **All**, **Seated**, **To seat** (unseated). Operator can toggle among them.
- Seated guests also appear in their seat cells (name + colour).
- One **Server Action** for a drop: client sends from/to (seat or unseated). Server enforces rules and performs swap if the target is occupied. Persist immediately; refresh restores the plan.
- Deleting a table **unseats** guests on it (`table_id` **ON DELETE SET NULL**). Deleting an event still cascades guests and tables.
- Basic Auth unchanged; re-check inside the action.

Out:

- Seated/unseated badges, table+seat labels on list rows, and header counts as a product feature (Phase 6).
- Floor-plan canvas, table shapes, mobile/touch-first DnD.
- Debounced/batch save, realtime collaboration, editor locks.
- A dedicated seating route.
- Changing seat count from 10.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **Nullable `table_id` + `seat_index` on guests** | Smallest model. Unique seat when both are set. Table delete unseats via SET NULL. |
| URLs | **Same event page; sidebar tabs All / Seated / To seat** | Full list remains. Tabs filter the sidebar. Seats stay the main drop targets. |
| Mutations | **One assign Server Action; server computes swap/unseat** | Immediate persist (auto-save). One rule engine so swap/occupancy cannot drift. Last write wins. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts`; await `params`. Revalidate `/events/[shareToken]` after a successful assign.
- `seat_index` is **1–10** (operator-facing seat number). `table_id` null and `seat_index` null together mean unseated. Never store a seat index without a table.
- Zod: event + guest + from/to payload. Reject cross-event IDs.
- @dnd-kit on the desktop grid; keyboard-accessible sensors as the library supports.
- Failed assign shows an error; do not leave a false seated cell that Neon rejected.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation: assignments never leak across events.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; Drizzle migrations checked in.

## Success (product)

The operator can drag guests through all four cases (onto empty, seat-to-seat, back to unseated, swap), see colour on the guest, switch All / Seated / To seat, refresh, and see the same seating. Deleting a table returns those guests to unseated.
