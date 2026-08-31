# Prompt 07 — Per-Truck P&L (Total Cost of Ownership)

The CFO view: a running net profit per truck. Depends on fuel (05), workshop/tyres (06), tolls,
expenses. Rules: commit per step, `tsc`=0, numbers from REAL queries (no fake), screenshot gate.

## Backend (`apps/api/src/profitability` — add per-truck alongside per-lane)
- `GET /profitability/vehicles?from&to` — for each truck in the period:
  - revenue = Σ freight on that truck's trips
  - − diesel (Σ FuelEntry.amount) − toll/FASTag − driver cost (salary+bhatta share) − workshop
    (Σ MaintenanceJob labour + JobPart) − fixed (EMI/insurance/depreciation, from vehicle config)
  - = **netProfit**; also return cost breakdown + ₹/km.
- `GET /profitability/vehicles/:id` — one truck's P&L with the full breakdown and its trips.
- **Performance:** pre-aggregate in a nightly job (don't compute live for 200 trucks on every load);
  the endpoint reads the aggregate + tops up recent trips.

## Frontend
- A "Per-Truck Profit" page: ranked list most-profitable → loss-making, each row showing net profit +
  ₹/km + a red/green bar. Drill into a truck → full cost breakdown (diesel / workshop / driver / fixed)
  and why it's winning or losing.

## VERIFY (screenshot gate)
- Curl `GET /profitability/vehicles` → real numbers per truck (revenue, each cost bucket, netProfit),
  non-zero from seeded data.
- Screenshots: the ranked per-truck list (winners green, losers red) and one truck's cost-breakdown drill.
## REPORT
Paste the curl JSON (real per-truck P&L), `tsc`=0, screenshots. Do NOT say done if numbers are 0/dummy
or the cost buckets don't come from fuel/workshop/expense data.
