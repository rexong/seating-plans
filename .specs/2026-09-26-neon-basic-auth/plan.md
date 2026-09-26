# Plan — Phase 1 Neon + Basic Auth

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Dependencies and env

1. Add `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`.
2. Confirm `.env.example` still documents `BASIC_AUTH_USER`, `BASIC_AUTH_PASSWORD`, `DATABASE_URL` only (no real values).
3. Add pnpm scripts for generate/migrate (names can follow Drizzle kit defaults).
4. Document local `.env` (gitignored) pointing at the existing Neon project.

## 2. Drizzle + empty migration

1. Add a small Drizzle config (schema path, migrations folder, dialect `postgresql`).
2. Add a schema module that exports **no tables** (or only a placeholder comment / empty export).
3. Generate and commit the **first empty migration**.
4. Add a single server-only DB client using `@neondatabase/serverless` + `drizzle()`.
5. Run the migration against the existing Neon database.

## 3. Basic Auth on all app routes

1. Add root `proxy.ts` (Next.js 16; do not add deprecated `middleware.ts` unless proxy cannot express the gate).
2. Require `Authorization: Basic …` matching the env user/password. Missing or wrong credentials → **401** + `WWW-Authenticate: Basic realm="…"`.
3. If either auth env var is unset in production-like runs, fail closed (401 or throw at boot)—do not leave the app open.
4. Matcher: all pages and APIs; exclude `/_next/static`, `/_next/image`, and static file extensions so the 401 body and later `/` can still load assets.
5. Do not add an unauthenticated ping or `/health` route.

## 4. Home page database status

1. Keep `/` as the only confirmation surface.
2. After auth, run a trivial query (for example `select 1`) on the server.
3. Show a clear **connected** state when it succeeds.
4. Show a clear **failed** state when `DATABASE_URL` is missing or the query throws (no silent empty page).
5. Drop or replace the Phase 0 “scaffold is up” copy so the page reads as Phase 1.

## 5. Sanity before merge

1. Curl or browser: no credentials → 401; valid credentials → 200 and connected status against Neon.
2. `pnpm lint` (and `pnpm build` if env can be supplied in CI later—local build must not require committed secrets).
3. Leave Phase 2 (`events` table and UI) untouched.
