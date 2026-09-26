# Plan — Phase 9 Vertical table workspace

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Layout only (no migration)

1. Do **not** add table sort columns, layout prefs, or a new table. Table order stays create order as today.
2. Do **not** persist sidebar open/closed. Session state is enough.
3. No new Drizzle migration. Seating rules, guest fields, and Server Actions stay as Phase 8 left them.

## 2. Board pane: stack down, then wrap

1. Stay on `/events/[shareToken]`. The event page remains a full-viewport split: guest sidebar + board.
2. Replace the horizontal table strip (`flex-row` + sideways overflow) with a wrap that **grows downward first**, then starts another column when there is leftover width (CSS grid / flex wrap / columns — pick one and stick to it).
3. Only the **board pane** scrolls. The guest sidebar does not move with that scroll. The sidebar’s own guest list may still scroll internally.
4. Adding several tables lengthens the board downward. Drag-and-drop, swap, and unseat still work after the layout change.

## 3. Sticky Add table (existing action)

1. Keep the existing create-table **Server Action** and `CreateTableButton`. Re-check Basic Auth stays inside that action. No new Route Handler.
2. Pin **Add table** in a **non-scrolling header** at the **top-right of the board pane**. It stays visible while tables scroll underneath.
3. Do **not** fix the button to the viewport overlay (it must stay in the board chrome, not float over the window).
4. Empty state (no tables) can still show the create control in the board; once tables exist, the sticky header is the add control.

## 4. Sanity before merge

1. Browser: add several tables — they stack downward, then wrap to another column if the pane is wide enough.
2. Scroll the board — sidebar stays put; Add table stays top-right of the board.
3. Drag a guest onto a seat after scrolling — assign still persists.
4. Curl: event URL without credentials still **401**.
5. `pnpm lint`. Leave Phase 10 CSV and Phase 11 polish/ship for later.
