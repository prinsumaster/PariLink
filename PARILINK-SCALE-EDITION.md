# PariLink for Large Fleets — Operations Depth, the Smart Layer & Pricing

> Target audience: transport owners with **200+ trucks**. This document captures the deeper operational
> features that big fleets actually need — multi-person trip workflows, driver scoring, fuel/diesel-theft
> intelligence, and true per-truck profit — plus the AI layer and the ₹100/truck pricing model.
> This EXTENDS the core blueprint (`PARILINK-BLUEPRINT.md`); read that first.

---

## 0. Why this matters
A 50-truck owner wants a clean TMS. A **200+ truck owner runs a factory** — many staff, huge diesel
spend, constant workshop cost, and money leaking in a hundred small places he can't see. He doesn't buy
"features"; he buys **control over leakage and a real per-truck P&L.** That's what this edition delivers.

The big idea: **PariLink should show a large owner exactly where every rupee goes on every truck, and
flag anything abnormal automatically.** In Indian trucking, the two biggest silent losses are **diesel
pilferage** and **untracked workshop cost** — PariLink attacks both.

---

## 1. Multi-person trip workflow — "trip desks"
**The insight (yours):** one trip is not run by one person. In a big office, ~5 people each own a slice:
FASTag, diesel, workshop/mechanical, documentation/POD, and dispatch. PariLink must reflect this.

**How it works — a trip has DESKS, each owned by a role:**

| Desk | Who | What they do on the trip |
|---|---|---|
| **Dispatch** | Traffic in-charge | Assign truck + driver, start/close trip |
| **Diesel** | Diesel manager | Enter fuel issued (litres, ₹, pump, slip) at each fill |
| **FASTag / Toll** | FASTag desk | Toll spend, FASTag balance/recharge for the trip |
| **Workshop** | Mechanic desk | Any repair/tyre/part done for/during the trip + cost |
| **Documentation** | POD desk | LR/bilty, POD photo, e-way bill, weight slips |

- Each desk sees **only its part** of the trip on its home screen (role-based, per §2 of the blueprint).
- A trip is **not "closed" until every desk marks its part complete** — so nothing is forgotten and
  every cost is captured. This is the mechanism that makes per-truck profit *accurate*.
- The owner sees the whole trip assembled from all desks in one view.

This multi-desk model is a real differentiator — most TMS assume one operator per trip.

---

## 2. Loading / Unloading management
Add proper loading/unloading handling (competitors offer this; do it better):
- **Loading & unloading points** with time in / time out → **detention** calculation (chargeable waiting).
- **Hamali / labour charges** (loading-unloading coolie cost) recorded per trip → feeds trip cost.
- **Weight in / weight out** (challan weight, actual weight) → shortage/excess flags.
- **Multi-point trips** — a truck loading/unloading at several stops on one trip.
Everything here feeds the trip's cost and the bilty.

---

## 3. Bilty / LR generation (done properly)
The core transport document — make it excellent:
- GST-ready LR with consignor/consignee, goods, weight, freight, GST breakup, e-way bill no.
- **Multi-copy** (consignor / consignee / driver / office / POD copy) and **print + WhatsApp PDF**.
- Series/branch-wise numbering, reprints tracked, cancellation handling.
- Auto-fills from the booking → no re-typing.

---

## 4. Driver scorecard — rated after every trip
**The insight (yours):** review the driver after each trip; a running score per driver.

**How it works:**
- At trip close, the desk (or dispatcher) rates the trip on factors that matter:
  **on-time delivery, POD uploaded, fuel efficiency vs expected, damage/shortage, toll/route
  discipline, behaviour/complaints, vehicle condition returned.**
- Each factor scores points → a **running driver score** (e.g. 0–100) + a trend.
- The score **feeds dispatch**: better drivers get priority on high-value lanes; risky drivers get
  flagged. Also feeds incentives/bhatta decisions.
- Driver profile shows: score history, trips, on-time %, fuel record, incidents.

This turns "which drivers can I trust" from gut feeling into data.

---

## 5. Fuel intelligence & diesel-theft detection ⭐ (the killer feature)
**The insight (yours):** driver A needs 100L for A→B, driver B needs 50L for the *same* route — why?
Truck problem, driver problem, or diesel theft?

**How it works:**
- For every route/lane, PariLink learns the **expected fuel** (from distance + truck type + historical
  average, e.g. km ÷ expected mileage).
- On each trip, compare **actual diesel issued vs expected**. If actual is abnormally high, **flag it**
  with a likely cause bucket:
  - consistently high on **one truck** across drivers → **mechanical** (engine/tyre/tuning).
  - high for **one driver** across trucks → **driver** (style, or **diesel pilferage**).
  - one-off spike → investigate that trip (route deviation, idling, theft).
