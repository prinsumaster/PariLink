# PariLink — build the Trip Profitability module (for Antigravity)

The highest-value differentiator: turn "here are my trips" into "this trip/truck/lane
made or lost money." All the data already exists — this is an aggregation module, no
heavy new models. Build it the way the `customers` and `lorry-receipts` modules are
built.

## Rules
- One piece at a time; after each, PROVE it with pasted output/SQL. No batching.
- Tenant-scoped: every read through `runAsTenant(companyId, …)`. Guard every endpoint.
- Real DB numbers only — no Math.random, no hardcoded totals. If a trip has no cost
  rows, its cost is 0 and it shows as (apparent) full-margin — that's honest, not faked.
- If it won't prove, STOP and report. "NOT DONE" is fine.

## Data model — NONE new required (compute on the fly)
The inputs (verified field names):
- Revenue: `Load.rate` (Float) for every Load where `tripId = trip.id`.
- Fuel: `FuelTransaction.totalCost` for `trip.vehicleId` within [`trip.startDate`,
  `trip.endDate`]; fallback `trip.fuelExpenses`.
- Toll: `TollTransaction.amount` where its `tripId = trip.id`.
- Driver bhatta / misc: `Expense.amount` where `tripId = trip.id` (see double-count note),
  plus `trip.otherExpenses`.
- (Optional) driver settlement: `trip.settlement?.netPayable`.
Compute live for now. A cached `TripProfitabilitySnapshot` can come later if summary
queries get slow — do NOT add it yet.

## The P&L formula (put this in the service, exactly)
```
Revenue      = Σ Load.rate            WHERE Load.tripId = trip.id  AND deletedAt IS NULL
Fuel         = Σ FuelTransaction.totalCost  for trip.vehicleId in [startDate, endDate]
               (fallback: trip.fuelExpenses ?? 0)
Toll         = Σ TollTransaction.amount     WHERE tripId = trip.id
BhattaOther  = Σ Expense.amount             WHERE tripId = trip.id
                                            AND UPPER(type) NOT IN ('FUEL','TOLL','DIESEL')
             + (trip.otherExpenses ?? 0)
TotalCost    = Fuel + Toll + BhattaOther
Profit       = Revenue - TotalCost
MarginPct    = Revenue > 0 ? round((Profit / Revenue) * 100, 1) : 0
```
**Double-count caution:** fuel and toll each have a dedicated table. If your data also
logs them as `Expense` rows, they'd be counted twice — that's why the Expense sum
excludes FUEL/TOLL/DIESEL types. Keep each cost sourced from exactly one place and say
which in a code comment.

## Service — `apps/api/src/profitability/profitability.service.ts`
Mirror `customers.service.ts` conventions (constructor `private prisma: PrismaService`,
`runAsTenant`, pagination util). Methods:
- `tripPnl(companyId, tripId)` → `{ trip: {number,status,from,to}, revenue, fuel, toll,
  bhattaOther, totalCost, profit, marginPct }`. 404 if the trip isn't in this company.
- `listTripPnl(companyId, query)` → paged list, each trip with the summary numbers +
  a `profitable: boolean`. Order by profit asc so losses surface first.
- `vehiclePnl(companyId, vehicleId)` → aggregate across that vehicle's trips
  (totalRevenue, totalCost, totalProfit, tripCount, avgMarginPct).
- `companySummary(companyId, from?, to?)` → `{ totalRevenue, totalCost, totalProfit,
  tripCount, bestTruck, worstTruck, bestLane, worstLane }` for the dashboard.

## Controller — `apps/api/src/profitability/profitability.controller.ts`
```
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('profitability')
```
- `GET /trips`            @RequirePermissions('finance:read')   → listTripPnl
- `GET /trips/:id`        @RequirePermissions('finance:read')   → tripPnl
- `GET /vehicles/:id`     @RequirePermissions('finance:read')   → vehiclePnl
- `GET /summary`          @RequirePermissions('finance:read')   → companySummary
All take `@GetUser() user` and pass `user.companyId`. Add
`ProfitabilityModule` and register it in `app.module.ts` next to CustomersModule.

## UI — `apps/web/src/app/(dashboard)/profitability/page.tsx`
Mirror the branches/customers page pattern (`'use client'`, react-query, `api` from
`@/services/api`, `RoleGuard`, sonner). Show:
- A summary strip: Total Revenue · Total Cost · **Net Profit** · avg Margin% for the
  period (from `/profitability/summary`).
- A trips table: Trip No · Route (from→to) · Revenue · Cost · **Profit** · Margin% ·
  Status. **Profit ≥ 0 renders green, loss renders red** (this color cue is the whole
  point — an owner sees losing trips instantly). `font-variant-numeric: tabular-nums`
  on the money columns.
- Click a row → drill-down showing the breakdown (freight, fuel, toll, bhatta/other → total).
- Guard every `.map` with `Array.isArray`.
Add a nav entry "Profitability" (icon: TrendingUp/LineChart) under the Financials group
in `navigation.ts`.

## PROOF (paste all)
Pick a trip that has loads + some cost rows:
```bash
# (login helper as before) -> $A (admin), $CSRF, cookies
TRIP=$(curl -s localhost:8080/api/v1/trips -H "Authorization: Bearer $A" | jq -r '.data[0].id')

# 1) API P&L for that trip
curl -s localhost:8080/api/v1/profitability/trips/$TRIP -H "Authorization: Bearer $A" | jq

# 2) verify revenue against raw SQL (must match the API's revenue)
psql -U parilink -d parilink_db -h localhost -c \
 "SELECT COALESCE(SUM(rate),0) AS revenue FROM \"Load\" WHERE \"tripId\"='$TRIP' AND \"deletedAt\" IS NULL;"
# 3) verify toll against raw SQL
psql -U parilink -d parilink_db -h localhost -c \
 "SELECT COALESCE(SUM(amount),0) AS toll FROM \"TollTransaction\" WHERE \"tripId\"='$TRIP';"
```
The API's `revenue` and `toll` must equal the SQL. Paste both.

Tenant isolation (mandatory positive control):
```bash
# B (other company) must NOT see A's trip P&L
curl -s -o /dev/null -w "B reads A trip pnl: %{http_code} (want 404/403)\n" \
  localhost:8080/api/v1/profitability/trips/$TRIP -H "Authorization: Bearer $B"
```

UI: screenshot the Profitability page at 1440 — a profitable trip must be green, a
loss red, and the summary Net Profit must equal revenue−cost from the table.

## Why this one first
It proves the "Financial Operating System for Transport" claim with the owner's own
money, needs zero new infrastructure (all inputs already in the schema), and it's the
feature a plain booking tool can't match. After it, the natural next module is
WhatsApp delivery of the LR/POD (new build — WhatsApp Business API).
