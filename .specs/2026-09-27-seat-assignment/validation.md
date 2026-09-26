# Validation — Phase 5 Seat assignment

Implementation is mergeable when every item below is true. Roadmap **Done when:** all four drag cases work and persist after refresh.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] The assign Server Action is not reachable without the same Basic Auth (no public seating API).

## Data

- [ ] Guests have nullable `table_id` + `seat_index`. Migration applied to Neon. No `assignments` table.
- [ ] `table_id` uses **ON DELETE SET NULL**. A seated pair is unique per table seat.
- [ ] Unseated guests have both assignment columns null.
- [ ] Assign / move / unseat / swap persist; refresh matches the last successful drop.
- [ ] Seating on event A never appears on event B.
- [ ] Deleting a table unseats guests who were on it; other events and tables are unchanged.

## Product / stack fit

- [ ] UI stays on `/events/[shareToken]`. Drag uses **@dnd-kit**.
- [ ] Sidebar still lists guests and has tabs **All**, **Seated**, **To seat**.
- [ ] Four cases work: unseated → empty seat; seat → seat (incl. other tables); seated → unseated; drop on occupied **swaps**.
- [ ] Colour remains on the guest after every move.
- [ ] One assign Server Action; server performs swap/unseat. Immediate persist (not a debounce batch).
- [ ] No Phase 6 header counts / seated badges as a required product strip (tabs are the Phase 5 filter).
- [ ] Failed assign is visible; a rejected drop is not shown as saved.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Open event A with at least two guests and two tables. Drag guest 1 onto an empty seat. Refresh — still seated, colour unchanged.
2. Drag guest 1 to a seat on the other table. Refresh — only that seat is occupied.
3. Drag guest 1 back to the sidebar (To seat / All). Refresh — unseated.
4. Seat both guests; drop one onto the other — they **swap**. Refresh — swapped.
5. Switch All / Seated / To seat — lists match the board.
6. Delete a table that had a seated guest — that guest is unseated. Event B is unchanged.
