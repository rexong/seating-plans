# Plan — Phase 12 Colour borders and public export

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Colour on the card border (no migration)

1. Do **not** change guest colour columns or add a second colour token. Existing `guests.colour` values stay as they are.
2. Remove the 12px colour **dot** from `GuestCardFace`. Colour is the **card border** on sidebar cards, seated cells, and export/print cards.
3. Coloured guests: **heavy left** border in the guest colour; other sides stay thin zinc. Uncoloured guests: keep today’s **thin** `zinc-200` border so they do not look selected.
4. Empty seat placeholders stay dashed thin zinc. Colour picker still opens on card click; popover swatches can keep dots.
5. Reuse one border-class helper (extend or replace `guestColourDotClass`) so board and export cannot drift. Print already uses `print-color-adjust: exact` — keep that so PDF borders stay visible.

## 2. Public GET on the same export URL

1. Keep `/events/[shareToken]/export` (await `params`). Do **not** add a second public path or a second share token.
2. In `proxy.ts` (not deprecated `middleware.ts`), skip Basic Auth for that export pathname only (include trailing-slash and RSC query variants; match on pathname, not the full URL). Home, `/events/[shareToken]`, and every other HTML route stay locked.
3. Unknown token on the export page is still **404**. No new Route Handler. Print and the Ctrl+P hint stay on the page for anonymous viewers.
4. Export remains tables + seated guests only. No edits, no Server Actions on the page.

## 3. Back to seating still challenges; writes stay locked

1. Keep **Back to seating** → `/events/[shareToken]`. Opening seating still requires operator credentials. After success they can edit.
2. Do not use a top-level (or iframe) Basic Auth challenge from export — canceling that always replaces the page with 401. Sign in on the export page; Cancel stays on export. Typed seating URLs still get the browser Basic challenge.
3. Re-check Basic Auth inside existing Server Actions. An anonymous viewer who calls an action without credentials still fails. Do not add public mutation APIs.
4. Do not hide Print or guest colours for anonymous users.

## 4. Sanity before merge

1. Browser: coloured and uncoloured cards — heavy left colour border vs thin zinc; no dots on cards; export/print matches the board.
2. Curl: export URL without credentials is **200** (or **404** for a fake token). `/` and `/events/[shareToken]` without credentials are still **401** + Basic challenge.
3. Incognito: open a real export link, print chrome visible, Back to seating opens an on-page sign-in; cancel stays on export; seating still edits only after auth.
4. `pnpm lint`.
