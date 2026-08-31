# Prompt 08 — Driver Scorecard (rated every trip → running score)

Rate a driver after each trip on the factors that matter; a running score feeds dispatch. Needs Prompt
01 (DriverScore). Rules: commit per step, `tsc`=0, no fake data, screenshot gate.

## Backend
- `POST /trips/:id/driver-score` — at trip close, submit factor scores: onTime, podUploaded,
  fuelScore (from prompt 05 variance — good mileage = higher), damageScore, behaviourScore. Compute
  `total` (weighted 0–100), store with ratedBy + ratedAt.
- `GET /drivers/:id/score` — running score (avg/rolling of recent trips), trend, and per-factor
  breakdown + incident list.
- Feed dispatch: `GET /drivers?sort=score` so the dispatcher can prefer higher-scored drivers.

## Frontend
- Trip close flow: a quick rating panel (stars/sliders per factor) → saves the score.
- Driver detail: the running score (big number + trend), factor breakdown, recent trips with their
  scores. Drivers list shows a score column (fixes the old "N/A").

## VERIFY (screenshot gate)
- Curl: submit a score on a completed trip → `GET /drivers/:id/score` returns a real running score +
  breakdown (not N/A, not 0-default).
- Screenshots: the trip rating panel; a driver profile showing the running score + factor breakdown;
  the drivers list with real scores.
## REPORT
Paste curl (real score), `tsc`=0, screenshots. Do NOT say done if scores are N/A/dummy or don't
aggregate across trips.
