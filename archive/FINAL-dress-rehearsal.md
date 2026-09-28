# PariLink — FINAL demo dress rehearsal (real data walk + screenshots + script)

The rich seed is doing its job: it exposed real crashes (notifications `priority` vs `severity`,
wms flat-vs-nested) that the thin seed hid. That means MORE such data-shape bugs are lurking on
other screens. This pass hunts them all down, proves each demo screen looks real with a
screenshot, and produces the walkthrough. Same rules that are working: commit each step, no
package/dep churn, match real schema/DTO shapes (no `as any`).

## STEP 0 — finish the current pass first
Confirm the enrich seed is committed, `npx prisma db seed` runs clean TWICE (identical counts),
and the crash sweep + populated-screen check are green (`.last-run.json` = passed). Paste both.

## STEP 1 — walk EVERY demo-path screen WITH the rich data, fix what the data breaks
For each of these, load it logged-in and confirm it renders the seeded rows CORRECTLY (not just
"no crash" — the real values show): 
`dashboard, customers, fleet/vehicles, drivers, loads/bookings, trips, trip-detail,
lorry-receipts, LR-detail/print, dispatch, invoices, invoice-detail, payments, ledger/accounts,
profitability, documents, maintenance, warehouse/wms, notifications, tracking`.
When a screen shows wrong/blank fields or throws, the cause is almost always a **shape mismatch**
between what the component reads and what the API returns (like the two you just fixed). Fix the
component to match the real API shape — do NOT fake the data to match the component. Commit each
fix with the screen name.

## STEP 2 — SCREENSHOT each demo screen at 1440 (this is the proof)
Use Playwright to capture a full-page screenshot of every screen in Step 1 at 1440px width into
`apps/web/demo-shots/<screen>.png`. A screenshot is the un-fakeable proof it looks real — a green
sweep only proves "didn't crash". Save them; list the files. Commit: `test: 1440 demo screenshots`.

## STEP 3 — profitability + dashboard tell the story
- Dashboard KPIs reflect the rich seed (bookings, today's billing, outstanding, active vehicles).
- Profitability shows a **green profit lane AND a red loss lane** (you seeded a loss-making trip).
- Spot-check 3 dashboard tiles against `psql` counts. Paste the 3 comparisons + the profitability
  screenshot showing the red row.

## STEP 4 — the 60-minute DEMO-SCRIPT.md
Minute-by-minute: login → dashboard (real KPIs) → customers → fleet+drivers → create booking →
generate LR/Bilty + print → dispatch → trip in transit → POD → invoice → record payment →
ledger → profitability (show the losing lane). For each step: what to click, what to say (the
transporter value), rough timing. Add "if the client asks about X" (which screens are strong,
which to skip). Commit: `docs: 60-min demo script`.

## STEP 5 — final soak (survive the real demo)
Run the full crash sweep 5× back-to-back on Chromium with the rich data loaded; must be green
every time, servers stable. Paste the runs.

## Report
Per step: seed-twice counts, list of data-shape bugs found + fixed (screen + the field), the
screenshot file list, the 3 dashboard tile-vs-SQL checks, `.last-run.json` = passed ×5, and
commit hashes. Do NOT say "demo ready" without the screenshots saved and the populated-screen
check pasted. Claude will pull the screenshots and eyeball every demo screen, and re-run the sweep.

## Reminder (not for this pass — for after Janmashtami)
Launch blockers still open: durable tenant isolation proven on a fresh `docker compose down -v`
database, and the owner revoking the 5 leaked keys. Demo-safe ≠ launch-safe. Keep them on the list.
