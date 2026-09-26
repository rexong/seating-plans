# Plan — Phase 10 Seating snapshot (print / PDF)

Numbered groups. Each group should leave `pnpm dev` runnable.

## 1. Derive the plan (no migration)

1. Do **not** add export-history tables or extra guest columns. The snapshot is the current event’s tables + seated guests from Neon.
2. **Tables and seats only.** Do not include the unseated list, sidebar, Add table, or drag chrome.
3. Every table in create order. Every seat `1 … seatCount` as a cell. Occupied seats show the same guest face as the board (full name, designation · organisation, colour, seating label). Empty seats stay empty.
4. No CSV / PNG / PPTX this phase. Quality is a **print layout**, not a screenshot of the workspace.

## 2. Dedicated export page

1. Add `/events/[shareToken]/export` (App Router page). Await `params` (Next.js 16 Promise). Unknown token → **404**.
2. Keep `proxy.ts` for Basic Auth. Event page and export page without credentials still **401**.
3. Load guests and tables from Neon on the server (same queries as the seating page). Do not snapshot optimistic client state.
4. Layout is **for paper / PDF**: event name as title; tables as a readable grid (one column per table or wrap like the board — pick one that stays legible at A4/Letter). Cards stay readable (wrap, no ellipsis). Hide operator chrome (sidebar, counts strip optional — **out** unless needed for table labels).
5. Add `@media print` so **Print → Save as PDF** is the download path. A visible **Print** control on the page is fine (calls `window.print()`).

## 3. Board header control

1. On `/events/[shareToken]`, put **Export** (or **Print plan**) in the **board header** next to Add table. Link to the export page.
2. Show the control when the event has tables (empty seats still export).
3. Do **not** add CSV import, a CSV download, or a live-workspace screenshot.

## 4. Sanity before merge

1. Browser: two tables, mixed empty/occupied seats — export page matches the board after refresh.
2. Print preview / Save as PDF: tables and seats are readable; no sidebar; unseated guests are **absent**.
3. Curl: export URL without credentials still **401**. Event page without credentials still **401**.
4. Authenticated unknown token → **404**.
5. `pnpm lint`. Leave Phase 11 polish/ship for later.
