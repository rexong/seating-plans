# Phase 2 — Events

## Context

Phase 1 locked the app with HTTP Basic Auth and proved Neon connectivity on `/`. This phase is the first product object: isolated events with unguessable share URLs.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 2.

## Scope

In:

- `events` table: id, name, timestamps, unique **share token** (unguessable; used in the path).
- Create event (name), list events, delete event.
- Event URL: `/events/[shareToken]` (not a sequential integer).
- Home `/` becomes the event list (still behind Basic Auth).
- Mutations via **Server Actions** (form submit). Delete requires a **confirm** dialog.
- Deleting one event must not affect another. Guests/tables do not exist yet; SQL `ON DELETE CASCADE` on future children is enough later.

Out:

- Guests, tables, seats, drag-and-drop.
- Share-without-password or view-only links.
- Event rename/edit beyond create + delete (unless a tiny name field on create is all we need).
- Public `/health` or unauthenticated event routes.
- Extra auth products.

## Decisions (2026-09-26)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **Events table only** | Phase 3/4 own guests and tables. Cascade is a no-op until those tables exist. |
| URLs | **List on `/`; open `/events/[shareToken]`** | Home is the operator dashboard. Token in the path so events are not enumerable. Still requires Basic Auth. |
| Mutations | **Server Actions + confirm on delete** | Form POST is enough for auto-save-on-submit. Confirm avoids accidental wipe for a single operator. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: `params` on `/events/[shareToken]` are async. Use `proxy.ts` as-is; Server Actions POST to the page and stay behind the same Basic Auth matcher.
- Validate create payloads with Zod (name required, trimmed, reasonable max length).
- Generate `share_token` with `crypto.getRandomValues` / `crypto.randomBytes` (opaque, URL-safe). Unique index in Postgres.
- Missing or unknown token → **404**, not a guessable list of ids.
- Keep a small home-page DB failure message if Neon is down; do not let a silent empty list look like “no events” when the query failed.
- Never commit secrets. No new env vars beyond Phase 1.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation from day one: every later row will hang off `event_id`.
- TypeScript strict; pnpm; Drizzle migrations checked in.

## Success (product)

The operator can create two events, open each by its share URL, and delete one without changing the other. Unauthenticated requests still get 401.
