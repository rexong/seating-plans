# Validation — Phase 8 Guest designation and organisation

Implementation is mergeable when every item below is true. Roadmap **Done when:** single and bulk add store designation/organisation; refresh keeps them; cards show name (wrapped), designation, organisation, and seating.

## Auth

- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] No new public guest Route Handler.

## Data

- [ ] `guests` has nullable `designation` and `organisation`. Existing rows are null until updated by a new add (no backfill required).
- [ ] Empty optional fields persist as **null**, not `""`.
- [ ] Name remains required. Colour and seat columns are unchanged.
- [ ] Event A’s new fields never appear on event B. Cascade delete still removes the event’s guests.

## Product / stack fit

- [ ] UI stays on `/events/[shareToken]`. No `/events/[token]/guests` route.
- [ ] Single add collects name, designation, organisation. Colour is still set from the card after create.
- [ ] Bulk lines are `name;designation;organisation`. `name;;`, `name;designation;`, and `name;;organisation` are valid.
- [ ] A line with the wrong number of `;` (or extra `;`) fails the **entire** batch; Neon has no new rows from that submit.
- [ ] Cards show full name (word-wrap, no ellipsis), then designation then organisation as one field (designation first, word-wrap, no ellipsis), then seating. Colour stays on the guest.
- [ ] A ~110-character name (with spaces) is fully visible, wrapped onto more than one line if needed.
- [ ] Sidebar search matches name, designation, and organisation.
- [ ] Name / designation / organisation are **not** editable after create in this phase.
- [ ] Adds use existing Server Actions (extended), not a new Route Handler.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Open an event. Add one guest with name, designation, and organisation. Card shows all three plus seating. Refresh — same.
2. Add a guest with name only (blank extras). Card shows name and seating; extras absent/empty. Refresh — extras still empty.
3. Bulk-add two valid lines, including one `name;;org` and one `name;title;`. Both appear. Refresh — same.
4. Bulk-paste a valid line plus a line with no `;` (or three `;`). Submit fails; **neither** line is inserted.
5. Search the organisation string from step 1 — that guest is listed. Clear search — full list returns.
6. Confirm a long name wraps on the card and in a seated cell; seating text remains readable.
