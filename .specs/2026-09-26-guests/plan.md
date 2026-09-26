# Plan — Phase 3 Guests

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Guests schema and migration

1. Add a `guests` table: primary key, `event_id` → `events.id` with **ON DELETE CASCADE**, `name`, nullable `colour`, timestamps.
2. Generate and commit a Drizzle migration (no `tables` / seat / assignment columns).
3. Apply the migration to the existing Neon database.
4. Keep the single server-only DB client; register the new table on the existing Drizzle schema.

## 2. Queries and Server Actions

1. Add Zod for a single name and for a bulk paste (newline-split, trimmed, drop blanks).
2. Colour: optional; unset means **none**. Bulk uses one optional colour for every inserted row.
3. Add server-only helpers: list guests for an event, create one, create many, delete by id (scoped to that event).
4. Expose add, bulk-add, and delete as `'use server'` actions. Revalidate `/events/[shareToken]` after success.
5. Re-check Basic Auth inside each action. Do not add public guest Route Handlers.

## 3. Event page layout (sidebar + list)

1. Replace the Phase 2 placeholder on `/events/[shareToken]`. Keep event name and a back link to `/`.
2. **Sidebar:** search field, **single-add** as one form (name + optional colour). Bulk add is a **button** that opens a **modal** with a textarea (one name per line) and optional shared colour — not an always-visible bulk form.
3. **Main:** guest list with name and colour (or an explicit none/untagged state).
4. Delete uses an in-app confirm **modal** (not `window.confirm`), then the delete action.
5. Search filters the visible list by name. Empty list is explicit. If the query fails, show failure — not an empty success.

## 4. Isolation and empty colour

1. Creating guests on event A must not list them on event B.
2. Deleting event A (existing Phase 2 action) must remove A’s guests via cascade; B is unchanged.
3. New guests start with no colour unless the operator picks one (single or bulk).

## 5. Sanity before merge

1. Browser: add one guest, bulk-add several (none and with one batch colour), search a name, delete one (confirm), refresh — list matches.
2. Open a second event: its list does not include the first event’s guests.
3. Curl: event URL without credentials still **401**.
4. `pnpm lint`. Leave Phase 4 tables untouched.
