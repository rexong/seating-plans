# Validation — Phase 2 Events

Implementation is mergeable when every item below is true. Roadmap **Done when:** operator can create two events and open each by URL; deleting one does not affect the other.

## Auth

- [ ] `/` and `/events/[shareToken]` without `Authorization` return **401** and `WWW-Authenticate` (Basic).
- [ ] Wrong password still **401**. Valid credentials can load the list and a real event URL.
- [ ] Server Actions are not reachable without the same Basic Auth (no public event API).

## Data

- [ ] Repo has an `events` Drizzle table and a checked-in migration (no guests/tables).
- [ ] Migration applied to Neon. `share_token` is unique and not a sequential integer in the URL.
- [ ] Create persists a name; list survives refresh.
- [ ] Delete removes only that event. A second event’s name and URL still work.
- [ ] Unknown token renders **404**. Sequential `/events/1` is not the share scheme.

## Product / stack fit

- [ ] List lives on `/`; open path is `/events/[shareToken]`.
- [ ] Create/delete use Server Actions; delete asks for confirm.
- [ ] No guest/table/seat UI. No share-without-password.
- [ ] Failed DB/list query is visible; empty list is not faked on error.
- [ ] `.env*` secrets stay uncommitted.

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/
curl -sI http://localhost:3000/events/not-a-real-token

# After pnpm dev + .env: 200 list, then create two events in the browser
curl -s -u "$BASIC_AUTH_USER:$BASIC_AUTH_PASSWORD" http://localhost:3000/
```

1. Create event A and event B.
2. Open each share URL in its own tab; both show the correct name.
3. Delete A (confirm). Refresh B’s URL and `/` — B remains; A’s URL is 404.
