# PariLink — finish Profitability (for Antigravity)

The P&L math and tenant-scoping are correct — good. Three things remain: paste the
proof, add the route/lane analysis (currently stubbed), and fix the summary
performance. One item, one proof, raw output. Don't fake data; don't weaken anything.

## 0 — The cost side is UNPROVEN (all zeros). Prove it with real cost data.
Revenue (1600 == SQL 1600) and tenant isolation (B → 404) are proven — good. But the
tested trip returned `fuel:0, toll:0, bhattaOther:0, profit:1600, marginPct:100`. A
100%-margin trip does NOT exercise the cost aggregation and looks broken to a
transporter. After seeding real costs (section 4), re-run and paste a trip with
non-zero fuel + toll + bhatta and a realistic margin, plus at least ONE loss-making
(negative profit) trip. Show the API P&L JSON AND the matching SQL for fuel, toll, and
expense sums. That's the real gate.

## 1 — Add route from→to (the lane), currently omitted
In `profitability.service.ts`, the trip response drops `from`/`to`. Derive them from
the trip's first Load and include them in BOTH `tripPnl` and each row of `listTripPnl`:
```ts
const firstLoad = await tx.load.findFirst({
  where: { tripId: trip.id, deletedAt: null },
  select: { originCity: true, destinationCity: true },
  orderBy: { createdAt: 'asc' },
});
// in the returned trip object:
from: firstLoad?.originCity ?? null,
to:   firstLoad?.destinationCity ?? null,
```
Then show a "Route" column (from → to) in the UI table. PROOF: `GET /profitability/trips/:id`
returns non-null `from`/`to` for a trip that has a load.

## 2 — Implement lane P&L (bestLane / worstLane are hardcoded null)
This is the headline insight — "which lane loses money." In `companySummary`, key a
`laneStats` map by `"${originCity}→${destinationCity}"` (from each trip's first load),
accumulate revenue/cost/profit exactly like `vehicleStats`, then set:
```ts
const laneEntries = Object.entries(laneStats).sort((a,b)=>b[1].profit-a[1].profit);
bestLane  = laneEntries[0]  ? { lane: laneEntries[0][0],  profit: laneEntries[0][1].profit }  : null;
worstLane = laneEntries.at(-1) ? { lane: laneEntries.at(-1)[0], profit: laneEntries.at(-1)[1].profit } : null;
```
PROOF: `GET /profitability/summary` returns real `bestLane`/`worstLane` with a lane
string and a profit number. Show them on the dashboard summary strip.

## 3 — Fix the summary/list performance (N+1 → will time out at scale)
`companySummary` loops EVERY trip with 4 sequential aggregate queries each (500 trips
= 2000 sequential round-trips). Replace the per-trip loop with set-based SQL that
aggregates in a few queries, e.g.:
```sql
-- revenue per trip
SELECT "tripId", SUM(rate) rev FROM "Load" WHERE "companyId"=$1 AND "deletedAt" IS NULL GROUP BY "tripId";
-- toll per trip
SELECT "tripId", SUM(amount) toll FROM "TollTransaction" WHERE "companyId"=$1 GROUP BY "tripId";
-- expenses (non fuel/toll) per trip
SELECT "tripId", SUM(amount) exp FROM "Expense" WHERE "companyId"=$1 AND UPPER(type) NOT IN ('FUEL','TOLL','DIESEL') GROUP BY "tripId";
```
Join those in memory keyed by tripId. Same for fuel (by vehicle+window, or use
trip.fuelExpenses for the summary). Keep `tripPnl` (single trip) as-is — it's fine.
Also default `companySummary` to a date window (e.g. last 90 days) so it's bounded.
PROOF: `time curl .../profitability/summary` returns in well under a second on the
seeded data, and its totals still equal the sum of the per-trip numbers.

## 4 — Move the demo cost rows into the seed (no manual psql)
Antigravity hand-inserted a TollTransaction to make cost appear. Put realistic fuel +
toll + a couple of driver expenses per trip into `seed-demo.ts` (linked by tripId /
vehicleId) so the demo shows real P&L reproducibly and idempotently. PROOF: run the
seed twice, row counts identical, and the Profitability page shows non-zero costs and
at least one RED (loss-making) trip and one GREEN.

## 5 — Confirm the frontend does the two things that matter
In `profitability/page.tsx`: every `.map` is `Array.isArray`-guarded, profit ≥ 0
renders GREEN and a loss RED, and there's a Route (from→to) column. PROOF: screenshot
showing a red loss row and a green profit row.

## Report
Paste section 0's output first (that's the real gate), then the proofs for 1–5.
No "done" without the pasted numbers above it.
