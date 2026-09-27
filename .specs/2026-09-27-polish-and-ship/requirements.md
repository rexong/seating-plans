# Phase 11 — Polish and ship

## Context

Phases 8–10 left designation/organisation on guests, a vertical wrapping table board, and `/events/[shareToken]/export` (print → PDF). Roadmap **Phase 7** is a stub: polish and ship moved here so product slices landed first.

The app already auto-saves through Server Actions, has thin empty lines (“No events yet.” / “No guests yet.” / “No tables yet. Create the first one.”), and a README that covers run, env vars, and last-write-wins. There is **no** success/error toast on persist. Production Hobby deploy is not confirmed in-repo.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 11.

## Scope

In:

- Subtle **saved** toast after every successful mutation (forms, colour, table ops, **and** DnD assign/swap/unseat).
- **Error** toast after any failed mutation (same error strings the actions already return).
- Richer empty copy + obvious CTAs on **home** (no events) and the **event page** (no guests on All; no tables). Reuse existing create/add controls.
- README: keep run/env/concurrency; add a Vercel + Neon deploy checklist; match any new UI wording.

Out:

- Schema or migrations.
- `vercel.json` unless deploy is blocked without it.
- Committing production URLs or secrets.
- Changing export empty copy or adding an in-app concurrency banner.
- New empty illustrations, a toast history table, or a public (no Basic Auth) site.
- Soft editor lock, view-only links, mobile layout, floor-plan canvas.
- New Server Actions or Route Handlers just for toasts.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Feedback | **Saved + error on every persist, including DnD** | Auto-save is invisible today. The operator asked for confirmation on every write, not only form submits. Errors must be as visible as success. |
| Surfaces | **Richer empty + CTAs on home and event; export unchanged** | Home and seating are where a new operator gets stuck. Export already states “no tables”; extra chrome there is out. README already owns concurrency. |
| Ship | **README/Vercel checklist; operator deploys and confirms** | Free-tier Hobby + Neon is a human step (accounts, secrets). Spec does not invent a Vercel project in git. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts` (not deprecated `middleware.ts`); await `params` on event/export pages (`params` is a Promise).
- Re-check Basic Auth inside existing Server Actions. Do not add a public toast or health API.
- Prefer a single client toast host near the seating/home trees. Wire success when an action returns without `error` (and assign returns `null`). Colour and assign are already client-called — toast there; form actions can toast from `useActionState` when `error` clears after a successful submit.
- Keep failed list queries as red failure text. Empty CTAs only when the query succeeded and the list is truly empty.
- Guest empty CTA applies only to **zero guests on the event**, not to a filtered-empty list.
- No new env vars. Never commit secrets.
- Production confirmation is **manual**: operator sets Vercel env, migrates Neon, hits Basic Auth and one `/events/[shareToken]`.

## Constraints

- Tiny MVP: one operator; last write still wins; no realtime.
- Event isolation unchanged.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; Drizzle unchanged this phase.

## Success (product)

The operator sees **saved** when a write works and an **error** when it does not (including a rejected seat drop). Empty home / guest / table states explain the next click. README is enough to run locally and deploy Hobby. After the operator deploys, Basic Auth and one event URL work on the production host within free-tier limits.
