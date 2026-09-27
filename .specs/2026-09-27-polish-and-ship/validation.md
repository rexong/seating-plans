# Validation — Phase 11 Polish and ship

Implementation is mergeable when every item below is true. Roadmap **Done when:** production URL works with free-tier limits; README matches the running app.

## Auth

- [ ] `/` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] `/events/[shareToken]/export` still **401** without credentials (unchanged).

## Data

- [ ] No Phase 11 migration. No toast or empty-state tables.
- [ ] Guests, tables, and assignments still persist only through existing Server Actions.
- [ ] Failed list queries still show failure, not an empty success + CTA.
- [ ] Event A mutations never toast as success for event B’s data.

## Product / stack fit

- [ ] Successful create/delete event, add (single + bulk) guest, delete guest, colour change, create/delete table, assign, swap, and unseat each show a brief **saved** toast.
- [ ] Failed writes (invalid bulk line, failed assign, etc.) show an **error** toast; a rejected drop is not shown as saved.
- [ ] Home with zero events: richer copy + CTA into the existing create form.
- [ ] Event with zero guests (All, no search/colour filter): richer copy + CTA into existing add controls.
- [ ] Event with zero tables: richer copy + existing create-table button.
- [ ] Filter empties and export empty copy are unchanged in behaviour.
- [ ] README still documents run, env vars, and last-write-wins, plus a Vercel + Neon checklist. No committed secrets or production URL.
- [ ] No `vercel.json` unless a documented deploy blocker required it.
- [ ] `proxy.ts` remains the Basic Auth gate.

## Manual check (operator)

```bash
# 401 without credentials
curl -sI http://localhost:3000/
curl -sI http://localhost:3000/events/not-a-real-token
```

1. Home with no events — read the empty copy, use the CTA, create an event. Confirm **saved**.
2. Open the event with no guests and no tables. Use guest and table CTAs. Confirm **saved** on add guest, bulk add, add table.
3. Change a guest colour; drag assign, swap, unseat. Confirm **saved** each time. Refresh — seating still matches.
4. Submit a bad bulk line (`name` without two `;`). Confirm **error** toast and no partial insert.
5. `pnpm lint`.
6. **Production (operator):** deploy Vercel Hobby with the three env vars; migrate production Neon; confirm Basic Auth prompt; open one real event URL. Check the box only after that URL works.

```bash
# After deploy (replace host). Expect 401 without credentials.
curl -sI https://YOUR-PRODUCTION-HOST/
```
