# Phase 9 — Vertical table workspace

## Context

Phase 8 left designation and organisation on guests, wrapped card text, and the same `/events/[shareToken]` seating UI. Tables still sit in a **horizontal** flex row (`overflow-auto` on the strip). The page is already a full-viewport split; the sidebar does not currently stay isolated if the board’s overflow is shared or horizontal. Polish/ship is still **Phase 11**. CSV is **Phase 10**.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 9.

## Scope

In:

- Table workspace grows **downward first**, then **wraps to another column** when there is leftover width.
- **Board pane** is the scroll container. Guest sidebar stays put while the board scrolls (sidebar guest list may still scroll on its own).
- **Add table** stays in a **sticky / non-scrolling header** at the **top-right of the board pane**, using the existing create-table Server Action.
- Same URL `/events/[shareToken]`. Basic Auth and seating mutations unchanged.

Out:

- Schema or migration for layout, table sort order, or sidebar prefs.
- Viewport-fixed overlay for Add table.
- Confirm dialog before adding a table.
- Floor-plan canvas, table shapes, room geometry.
- CSV export (Phase 10), polish/ship (Phase 11).
- Mobile-first layout.
- New seating Server Actions or Route Handlers.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **No schema or stored layout** | Roadmap: layout-only. A sort column or sidebar cookie is extra product, not needed to stack tables. |
| Surfaces | **Wrap columns; board pane scrolls** | Operator asked for vertical growth, not a wide strip. Wrapping uses leftover width without a second scroll axis. Sidebar must stay while the board moves. |
| Mutations | **Sticky board header; existing action** | Add table already persists via Server Action. Pin it in board chrome so it stays top-right while tables scroll. No confirm, no overlay. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts` (not deprecated `middleware.ts`); await `params` on the event page (`params` is a Promise).
- Re-check Basic Auth stays in the existing create-table Server Action. Do not add a public layout API.
- Prefer Tailwind flex/grid wrap on the board list. Avoid stored pixel positions (that would be a floor plan).
- `@dnd-kit` measuring already uses `MeasuringStrategy.Always` on the event seating context; keep drops working after overflow changes.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation unchanged.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; no extra ORM.

## Success (product)

The operator can add several tables, see them stack downward and wrap when there is width, scroll the board without moving the sidebar, and still see Add table at the top-right of the board. Seating still persists after refresh.
