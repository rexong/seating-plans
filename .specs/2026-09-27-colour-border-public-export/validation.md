# Validation — Phase 12 Colour borders and public export

Implementation is mergeable when every item below is true. Roadmap **Done when** for this slice: colour reads as a heavy **left** card border everywhere cards appear; the export URL is shareable without Basic Auth; Back to seating challenges; writes stay locked.

## Auth

- [ ] `/` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] `/events/[shareToken]` without `Authorization` returns **401** and `WWW-Authenticate` (Basic).
- [ ] `/events/[shareToken]/export` without `Authorization` returns **200** for a real token (HTML seating snapshot).
- [ ] `/events/not-a-real-token/export` without `Authorization` returns **404** (not a login wall).
- [ ] Existing Server Actions still reject unauthenticated calls (colour, assign, create/delete).

## Data

- [ ] No Phase 12 migration. Guest colour values are unchanged.
- [ ] Export still derives tables + seated guests from Neon (no snapshot table).
- [ ] Event A’s export never shows Event B’s tables or guests.

## Product / stack fit

- [ ] Sidebar, seated cells, and export/print cards have **no** colour dot.
- [ ] Coloured guests have a **heavy left** border in that colour; other sides stay thin zinc.
- [ ] Uncoloured guests keep a **thin** zinc border (not heavy).
- [ ] Empty seats stay dashed thin zinc.
- [ ] Colour picker still opens on card click on the editor.
- [ ] Print / Save as PDF still shows colour borders (print colour adjust still on).
- [ ] Print and the Ctrl+P hint remain visible without login.
- [ ] Back to seating asks for credentials on the export page; cancel leaves the export page (no 401 document).
- [ ] After Basic Auth, the seating page still edits (drag, colour, add/delete).
- [ ] `proxy.ts` remains the gate; no `middleware.ts`.

## Manual check (operator)

```bash
# Replace TOKEN with a real event share token from the DB or URL.

# Still locked
curl -sI http://localhost:3000/
curl -sI http://localhost:3000/events/TOKEN

# Public snapshot
curl -sI http://localhost:3000/events/TOKEN/export
curl -sI http://localhost:3000/events/not-a-real-token/export
```

Expect **401** on the first two, **200** on the real export, **404** on the fake export.

1. Editor: one guest with a colour, one with none — heavy left colour border vs thin zinc; no dots.
2. Export (logged out / incognito): same cards and tables as the board after refresh; Print visible.
3. Print preview: colour borders still visible; no sidebar.
4. Click **Back to seating** — sign-in dialog on export; Cancel stays on export. After Continue the board is editable.
5. `pnpm lint`.