- Show a **mileage (km/L) trend per truck and per driver**, and an **anomaly feed** the owner reviews.
- **This is where AI earns its place:** not a chatbot — an anomaly engine that says *"Truck GJ-01-AB-1234
  used 38% more diesel than expected on 4 of its last 6 trips — likely mechanical; and driver Suresh
  averages 15% over expected across every truck — investigate."*

Diesel is 50–60% of a truck's running cost. Catching even small pilferage across 200 trucks is lakhs a
month. **This alone can justify the whole subscription.**

---

## 6. Per-truck Total Cost & Net Profit (the CFO view)
**The insight (yours):** each truck's cost — workshop, tyre change, parts, diesel consumed — then the
real net profit per truck.

**How it works — every truck has a running P&L:**
```
Revenue (freight earned by that truck)
  − Diesel
  − Toll / FASTag
  − Driver cost (salary + bhatta)
  − Workshop (labour + parts + tyres + oil)
  − Fixed (EMI / lease, insurance, permit, depreciation)
  = NET PROFIT per truck
```
- **Workshop tracking:** every job on a truck logs labour + each part (tyre, filter, brake) with cost
  and vendor → the truck's maintenance cost builds up automatically.
- **Tyre life tracking:** tyres by position, fitted-at-km, expected life → cost per km per tyre.
- Owner sees a **ranked list: most profitable → loss-making trucks**, and can drill into *why* (a truck
  bleeding on workshop cost, or one guzzling diesel).
This is the large-fleet holy grail: **know which trucks to keep, sell, or fix.**

---

## 7. The AI layer (across everything — grounded, not gimmicky)
AI in PariLink is an **insight & anomaly engine + a copilot**, always grounded on real data:
- **Anomaly feed:** diesel over-consumption, workshop cost spikes, a lane turning loss-making, papers
  expiring, a driver's score dropping.
- **Copilot:** ask the business anything ("which 10 trucks lost money last month?", "who's my worst
  diesel driver?") in Hindi/Gujarati or by voice — answered from real numbers, never invented.
- **Predictions (later):** expected maintenance due, fuel forecast, best truck for a lane.
Rule stays: AI never states a number it didn't get from a real query.

---

## 8. Feasibility for 200+ truck fleets
Targeting big fleets changes some things — plan for them:
- **Users & permissions:** a big office has many staff. The role/desk model (§1) + granular RBAC is the
  answer — each person sees only their desk. Support 20–50+ users per company.
- **Data volume:** 200 trucks × many trips/day × years of history = large tables. Index the hot queries
  (trips, fuel, ledger by company + date), paginate everything, and keep the tenant isolation (RLS)
  fast. Test with realistic volume, not 10 demo rows.
- **Performance:** dashboards must stay fast at scale — pre-aggregate the per-truck P&L and fuel stats
  (nightly job) rather than computing live every load.
- **Onboarding:** a 200-truck fleet has existing data in Excel/other software — provide **bulk import**
  (trucks, drivers, customers, opening balances) or they'll never switch.
- **Reliability:** at this size the fleet runs their business on you — backups, uptime, and the security
  gate (real tenant isolation, revoked keys) are non-negotiable before onboarding.

---

## 9. Pricing — ₹100 per truck / month
**Your model:** ₹100 per truck per month.

**What that means:**
- 200 trucks → **₹20,000/month** (₹2.4 lakh/year) per client.
- 500 trucks → ₹50,000/month. 1,000 trucks → ₹1,00,000/month.

**Positioning (this is a strong price):**
- ₹100/truck is **less than the cost of one puncture, or ~3 litres of diesel, per truck per month.** If
  PariLink catches even a few litres of diesel pilferage per truck, it pays for itself many times over.
- It's a **penetration price** — cheap enough that a 200-truck owner says yes without a committee. Win
  volume, then upsell Phase-2 modules.

**Watch-outs to keep it profitable:**
- Your **cost to serve one truck must be well under ₹100** (server, storage, support). At scale this is
  fine, but a handful of tiny fleets can be unprofitable — consider a **minimum (e.g. ₹5,000/month or
  50 trucks)** so small clients still cover their cost.
- Consider **annual billing** (₹1,000–1,100/truck/year) for cash flow and stickiness.
- Keep a clear **free trial / pilot** (e.g. 1 month or 20 trucks) to land clients.

---

## 10. Sequencing — what's launch vs the smart layer
Not all of this ships by Diwali. Be honest about order:
- **Launch (by Diwali):** trip desks, loading/unloading, proper bilty, per-truck cost capture (workshop
  + diesel + tolls), driver scoring, per-truck net profit. These need data *entry*, which you control.
- **The smart layer (needs history to be useful):** fuel/diesel-theft anomaly detection and predictions
  work best after a few weeks of real trips. **Build the data capture now, turn on the AI anomalies once
  there's data.** So design the fuel/cost fields into v1, and light up the intelligence right after.

**The pitch to a big owner:** *"PariLink shows you the real profit on every truck, and flags the diesel
and workshop leakage you can't see today — for ₹100 a truck. Catch one theft and it's already paid for."*
