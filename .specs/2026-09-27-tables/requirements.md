# Phase 4 — Tables

## Context

Phase 3 left per-event guests (name + colour) on `/events/[shareToken]`: sidebar for search / single add / bulk-add modal; main column for the guest list. This phase adds **empty tables** — no drag-and-drop, no seated guests.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 4.

## Scope

In:

- `tables` table: `event_id` (FK to `events`, **ON DELETE CASCADE**), **label**, **seat_count** (always **10**), timestamps.
- Add a table (no seat-count picker). First table: main column starts empty with a **create one table** button. After that, a **create more** button.
- Remove a table via a **delete icon** on that table’s header. Roadmap: **unseat on delete** — no assignments exist yet, so delete is just the table row.
- Main column: tabular view — one card/row per table, **10 empty seat cells**. Tables may stay unfilled later; empty cells are correct.
- Guest sidebar stays for guest operations. Table create/delete live in the **main** section, not the sidebar.
- Persist on add/delete via **Server Actions**. Refresh restores tables.
- Deleting an event removes its tables. Tables never appear on another event.

Out:

- Seat assignment, drag-and-drop, swaps (Phase 5).
- Seated / unseated badges and counts as a product feature (Phase 6).
- Choosing 8 or 9 seats; operator-typed table names (unless we auto-label and store that string).
- Guest seat columns or an `assignments` table.
- Floor-plan canvas, table shapes, room geometry.
- Share-without-password, extra auth.
- A dedicated `/events/[token]/tables` route.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **Tables only (label + seat count)** | Phase 5 owns assignments. `ON DELETE CASCADE` from events. Seat count stored as 10. |
| URLs | **Same event page; table ops in the main column** | `/events/[shareToken]`. Sidebar stays guests. Main starts empty with create-first-table; then create-more. Delete icon on each table header. |
| Mutations | **Always 10 seats; partial fill is fine** | No 8/9/10 picker. Empty cells this phase; later phases may leave seats unused. Server Actions; delete from the header icon. Confirm with the existing in-app modal (same as guests). |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts`; await `params`. Re-check Basic Auth inside each Server Action. Revalidate `/events/[shareToken]`.
- Zod: seat_count is not an operator input — insert `10`. Labels: auto `Table 1`, `Table 2`, … (or equivalent unique-per-event sequence). Do not expose a count field.
- List tables for the current event only. Stable order (created_at or label).
- Failed table query must show failure, not an empty “no tables” success.
- Roadmap “unseat on delete” is the locked rule for Phase 5+; document it now so delete stays the same when seats exist.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation: every table row hangs off `event_id`.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; Drizzle migrations checked in.

## Success (product)

The operator can open an event, create the first table from an empty main column, add more tables, see 10 empty seat cells per table after refresh, and delete a table from its header without affecting another event’s tables.
