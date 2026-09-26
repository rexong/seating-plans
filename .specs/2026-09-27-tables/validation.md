# Validation — Phase 4 Tables

Implementation is mergeable when every item below is true. Roadmap **Done when:** event shows N tables × seat cells after refresh.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] Table Server Actions are not reachable without the same Basic Auth (no public table API).

## Data

- [ ] Repo has a `tables` Drizzle table and a checked-in migration (no guest seat columns / assignments).
- [ ] `event_id` foreign key uses **ON DELETE CASCADE**. Migration applied to Neon.
- [ ] Each new table has `seat_count = 10`. There is no 8/9/10 picker.
- [ ] Labels are unique enough per event (auto `Table N` or equivalent).
- [ ] Delete removes only that table. Other tables on the same event remain.
- [ ] Tables on event A never appear on event B. Deleting event A does not change B’s tables.
- [ ] Table cards and empty seat cells survive refresh (real Neon rows).

## Product / stack fit

- [ ] Table UI is on `/events/[shareToken]` (no `/tables` subroute).
- [ ] Guest operations stay in the **sidebar**. Table create/delete live in the **main** column.
- [ ] Zero tables: empty main + button to create the first table. After that: button to create more.
- [ ] Each table shows a header delete **icon** and **10 empty** seat cells. Unused seats are allowed.
- [ ] Add/delete use Server Actions; delete uses the in-app confirm modal.
- [ ] No drag-and-drop, no seated guests, no counts product UI.
- [ ] Failed table query is visible; empty state is not faked on error.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Open event A. Main column is empty. Create the first table. Confirm 10 empty seat cells.
2. Create a second table. Refresh — both tables and 10×2 empty cells remain.
3. Delete one table from its header (confirm). Refresh — the other table remains.
4. Open event B — none of A’s tables appear.
