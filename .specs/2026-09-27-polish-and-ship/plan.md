# Plan — Phase 11 Polish and ship

Numbered groups. Each group should leave `pnpm dev` runnable. This is the old Phase 7 polish/ship slot.

## 1. Feedback layer (no migration)

1. Do **not** add schema, toast tables, or stored “saved” flags. Persistence stays on existing Server Actions.
2. Add a **client toast region** (small custom component is enough; one tiny dependency is OK if it stays unobtrusive). No new Route Handler.
3. After **every successful persist**, show a brief **saved** toast: create/delete event, single and bulk guest add, delete guest, colour change, create/delete table, assign / swap / unseat (including drag).
4. After **any failed write**, show an **error** toast with the action’s existing error string. Keep inline form errors if they already exist; do not hide them.
5. Toasts are subtle (short, auto-dismiss). Failed assign must still roll back optimistic seating (Phase 5) and toast the error — do not leave a “saved” toast on a rejected drop.
6. Keep `proxy.ts` and Basic Auth on every existing action. Await `params` where pages already do.

## 2. Empty-state copy + CTAs

1. **Home `/`:** when the event list is empty (DB ok, no list error), replace the one-line “No events yet.” with short operator copy and an **obvious CTA** that focuses or points at the existing create-event form. Do not add a second create path.
2. **Event sidebar (All tab, no search, no colour filter):** when there are **zero guests on the event**, richer copy plus a CTA that focuses the single-add name field (or the existing add controls). Do **not** change filter-empty copy (“No guests match…”, colour filter, Seated / To seat).
3. **Event board:** when there are **zero tables**, richer copy; keep a primary **Create a table** button (existing `CreateTableButton`). Failed table/guest/event queries stay failure text — never look like an empty success.
4. Leave **export** empty copy as-is (`No tables on this event yet.`). No in-app concurrency banner (README already documents last write wins).

## 3. README deploy checklist (operator ships)

1. Keep existing how-to-run, env table, and **Concurrency** (last write wins). Update any UI wording that this phase changes (toasts, empty-state CTAs).
2. Add a short **Vercel + Neon** checklist: Hobby project, same three env vars, pooled `DATABASE_URL`, `pnpm db:migrate` against production Neon, Basic Auth on the production host, open one event URL after deploy.
3. Do **not** add `vercel.json` unless a real deploy blocker appears. Do not commit secrets or a production URL into the repo.
4. Operator deploys and records the production URL only in **validation** (checkbox + local note), not in git.

## 4. Sanity before merge

1. Browser: add guest, change colour, drag assign/swap/unseat, add table — each success shows **saved**; force a failed action (bad bulk line, or offline) — **error** toast, no saved.
2. Home with zero events: richer empty + CTA → create works. Event with zero guests / zero tables: richer empty + CTA → add works. Export page unchanged.
3. Curl: `/` and `/events/[shareToken]` without credentials still **401**.
4. `pnpm lint`. Production confirm is the operator’s checklist, not a CI job.
