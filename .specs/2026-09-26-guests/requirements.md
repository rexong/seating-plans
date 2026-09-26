# Phase 3 — Guests

## Context

Phase 2 left isolated events with unguessable share URLs. Home `/` lists events; `/events/[shareToken]` is still a placeholder. This phase is the first per-event guest list: name + colour, no seats.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 3.

## Scope

In:

- `guests` table: `event_id` (FK to `events`, **ON DELETE CASCADE**), display name, optional colour, timestamps.
- Add one guest (name; colour starts as **none** until the operator picks one).
- Bulk add: paste names, one per line; colour defaults to **none**. If the operator chooses a colour for the batch, that same colour applies to every name in the paste.
- Delete guest with a **confirm** dialog.
- Search/filter the guest list by name (client-side filter is enough).
- Persist on add/delete via **Server Actions** (form submit). Refresh restores the list.
- Guest UI lives on `/events/[shareToken]`: event header + **sidebar** for guest operations (add, bulk add, search); list in the main column.
- Colours show on the list. Colour stays on the guest (no seats yet).
- Deleting an event removes its guests. Guests never appear on another event.

Out:

- Tables, seats, drag-and-drop, seated/unseated badges, counts as a product feature (Phase 4–6).
- Seat columns or an `assignments` table.
- Guest notes, households, dietary fields, plus-ones.
- Share-without-password, view-only links, extra auth.
- A dedicated `/events/[token]/guests` route.

## Decisions (2026-09-26)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **Guests only (name + colour)** | Phase 4/5 own tables and seats. `ON DELETE CASCADE` from events so Phase 2 delete stays correct. |
| URLs | **All guest UI on the event page, with a sidebar** | Same `/events/[shareToken]`. Sidebar is where the operator adds, bulk-adds, and searches; the list is the main surface. |
| Mutations | **Server Actions + confirm delete; colour defaults to none** | Match Phase 2 persistence. Bulk may leave colour unset, or apply **one** chosen colour to the whole batch. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts`; await `params` on the event page. Server Actions stay behind Basic Auth; re-check auth inside each action (same as events).
- Validate with Zod: name required, trimmed, reasonable max length. Bulk: split on newlines, skip empty lines, reject a batch of only blanks.
- Colour: nullable / “none” in the DB until set. Use a small fixed palette (enough to tell parties apart); do not invent dietary/VIP as first-class fields.
- List guests for the current event only (`event_id`). Newest-first or name-sort is fine; pick one and stick to it in the plan.
- Failed list query must show failure, not an empty “no guests” success.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation: every guest row hangs off `event_id`.
- Desktop layout; sidebar is for the operator on a wide window, not a mobile-first nav.
- TypeScript strict; pnpm; Drizzle migrations checked in.

## Success (product)

The operator can open an event, add guests (one and bulk), see colours (or none) on the list, find a name with search, delete a guest after confirm, and refresh to the same list. A second event’s guests stay untouched.
