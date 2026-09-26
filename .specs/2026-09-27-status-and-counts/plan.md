# Plan — Phase 6 Status and counts

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Derived status (no migration)

1. Do **not** add stored count columns or a new table. Seated / unseated / total stay derived from existing guest assignment columns (`table_id` + `seat_index`).
2. Reuse Phase 5 helpers (`isSeated`, `guestAssignmentLabel`) or a thin wrapper in `lib/seating.ts`. Same rules: both assignment columns set = seated; both null = unseated.
3. No new Drizzle migration. No denormalized totals on `events`.

## 2. Event page header strip

1. Stay on `/events/[shareToken]`. Add a **header strip** under the event title: **total**, **seated**, **unseated**.
2. Counts come from the same in-memory guest list the board already uses (optimistic after assign). After refresh they match Neon.
3. Do **not** add counts to `/` event list rows. Do **not** put numeric counts on the All / Seated / To seat tabs (tabs stay filters only).

## 3. No new writes

1. Do not add a counts Server Action or Route Handler. Assign / swap / unseat stay on the existing Phase 5 action.
2. After each drop, header counts update from the optimistic guest list so they match the grid immediately.
3. Revalidate is already on the assign action; refresh is still the source of truth.
4. Do **not** add Seated / Unseated badges on sidebar guest rows. Phase 5 assignment text (`Table · Seat N` / `No seat`) is enough.

## 4. Sanity before merge

1. Browser: assign, swap, unseat — header totals match occupied seat cells.
2. Refresh — same counts.
3. Event B unchanged when seating event A.
4. Curl: event URL without credentials still **401**.
5. `pnpm lint`. Leave Phase 7 polish (toasts, empty-state copy, README, deploy) for later.
