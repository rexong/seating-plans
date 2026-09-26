# Plan — Phase 5 Seat assignment

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Assignment columns and migration

1. Add nullable `table_id` → `tables.id` with **ON DELETE SET NULL**, and nullable `seat_index` (integer 1–10), on `guests`.
2. Unique constraint so one guest occupies at most one seat and one seat has at most one guest (partial unique on `(table_id, seat_index)` where seated, plus guest uniqueness is the row itself).
3. Generate and commit a Drizzle migration (no separate `assignments` table).
4. Apply the migration to Neon. Keep the single DB client.

## 2. Assign Server Action and helpers

1. Add a server-only helper: apply a seating move (from unseated or a seat → to unseated or a seat). If the target seat is occupied by another guest, **swap**.
2. Enforce: same event; valid table; `seat_index` in `1…seat_count`; guest cannot sit twice; last write wins.
3. Expose **one** `'use server'` action. Revalidate `/events/[shareToken]`. Re-check Basic Auth.
4. Update table delete: guests on that table become unseated via SET NULL (no extra unseat loop required if the FK is correct).
5. Do not add public seating Route Handlers.

## 3. Drag-and-drop UI

1. Add **@dnd-kit**. Make sidebar guest rows and seat cells drag sources/targets as required for the four cases.
2. Sidebar: keep search, single add, bulk-add. Add tabs **All**, **Seated**, **To seat** that filter the same list.
3. Seat cells show the seated guest’s name and colour (empty cells stay empty drop targets).
4. Persist on drop via the single assign action (optimistic UI optional; Neon is source of truth after refresh).

## 4. Isolation and colour

1. Seating on event A must not appear on event B.
2. Colour stays on the guest through assign, move, swap, and unseat.
3. Deleting a table unseats its guests; they show under **To seat** / **All**.

## 5. Sanity before merge

1. Browser: all four drag cases, then refresh — same seats and colours.
2. Tabs: All shows everyone; Seated only assigned; To seat only unassigned.
3. Delete a table that had seated guests — those guests are unseated; other tables unchanged.
4. Curl: event URL without credentials still **401**.
5. `pnpm lint`. Leave Phase 6 counts/badges as a dedicated product UI (tabs may exist; do not add header totals yet).
