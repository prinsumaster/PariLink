# Prompt 09 — Fuel Intelligence / diesel-theft anomaly engine (the AI moat)

Turn the fuel data (prompt 05) into an anomaly engine that flags abnormal diesel use and buckets the
likely cause. This is grounded AI — rules on real data, not a chatbot guessing. Rules: commit per step,
`tsc`=0, no fake flags (compute from data), screenshot gate.

## Backend (`apps/api/src/intelligence/fuel` or similar)
- A scan (on-demand endpoint now; nightly BullMQ job later) that computes, per company:
  - **Per truck:** avg variance% across recent trips. Consistently high across DIFFERENT drivers →
    cause = **MECHANICAL**.
  - **Per driver:** avg variance% across DIFFERENT trucks. Consistently high → cause = **DRIVER / possible
    pilferage**.
  - **Per trip:** a single big spike (> threshold, e.g. +25%) → cause = **INVESTIGATE THIS TRIP**.
- `GET /intelligence/fuel/anomalies` — a ranked feed: entity (truck/driver/trip), variance, cause
  bucket, and a plain-English line ("Truck GJ-01-AB-1234 used 38% over expected on 4 of last 6 trips —
  likely mechanical").
- `GET /intelligence/fuel/summary` — worst trucks and worst drivers by variance.

## Frontend
- An "Anomalies" panel on the owner dashboard + a Fuel Intelligence page: the ranked anomaly feed with
  cause badges (Mechanical / Driver / Investigate) and drill-through to the trips.
- Wire the AI Copilot so "who is my worst diesel driver?" / "which trucks waste fuel?" answer from this.

## VERIFY (screenshot gate)
- Curl `GET /intelligence/fuel/anomalies` → real entries computed from FuelEntry variance (needs seeded
  fuel data with some deliberately high-variance rows).
- Screenshots: the anomaly feed with cause buckets; the copilot answering a diesel question from it.
## REPORT
Paste the anomaly curl JSON (computed, with causes), `tsc`=0, screenshots. Do NOT say done if anomalies
are hardcoded or don't derive from real variance data.
