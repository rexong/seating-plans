# Plan — Phase 4 Tables

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Tables schema and migration

1. Add a `tables` table: primary key, `event_id` → `events.id` with **ON DELETE CASCADE**, `label`, `seat_count` (integer, always **10**), timestamps.
2. Generate and commit a Drizzle migration (no guest seat columns, no `assignments`).
3. Apply the migration to the existing Neon database.
4. Keep the single server-only DB client; register the new table on the existing Drizzle schema.

## 2. Queries and Server Actions

1. Server-only helpers: list tables for an event, create (auto label + `seat_count = 10`), delete by id scoped to that event.
2. Expose create and delete as `'use server'` actions. Revalidate `/events/[shareToken]` after success.
3. Re-check Basic Auth inside each action. Do not add public table Route Handlers.
4. Delete is **unseat on delete** when seats exist later; this phase only deletes the table row.

## 3. Event page main column (tables)

1. Keep the Phase 3 **sidebar** (search, single add, bulk-add modal). Move table work into the **main** column (guest list no longer owns the main grid).
2. **Zero tables:** empty main state with one button to create the first table.
3. **One or more tables:** each table is a card/row with a header (label + **delete icon**) and **10 empty seat cells**. A button to add another table.
4. Delete icon opens the existing in-app confirm **modal**, then the delete action.
5. If the tables query fails, show failure — not an empty success.

## 4. Isolation and empty seats

1. Tables on event A must not appear on event B.
2. Deleting event A must cascade its tables; B is unchanged.
3. Seat cells stay empty. Do not assign guests. It is OK that a table is not full.

## 5. Sanity before merge

1. Browser: open an event with no tables → create first table → see 10 empty cells → add a second table → refresh — both remain.
2. Delete one table from its header (confirm). Refresh — the other remains.
3. Open a second event: no tables from the first event.
4. Curl: event URL without credentials still **401**.
5. `pnpm lint`. Leave Phase 5 drag-and-drop untouched.
