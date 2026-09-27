# Mission

Build a **single-operator seat planning app** for events (dinners, weddings, and similar). The first user is the builder: keep the product tiny, reliable, and easy to throw away or extend later.

## Problem

Assigning guests to tables is fiddly in spreadsheets. The operator needs one place to:

- keep **events** isolated from each other
- manage a **guest list**
- manage **tables** and seats
- **assign seats** by dragging guests
- **persist** the plan and share it via a URL

## Product principles

1. **Tiny MVP.** One person uses this. No multi-tenant orgs, no realtime collaboration, no mobile-first work.
2. **Event isolation.** Each event owns its guests, tables, and seating. Tables never leak across events.
3. **Desktop tabular UI.** Seats are a grid/table, not a floor-plan canvas.
4. **Auto-save.** Edits persist without an explicit Save button. Refresh and later sessions restore the last saved plan.
5. **Cheap to run.** Stay on free-tier hosting and a free-tier database.
6. **Simple lock on the door.** Basic authentication for the operator. Event edit URLs are unguessable and still need the password. The print/export snapshot is readable with the token alone. Do not build invite-by-email or role systems in MVP.

## In scope (MVP)

- Create and delete events.
- Add one guest, bulk-add guests, delete a guest, search/find a guest.
- Guest fields: **display name**, optional **designation** and **organisation**, and **colour tag**.
- Add and remove tables. Each table has **8–10 seats**.
- Tabular view of tables and seats.
- Drag unseated guest onto a seat; move between seats/tables; return to unseated; **swap** if the target seat is occupied.
- Show seated / unseated; for seated guests show table + seat number.
- Counts: total, seated, unseated.
- Colour stays on the guest when they move.
- Cloud host, shareable URL, basic auth, auto-save.

## Out of scope (MVP)

- Real-time multi-editor collaboration and presence.
- Editor locks / occupancy (document the limitation: last write can overwrite).
- Mobile / touch-first layout.
- Floor-plan canvas, table shapes, or room geometry.
- Guest notes, households, dietary fields, plus-ones as first-class data (beyond designation and organisation).
- Per-user accounts, OAuth, or email invites. Public seating-board edit (export snapshot is the view-only link).
- Payments, orgs, audit logs, or export/print polish beyond what a later phase adds.

## Success

The operator can create an event, load guests, lay out tables, drag people into seats (including swaps), refresh the page, and see the same plan. A secret URL opens the same event for anyone who has it. The stack stays on free tiers.
