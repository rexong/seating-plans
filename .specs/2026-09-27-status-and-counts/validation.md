# Validation — Phase 6 Status and counts

Implementation is mergeable when every item below is true. Roadmap **Done when:** counts match the grid after assign/swap/unseat.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] No new public counts or status Route Handler.

## Data

- [ ] No new count columns or tables. No Phase 6 migration.
- [ ] Total / seated / unseated are computed from guests (`table_id` + `seat_index`), never stored.
- [ ] Seated means both assignment columns set; unseated means both null.
- [ ] Counts on event A never include guests from event B.

## Product / stack fit

- [ ] UI stays on `/events/[shareToken]`. Header strip shows **total**, **seated**, **unseated**.
- [ ] `/` event list does **not** show seated/total.
- [ ] All / Seated / To seat tabs remain filters without required numeric badges.
- [ ] Sidebar rows keep Phase 5 assignment text only — no extra Seated / Unseated badge.
- [ ] After assign, swap, and unseat, header counts match occupied seat cells (including optimistic state before refresh).
- [ ] Refresh restores the same counts from Neon.
- [ ] No new write path for status. Existing assign Server Action is enough.
- [ ] Colour remains on the guest.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Open an event with at least three guests and one table. Note header: total = guest count, seated = 0 (or current), unseated = the rest.
2. Drag one guest onto an empty seat. Header seated +1, unseated −1. Occupied cells on the board equal seated.
3. Drag that guest onto another occupied seat (**swap**). Counts unchanged.
4. Drag a seated guest back to the unseated list. Header seated −1, unseated +1.
5. Refresh — header matches the board.
6. Open another event — its header is independent.
