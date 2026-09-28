# PariLink — fix the blank charts, the Live Map, and the menu crash (one pass, then prove it)

Three visible problems, all diagnosed. Fix each at the root, then re-run the crawler and screenshot
the results — a blank chart doesn't crash, so the crawler alone won't catch it; the SCREENSHOT is the
proof. Rules: commit per fix, no dep churn, `tsc --noEmit`=0, don't fake data to fill a component —
feed it real data.

## FIX 1 — the "MenuGroupContext is missing" crash (fires on EVERY page)
It's the top-bar help menu (on every screen) plus billing:
- `apps/web/src/components/layout/help-menu.tsx:32` — `<DropdownMenuGroup>`
- `apps/web/src/app/(dashboard)/billing/page.tsx:45` — `<DropdownMenuGroup>`
Base UI throws because the `Group` part isn't inside a valid menu group context. Simplest safe fix:
**remove the `<DropdownMenuGroup>` wrapper** and render its children directly (they're just menu
items) — or replace it with a plain `<div role="group">`. Do the same in `data-table.tsx`
(`DropdownMenuRadioGroup`) only if the crawler still reports it.
Proof: open `/billing` and any page with the help (?) menu open → 0 console errors, no boundary.
Commit: `fix: remove invalid DropdownMenuGroup usage (MenuGroupContext crash)`.

## FIX 2 — the blank Reports charts (they get empty data)
`revenue-chart.tsx` and `fleet-utilization-chart.tsx` take a `data` prop and render Recharts; the
Reports page is passing `[]`, so the charts are empty. Make real data flow:
1. Find the Reports Dashboard page that renders these (`grep -rl RevenueChart apps/web/src/app`).
   See where `data` comes from (a hook / API call).
2. Ensure the backend returns real series. Add/verify these endpoints and hook them up:
   - **Revenue vs Expenses (YTD)** — per month: revenue = Σ invoices (or payments) in month;
     expenses = Σ expenses (fuel+toll+bhatta+maintenance) in month. Return `[{month,revenue,expenses}]`.
   - **Fleet Utilization (7 days)** — per day for the last 7: counts of vehicles Active(on trip) /
     Idle / Maintenance. Return `[{day,active,idle,maintenance}]`.
   Compute from the data already seeded (invoices, expenses, trips, vehicles). Hit them with curl and
   confirm non-empty JSON.
3. **Never render an empty chart.** In each chart component, if `!data?.length` show a small
   "No data for this period" empty state instead of a blank axis box.
Proof: `curl` both endpoints → non-empty arrays; screenshot `/reports` (or Reports→Dashboard)
showing an area chart WITH revenue/expenses and a bar chart WITH 7 days of bars.
Commit: `fix: real data for Reports charts + empty-state guard`.

## FIX 3 — the Live Map (blank → always shows something)
`components/dashboard/live-map.tsx` (and the other map components) use MapLibre + OpenStreetMap (no
token). Make it reliably render:
- Give the `<Map>` an explicit `mapStyle` (a public MapLibre/OSM raster style JSON), an initial
  `viewState` centered on India (`longitude: 78.9, latitude: 22.5, zoom: 4`), and `style={{width:'100%',height:'100%'}}`.
- Drop markers for the seeded trips/vehicles (origin/destination city coords — a small lookup for
  Mumbai/Delhi/Pune/Nagpur/Ahmedabad/Surat/Jaipur/Chennai/Bengaluru is fine).
- **Fallback:** if the map engine or tiles fail to load within ~4s, render a branded panel — an
  India outline (SVG) with truck pins on the seeded lanes and a "Live tracking" label — so the Live
  Map screen is NEVER blank.
Proof: screenshot the Live Map showing either the OSM map with pins, or the branded fallback with
lane pins. Commit: `fix: Live Map renders (India view + pins + fallback)`.

## VERIFY (all three) — screenshots are the gate
Bring both servers up (web 200 + api 200), then:
```bash
cd ~/Desktop/PariLink/apps/web && npx tsc --noEmit && npx tsx tests/crawl.ts   # 0 failures
```
Re-capture screenshots into `demo-shots/`: Reports Dashboard (charts filled), Live Map (map/fallback),
Billing (no error). Freshness-gate them (mtime newer than run start).
Report: the two chart endpoints' curl JSON, crawl = 0, and the fresh screenshot list. Do NOT say done
while any chart is blank or the console shows MenuGroupContext. Claude will open the three screenshots.
