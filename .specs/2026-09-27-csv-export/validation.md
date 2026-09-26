# Validation — Phase 10 Seating snapshot (print / PDF)

Implementation is mergeable when every item below is true. Roadmap **Done when:** operator can print or save a PDF of the tables that matches the board after refresh and is readable for audit.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] `/events/[shareToken]/export` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] Unknown share token on the export URL returns **404**, not another event’s tables.

## Data

- [ ] No Phase 10 migration. No export-history table.
- [ ] Page is built from Neon tables + guests at request time.
- [ ] Every table (create order) and every seat cell is shown. Occupied cells match the board guest face.
- [ ] Empty seats are empty cells. Unseated guests are **not** listed.
- [ ] Event A’s export never includes event B’s tables or guests.

## Product / stack fit

- [ ] Export control lives in the **board header** on `/events/[shareToken]` and opens `/events/[shareToken]/export`.
- [ ] Export page has no guest sidebar, Add table, or drag handles.
- [ ] Print / Save as PDF produces a readable plan (names and extras not clipped with ellipsis; table labels visible).
- [ ] After assign, swap, or unseat and **refresh**, the export page matches the board.
- [ ] No CSV / PNG download path this phase.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401 on seating page and export page
curl -sI http://localhost:3000/events/not-a-real-token
curl -sI http://localhost:3000/events/not-a-real-token/export
```

1. Open an event with two tables. Seat a guest on Table 1 seat 3 (with designation/organisation). Leave other seats empty. Leave one guest unseated.
2. Open **Export**. Confirm both tables, ten seats each, seat 3 occupied, other seats empty. Confirm the unseated guest is **not** on the page.
3. Print preview or Save as PDF — plan is readable; no sidebar.
4. Swap or unseat, refresh seating, open export again — cells match the board.
5. Authenticated request to a bogus token’s `/export` is **404**.
