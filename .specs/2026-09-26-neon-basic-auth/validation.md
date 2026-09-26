# Validation — Phase 1 Neon + Basic Auth

Implementation is mergeable when every item below is true. Roadmap **Done when:** unauthenticated users get 401; authenticated users hit a page that confirms DB connectivity.

## Auth

- [x] Request to `/` without `Authorization` returns **401** and includes `WWW-Authenticate` (Basic).
- [ ] Request to `/` with wrong user/password returns **401**.
- [x] Request to `/` with `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` returns **200** and HTML for the home page.
- [x] Any new Route Handler added in this phase is also 401 without credentials (no public ping, no public `/health`).
- [x] Static assets required to render `/` still load (`_next/static` not blocked by the auth matcher).

## Database

- [x] Repo contains a Drizzle config, a client module, and a **checked-in empty first migration** (no `events` / guests / tables).
- [x] Migration has been applied to the existing Neon database.
- [x] Authenticated `/` runs a live query and shows **connected** when Neon is reachable.
- [ ] Authenticated `/` shows an explicit **failure** if the URL is wrong or the query fails (not a hang or a false “ok”).
- [x] `.env*` secrets are not committed; `.env.example` has empty placeholders only.

## Product / stack fit

- [x] App stays runnable: `pnpm dev` + valid env shows the status page.
- [x] No Phase 2 event CRUD, share tokens, or extra auth products.
- [x] Auth is implemented with Next.js 16 `proxy.ts` (or documented exception if that convention cannot work).

## Manual check (operator)

```bash
# 401
curl -sI http://localhost:3000/

# 200 + page that mentions DB success (after pnpm dev and .env)
curl -s -u "$BASIC_AUTH_USER:$BASIC_AUTH_PASSWORD" http://localhost:3000/
```

Refresh the browser after a successful load: status still reflects a real query, not a cached lie from a previous boot if Neon is then stopped (best-effort; at minimum each request or each server render should query).
