# Prompt 06 — Workshop / Job Cards + Tyre management

Track every repair (labour + parts + vendor + cost) and every tyre (position, life, cost/km) per truck,
so per-truck cost is real. Needs Prompt 01 (MaintenanceJob, JobPart, Tyre). Rules: commit per step,
`tsc`=0, no fake data, screenshot gate.

## Backend
**Workshop / Job Cards**
- `POST /vehicles/:id/jobs` — open a job: type, vendor, odometer, labourCost. `POST /jobs/:id/parts` —
  add a part: name, qty, unitCost (amount auto = qty×unitCost). `POST /jobs/:id/close`.
- `GET /vehicles/:id/jobs` — jobs + total cost (labour + Σ parts). This total feeds per-truck P&L.
**Tyres**
- `POST /vehicles/:id/tyres` — fit a tyre: position, serial, brand, fittedAtKm, expectedLifeKm, cost.
  `POST /tyres/:id/remove` — removedAtKm.
- `GET /vehicles/:id/tyres` — current tyres by position + **cost per km** = cost ÷ (currentKm − fittedAtKm).

## Frontend
- Vehicle detail: a "Workshop" tab (job cards with parts + running maintenance cost) and a "Tyres" tab
  (a truck diagram or list by position, life used %, cost/km).

## VERIFY (screenshot gate)
- Curl: open a job, add 2 parts → job total = labour + parts; fit a tyre then read cost/km.
- Screenshots: vehicle Workshop tab (job with parts + total) and Tyres tab (positions + cost/km).
## REPORT
Paste curl (job total, tyre cost/km), `tsc`=0, screenshots. Do NOT say done if job totals or tyre
cost/km don't compute, or they don't feed the truck's cost.
