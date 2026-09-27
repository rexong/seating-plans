# Phase 12 — Colour borders and public export

## Context

Phase 11 shipped toasts, richer empty states, and a Hobby deploy checklist. Cards still show colour as a **dot** at the top-left of `GuestCardFace`. `/events/[shareToken]/export` is a read-only print snapshot but `proxy.ts` still Basic-Auths every HTML route.

Roadmap **Later** already listed a view-only link without Basic Auth. This phase does that for the existing export URL and moves colour onto a heavy **left** card border. Polish/ship stays done; this is a new slice after Phase 11.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Later + Phase 10 export page.

## Scope

In:

- Replace the guest colour **dot** with a **heavy left colour border** on every guest card (sidebar, board seats, export/print).
- Uncoloured guests keep a **thin** zinc border.
- Make **GET** `/events/[shareToken]/export` readable **without** Basic Auth (same path, same unguessable token).
- Keep **Back to seating**; that navigation triggers Basic Auth. Server Actions stay locked.

Out:

- Schema or a second share token / `/share` route.
- Public seating board, public home, or public mutations.
- Soft editor lock, OAuth, per-viewer accounts.
- Hiding Print or colour on the anonymous export page.
- Changing empty-seat chrome, colour picker UX (still click the card), or Phase 11 toasts.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Colour surfaces | **Everywhere; thin zinc if no colour** | One card face for board and print. Heavy **left** border is the code; no colour must not look selected. |
| Public URL | **Same `/events/[shareToken]/export` is public** | Token is already unguessable. No second URL to copy. Print stays on the page. |
| Back + writes | **In-page sign-in from export; cancel stays; actions stay locked** | A browser Basic dialog cannot return to export after cancel. Same credentials; writes never go public. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts` (not deprecated `middleware.ts`); await `params` on event/export pages.
- Skip auth **inside** `proxy` when `pathname` is the export page (tolerate a trailing slash). Do not drop the whole `/events/:token` tree from the matcher.
- Do not top-level-navigate to `/events/[shareToken]` until a session exists. Cancel must leave the export page in place. `/api/session` 401 must not send `WWW-Authenticate`.
- Re-check Basic Auth in existing Server Actions. Export page adds no actions.
- Tailwind border: one shared class (`border-l-[6px]` + colour, other sides thin zinc) vs `border` + `border-zinc-200` for none. Keep `print-color-adjust: exact` so PDF shows colour.
- Unknown export token: **404** without requiring login (token remains unguessable).
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator password; last write still wins.
- Event isolation unchanged. Public export still loads one event by share token.
- Desktop tabular UI; not a floor plan.
- TypeScript strict; pnpm; Drizzle unchanged this phase.

## Success (product)

Operators see colour as a heavy **left** card border (no dot) on the board and on the snapshot. Anyone with the export link can open and print the plan without a password. Clicking Back to seating asks for credentials on the export page; cancel stays on export; seating and all writes stay protected.
