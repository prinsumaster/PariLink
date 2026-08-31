# Prompt 05 — Fuel & diesel capture with expected-vs-actual

Capture every diesel fill on a trip and compute expected vs actual, so the anomaly engine (prompt 09)
has data. Needs Prompt 01 (FuelEntry). Rules: commit per step, `tsc`=0, no fake numbers (compute them),
screenshot gate.

## Backend
- `POST /trips/:id/fuel` — add a FuelEntry: litres, amount, pump, slipNo, filledAt. On save, compute:
  - `expectedLitres` = trip distance ÷ the vehicle's expected mileage (km/L). Distance from the lane
    (origin→destination) or trip odometer delta; mileage from vehicle type default or its historical avg.
  - `variancePct` = (actual − expected) / expected × 100.
- `GET /trips/:id/fuel` — entries + trip totals (total litres, total ₹, overall variance).
- `GET /vehicles/:id/mileage` — km/L trend for the truck across trips.
- Fuel cost must roll into trip + per-truck cost.

## Frontend
- Trip detail "Fuel" section: add fills, show actual vs expected litres and the variance % (green if
  near expected, amber/red if over).
- Vehicle detail: a small km/L trend line.

## VERIFY (screenshot gate)
- Curl: add a fill on a known lane → response shows a computed expectedLitres and variancePct (not null,
  not 0-by-default).
- Screenshots: trip fuel section with actual/expected/variance; vehicle mileage trend.
## REPORT
Paste curl (computed expected + variance), `tsc`=0, screenshots. Do NOT say done if expected is a
hardcoded/dummy value or variance doesn't compute from real distance & mileage.
