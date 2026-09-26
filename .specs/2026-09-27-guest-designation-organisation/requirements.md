# Phase 8 — Guest designation and organisation

## Context

Phase 6 left derived header counts on `/events/[shareToken]`, assignment text on cards (`Table · Seat N` / `No seat`), and drag-and-drop seating. Guests are still **name + optional colour + seat**. Polish/ship (toasts, empty-state copy, README concurrency, Vercel) is deferred to **Phase 11**.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 8.

## Scope

In:

- Nullable `designation` and `organisation` on `guests`. Name and colour unchanged.
- Single add on the event sidebar: name (required), designation and organisation (optional).
- Bulk add: one line per guest; **strict** `name;designation;organisation` (exactly two `;`). Empty middle/last fields allowed. Any invalid line rejects the whole batch.
- Guest cards (list and seated): full wrapped name; designation then organisation as one field (designation first, wrap at words, no ellipsis); then seating. Colour stays on the card.
- Sidebar search matches name **or** designation **or** organisation.
- Same URL `/events/[shareToken]`. Server Actions + Basic Auth unchanged.

Out:

- Editing name / designation / organisation after create.
- Putting `;` inside a field (not supported; operator must not use it).
- CSV export (Phase 10), vertical workspace (Phase 9), polish/ship (Phase 11).
- Households, notes, dietary fields, plus-ones as first-class data.
- Share-without-password, view-only links, extra auth.
- A dedicated `/events/[token]/guests` route.
- Stored counts or seating-rule changes.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **Optional nullable columns** | Existing guests stay usable. Operator can add name only; extras are empty until supplied. |
| Surfaces | **Add + cards + search those fields** | Fields are useless if hidden. Search must find org/title, not only display name. No in-place edit this phase — colour picker is enough for post-create mutation. |
| Mutations | **Strict three-field bulk; Server Actions; fail the batch** | `;` is a unique delimiter. Missing or extra `;` means the paste is wrong — insert nothing and wait for a fix. Empty extras still need the two separators (`name;;`, `name;designation;`, `name;;organisation`). |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts` (not deprecated `middleware.ts`); await `params` on the event page (`params` is a Promise).
- Re-check Basic Auth inside each guest Server Action. Do not add a public guests API.
- Zod: name required, trimmed, keep the current max (~120). Optional extras: trim; empty → null; set a similar reasonable max so cards stay bounded.
- Bulk: split lines on newlines, drop blank lines, then split each remaining line on `;`. `parts.length === 3` or fail the batch. Do not join remainder into organisation.
- Colour: still nullable “none” until the operator clicks the card. Bulk does not take a batch colour on create (same as current UI).
- List/search stays client-side on the loaded event guests. Failed list query must show failure, not an empty success.
- Cards: `truncate` / single-line `h-14` is no longer enough for wrapped names. Prefer CSS `break-words` / wrap at spaces; do not ellipsis the name.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation: every guest row hangs off `event_id`.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; Drizzle migrations checked in.

## Success (product)

The operator can add guests one-by-one and in bulk with designation and organisation (or leave those empty via optional fields / `name;;`), see the full name wrap on cards with extras and seating, find someone by organisation or designation, refresh, and get the same data. A bad bulk line does not insert a partial batch.
