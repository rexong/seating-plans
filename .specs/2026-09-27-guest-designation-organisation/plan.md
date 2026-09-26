# Plan — Phase 8 Guest designation and organisation

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Guest schema and migration

1. Add nullable `designation` and `organisation` (`text`) on `guests`. Existing rows stay null. Do not change name, colour, or seat columns.
2. Generate and commit a Drizzle migration. Apply it to Neon.
3. Extend `SeatingGuest` and guest queries/inserts so the new fields round-trip. Empty optional fields store as **null**, not empty string.

## 2. Add actions (single + bulk)

1. Keep **Server Actions** for create one / create many. Re-check Basic Auth. Revalidate `/events/[shareToken]`. No public guest Route Handlers.
2. Single add: name still required (trim, existing max ~120). Designation and organisation optional; blank → null. Colour stays as today (set later via the card picker, not on create).
3. Bulk: one guest per line. Each **non-empty** line must be **exactly three fields** separated by **two** semicolons: `name;designation;organisation`. Fields may be empty (`name;;`, `name;designation;`, `name;;organisation`). Trim each field after split. Name must be non-empty after trim.
4. Semicolons are **never** inside a field. Extra or missing `;` on any line fails the **whole** batch; insert nothing; show an error and leave the paste so the operator can fix it.
5. Reject a paste of only blank lines. Keep the existing batch-size cap.

## 3. Cards, forms, and search

1. Stay on `/events/[shareToken]`. Sidebar single-add collects name, designation, organisation. Bulk modal copy and placeholder show the semicolon format.
2. Guest card (sidebar and seated): **full name** (wrap at word boundaries; no ellipsis; longest expected ~110 characters with spaces). **Designation then organisation** as one field (designation first; omit empties); wrap at word boundaries, no ellipsis. Then seating (`Table · Seat N` / `No seat`). Colour dot stays. Cards may grow taller than the current single-line height.
3. Sidebar search matches **name, designation, or organisation** (case-insensitive). Empty designation/organisation do not match unless the query is empty.
4. Do **not** add post-create edit for name / designation / organisation. Colour picker stays.

## 4. Isolation

1. New fields stay on the event’s guests only. Event B never shows event A’s designation/organisation.
2. Deleting an event still cascades guests (including the new columns).

## 5. Sanity before merge

1. Browser: single-add with both extras, with one extra, and with name only — cards and refresh match.
2. Bulk: valid three-field lines insert; one bad line (wrong `;` count) inserts nothing and shows an error.
3. Search finds a guest by organisation (and by designation / name).
4. Long name (~110 characters) wraps; seating still visible.
5. Curl: event URL without credentials still **401**.
6. `pnpm lint`. Leave Phase 9 workspace layout, Phase 10 CSV, and Phase 11 polish/ship for later.
