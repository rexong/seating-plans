# Validation — Phase 3 Guests

Implementation is mergeable when every item below is true. Roadmap **Done when:** guests survive refresh; search finds a name; colours display on the list.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] Guest Server Actions are not reachable without the same Basic Auth (no public guest API).

## Data

- [ ] Repo has a `guests` Drizzle table and a checked-in migration (no tables/seats/assignments).
- [ ] `event_id` foreign key uses **ON DELETE CASCADE**. Migration applied to Neon.
- [ ] Single add persists name; colour is **none** unless the operator chose one.
- [ ] Bulk add inserts one row per non-empty line. Unset batch colour → all none; chosen batch colour → same colour on every new row.
- [ ] Delete removes only that guest. Other guests on the same event remain.
- [ ] Guests on event A never appear on event B. Deleting event A does not change B’s guests.
- [ ] List survives refresh (real Neon rows, not memory-only).

## Product / stack fit

- [ ] Guest UI is on `/events/[shareToken]` (no `/guests` subroute).
- [ ] Operations (search, single add, bulk add) live in a **sidebar**; the list is the main column.
- [ ] Add/bulk-add/delete use Server Actions; delete asks for confirm.
- [ ] Search/filter finds a guest by name on the list.
- [ ] Colours (or none) show on the list.
- [ ] No table/seat/DnD UI. No share-without-password.
- [ ] Failed guest query is visible; empty list is not faked on error.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Open event A. Add “Ada” with no colour. Bulk-paste two names with no colour. Bulk-paste two more with one shared colour.
2. Search “Ada” — only matching rows show. Clear search — full list returns.
3. Refresh — same names and colours (including none).
4. Delete one guest (confirm). Refresh — that name is gone; the rest remain.
5. Open event B — none of A’s guests appear.
