# Validation — Phase 9 Vertical table workspace

Implementation is mergeable when every item below is true. Roadmap **Done when:** adding several tables lengthens the board downward; sidebar stays put while the board scrolls; Add table remains top-right.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] No new public layout or table-order Route Handler.

## Data

- [ ] No Phase 9 migration. No sort/layout columns. No stored sidebar prefs.
- [ ] Create-table still uses the existing Server Action. Table order remains create order.
- [ ] Guest designation/organisation and seating columns are unchanged.

## Product / stack fit

- [ ] UI stays on `/events/[shareToken]`.
- [ ] Tables grow **downward first**, then wrap to another column when the board pane has leftover width (not a single horizontal strip).
- [ ] Scrolling the **board pane** does not move the guest sidebar. Sidebar guest list may still scroll internally.
- [ ] **Add table** stays visible at the **top-right of the board pane** while tables scroll (non-scrolling board header, not a viewport overlay).
- [ ] Assign, swap, and unseat still work after the layout change and persist after refresh.
- [ ] Colour and card fields still show on seated cards.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Open an event with guests. Add several tables. They stack downward; if the board is wide enough, a second column appears instead of a sideways strip.
2. Scroll the board — sidebar stays put; Add table stays top-right of the board.
3. Drag a guest onto a seat (including after scrolling). Refresh — same seat.
4. Collapse/expand the sidebar if that control still exists — board scroll and Add table still behave as above.
