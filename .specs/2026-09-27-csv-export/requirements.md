# Phase 10 — Seating snapshot (print / PDF)

## Context

Phase 9 left a vertical / wrapping table board on `/events/[shareToken]`, sticky Add table, and Phase 8 guest fields on cards. The operator needs a **high-quality snapshot of the planned seating** for audit and tracking. File type is secondary: **Print → Save as PDF** is enough. A spreadsheet grid is **out** — it will not look as good as the board.

Import stays in **Later**. Polish/ship is **Phase 11**.

Product truth: [mission.md](../mission.md), [tech-stack.md](../tech-stack.md), [roadmap.md](../roadmap.md) Phase 10.

Folder name `2026-09-27-csv-export` is historical; this phase is the print/PDF snapshot.

## Scope

In:

- Dedicated **export page** at `/events/[shareToken]/export` with the same tables and seated guests as the board (fresh from Neon).
- **Tables + seats only** (table labels, every seat cell, guest face on occupied seats).
- Board-header link on the seating page. **Print** on the export page → browser print dialog → Save as PDF.
- Print CSS so the PDF is a clean plan, not a screenshot of the workspace chrome.
- Same Basic Auth as the rest of the app.

Out:

- CSV, PNG, PPTX, or other file downloads this phase.
- Unseated guest list on the snapshot.
- Event header counts, export timestamp, or audit log fields.
- Screenshot of the live workspace (html-to-image).
- Server-rendered PDF binary (headless Chromium).
- Schema or stored export history.
- CSV import.
- Share-without-password / public export.

## Decisions (2026-09-27)

| Topic | Choice | Why |
| --- | --- | --- |
| Schema | **No schema — derive the page** | Assignments already live on guests. No export history. |
| Surfaces | **Board header → export page; tables only** | Audit needs the seating plan, not the sidebar. Unseated is operational, not the locked plan. |
| Mutations | **Print / Save as PDF (no new file Route Handler)** | Quality comes from a dedicated print layout. Browser PDF is enough; no extra PDF library. |
| Format | **Printable PDF via the browser** | Operator does not care about CSV vs PNG vs PPTX; they care that it looks like the plan. |

Implementation notes that follow from stack, not from extra product choices:

- Next.js 16: keep `proxy.ts` (not deprecated `middleware.ts`); await `params` on the export page (`params` is a Promise).
- Reuse `guestBySeat`, `guestAssignmentLabel`, and card face styling (or a print-only twin) so names wrap and extras match the board.
- Prefer Tailwind + `@media print` (`print:hidden` on chrome). Avoid stored pixel positions (that would be a floor plan).
- `@dnd-kit` stays off the export page — static cards only.
- No new env vars. Never commit secrets.

## Constraints

- Tiny MVP: one operator; last write wins; no concurrency UI.
- Event isolation: the page never shows another event’s tables.
- Desktop tabular UI; not a floor-plan canvas.
- TypeScript strict; pnpm; no extra ORM or PDF vendor.

## Success (product)

The operator opens Export, sees the tables as they are after refresh, prints or saves a PDF that is readable and looks like the planned seating, and cannot open the page without Basic Auth. Unseated guests are not on that snapshot.
