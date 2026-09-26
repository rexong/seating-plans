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

## Phase 7 — deferred

Polish and ship (toasts, empty states, README concurrency note, Vercel) moved to **Phase 11**. Next buildable phase is 8.

## Phase 8 — Guest designation and organisation

Schema, add forms, and the guest card are one slice: the new fields are useless if they are not collected and shown together. Polish/ship is last (Phase 11).

- Persist optional **designation** and **organisation** on each guest (nullable columns; keep name + colour).
- Single add: collect name (required), designation, organisation. Colour stays as today (card picker after create).
- Bulk add: one guest per line; **exactly** `name;designation;organisation` (two `;`). Empty extras still need the separators (`name;;`, `name;designation;`, `name;;organisation`). Wrong `;` count rejects the whole batch. Fields never contain `;`.
- Sidebar search matches name, designation, or organisation.
- Guest card (list and seated): show **full name**, then designation then organisation as one field (designation first), then seating (table + seat when seated; unseated otherwise). Colour stays on the card. Name, designation, and organisation wrap at word boundaries (longest name expected ~110 characters including spaces); do not truncate with ellipsis.

**Done when:** single and bulk add store designation/organisation; refresh keeps them; cards show name (wrapped), designation, organisation, and seating.

## Phase 9 — Vertical table workspace

Layout-only; no seating-rule or guest-schema changes.

- Table workspace grows **vertically** (new tables stack downward), not as a wide horizontal strip.
- Scrolling the workspace does **not** move the guest sidebar; the sidebar stays in place.
- **Add table** stays fixed in the **top-right** of the workspace (visible while scrolling tables).

**Done when:** adding several tables lengthens the board downward; sidebar stays put while the board scrolls; Add table remains top-right.

## Phase 10 — Seating snapshot (print / PDF)

Audit/tracking needs a **good-looking snapshot of the planned seating**, not a spreadsheet. Format is Print → Save as PDF.

- Dedicated export page (`/events/[shareToken]/export`) with the same tables and seated guests as the board (from Neon).
- **Tables and seats only** (no unseated list, no workspace chrome).
- Board-header link. Browser **Print** is the download path.
- Export only (no CSV import this phase).

**Done when:** operator can print or save a PDF of the tables that matches the board after refresh and is readable for audit.

## Later (not scheduled)

- Soft editor lock or overwrite warning.
- View-only link without basic auth.
- Guest notes / households (beyond designation and organisation).
- Floor plan canvas.
- Mobile layout.
- CSV import.
- Unseated list or timestamp on the export snapshot.

## Phase 11 — Polish and ship

Deferred from the old Phase 7 slot so guest fields, workspace layout, and the seating snapshot land first.

- Auto-save feedback (subtle “saved” / error toast).
- Empty states (no events, no guests, no tables).
- README: how to run, env vars, **concurrency limitation** (last write wins).
- Deploy Vercel + Neon; confirm basic auth and one event URL on production.

**Done when:** production URL works with free-tier limits; README matches the running app.

## Suggested build order (one line)

Auth + DB → events → guests → tables → DnD seating → counts → guest org fields + cards → vertical workspace → seating snapshot → deploy.
