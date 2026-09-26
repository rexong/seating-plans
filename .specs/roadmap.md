# Roadmap

Very small phases. Each phase should leave the app **runnable** and **demoable**. Do not start the next phase until the current one is usable.

## Phase 0 — Repo and constitution

- Keep `.specs/` as the source of product truth (`mission.md`, `tech-stack.md`, this file).
- Scaffold Next.js + TypeScript + Tailwind.
- Add env example (`BASIC_AUTH_*`, `DATABASE_URL`) without real secrets.

**Done when:** `pnpm dev` shows a placeholder page.

## Phase 1 — Neon + Basic Auth

- Connect Drizzle to Neon; run first migration (empty or `events` stub).
- Protect all app routes with HTTP Basic Auth.
- Health check: authenticated request can talk to the database.

**Done when:** unauthenticated users get 401; authenticated users hit a page that confirms DB connectivity.

## Phase 2 — Events

- Create event (name).
- List events.
- Delete event (cascade guests/tables).
- Event URL uses an unguessable share token (not a sequential integer in the path).

**Done when:** operator can create two events and open each by URL; deleting one does not affect the other.

## Phase 3 — Guests (no seats yet)

- Add single guest (name + colour).
- Bulk add (paste names, one per line; default colour or one colour for the batch).
- Delete guest.
- Search/filter guest list.
- Persist to Neon; auto-save on add/delete (form submit or immediate mutation is enough).

**Done when:** guests survive refresh; search finds a name; colours display on the list.

## Phase 4 — Tables (empty seats)

- Add table with seat count 8, 9, or 10.
- Remove table (unseat any guests on it — or block delete until empty; pick one and stick to it: **unseat on delete**).
- Tabular view: one row/card per table, cells for seats (empty).

**Done when:** event shows N tables × seat cells after refresh.

## Phase 5 — Seat assignment (drag and drop)

- Unseated list + seated cells.
- Drag unseated → empty seat.
- Move guest seat → seat (including other tables).
- Drag seated → unseated list.
- Drop on occupied seat **swaps** the two guests.
- Colour remains on the guest.

**Done when:** all four drag cases work and persist after refresh.

## Phase 6 — Status and counts

- Badge or label: Seated / Unseated.
- Seated row shows table label + seat number.
- Header counts: total, seated, unseated (derived, not stored).

**Done when:** counts match the grid after assign/swap/unseat.

## Phase 7 — Polish and ship

- Auto-save feedback (subtle “saved” / error toast).
- Empty states (no events, no guests, no tables).
- README: how to run, env vars, **concurrency limitation** (last write wins).
- Deploy Vercel + Neon; confirm basic auth and one event URL on production.

**Done when:** production URL works with free-tier limits; README matches the running app.

## Later (not scheduled)

- Soft editor lock or overwrite warning.
- View-only link without basic auth.
- Guest notes / households.
- Floor plan canvas.
- Mobile layout.
- CSV import/export, print view.

## Suggested build order (one line)

Auth + DB → events → guests → tables → DnD seating → counts → deploy.
