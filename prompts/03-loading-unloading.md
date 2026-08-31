# Prompt 03 — Loading & Unloading management

Capture loading/unloading events on a trip: points, time in/out → detention, hamali (labour), weight
in/out → shortage. Feeds trip cost + bilty. Needs Prompt 01 (LoadingEvent). Rules: commit per step,
`tsc`=0, no fake data, screenshot gate.

## Backend (`apps/api/src/trips` or a `loading` service)
- Endpoints (tenant-scoped, `@RequirePermissions`):
  - `POST /trips/:id/loading` — add a LOAD or UNLOAD event: point, timeIn, timeOut, weightIn, weightOut,
    hamaliCost.
  - `GET /trips/:id/loading` — list events for the trip.
- **Compute on save:** `detentionHrs` = timeOut − timeIn beyond a free window (e.g. 6h); `detentionCharge`
  = detentionHrs × rate; `shortage` = weightIn − weightOut (flag if beyond tolerance).
- These costs must roll into the trip's cost total (so per-truck/lane P&L includes hamali + detention).

## Frontend
- On trip detail: a "Loading / Unloading" section — add events, show a small timeline (load point →
  unload point) with times, weights, hamali, detention, and any shortage flag highlighted.

## VERIFY (screenshot gate)
- Curl: add a LOAD event with a long wait → response shows computed detentionHrs + charge; add UNLOAD
  with lower weight → shortage flagged.
- Screenshot: trip detail showing loading/unloading events with detention + hamali + a shortage flag.
## REPORT
Paste curl (computed detention/shortage), `tsc`=0, screenshot. Do NOT say done if detention/hamali
don't compute or don't appear in the trip cost.
