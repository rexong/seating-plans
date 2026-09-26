# Plan — Phase 2 Events

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Events schema and migration

1. Replace the Phase 1 empty schema with an `events` table: primary key, `name`, `created_at` / `updated_at`, unique `share_token`.
2. Generate and commit a Drizzle migration (no `guests` / `tables`).
3. Apply the migration to the existing Neon database.
4. Keep a single server-only DB client; do not add a second Neon connection path.

## 2. Queries and Server Actions

1. Add Zod for event name (required, trim, max length).
2. Add server-only helpers: list events (newest first), get by `share_token`, create (generate token), delete by id or token.
3. Expose create and delete as `'use server'` actions. Revalidate `/` (and the event path on delete) after success.
4. Do not add public Route Handlers for events. No unauthenticated ping.

## 3. Home list on `/`

1. Replace the Phase 1-only status page with the event list plus a create-name form.
2. Each row links to `/events/[shareToken]`.
3. Delete uses a confirm dialog, then the delete action.
4. Empty list is explicit (“no events yet”). If the list query fails, show failure — not an empty success state.
5. Optional: a small connected/failed hint so Phase 1 proof is not fully lost.

## 4. Event page by share token

1. Add `app/events/[shareToken]/page.tsx`. Await `params` (Next.js 16).
2. Load the event by token; unknown token → `notFound()`.
3. Show name and a way back to `/`. Placeholder copy that guests/tables come later is fine.
4. Same Basic Auth as the rest of the app (no extra gate, no bypass).

## 5. Sanity before merge

1. Browser: create two events, open each URL, delete one, refresh — the other remains.
2. Curl: `/` and `/events/…` without credentials → 401; valid Basic Auth → 200 (or 404 for a fake token).
3. `pnpm lint`. Leave Phase 3 guest CRUD untouched.
