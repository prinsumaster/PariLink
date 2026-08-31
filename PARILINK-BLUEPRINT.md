# PariLink — Complete Product Blueprint

> One document that explains the entire PariLink product: what it is, who uses it, how the whole system
> works end to end, and what every module does. Any AI agent or developer should be able to read this
> once and understand how PariLink is meant to work. Keep this as the single source of truth.

---

## 1. What PariLink is (in one line)
**PariLink is the single software that runs an Indian transport company** — from booking a load to
getting paid to knowing the profit on every trip — built for fleet owners with 50 to 1,000 trucks.

It replaces the paper registers, WhatsApp chats, and Excel sheets that transport offices run on today,
and puts trucks, drivers, trips, bilties, invoices, payments, and profit into **one live screen the
owner can trust**.

Tagline: **Connect · Manage · Deliver.**

---

## 2. Who uses it (roles — the app is arranged around these people)
PariLink is NOT one giant menu. Each person sees a home screen built for their day:

- **Owner / Manager** — sees the whole business: profit per lane, cash position, who owes money, trucks
  running, papers expiring. The "how is my business doing right now" view.
- **Dispatch clerk / Traffic in-charge** — sees bookings, trips, which truck + driver is free, live
  tracking. Creates and runs trips.
- **Accountant / Munim** — sees invoices, payments, GST, ledger, outstanding dues. Raises bills,
  records payments.
- **Driver (mobile app)** — sees only his current trip: pickup, drop, POD upload, expenses. One-tap simple.
- **Customer (light portal / WhatsApp link)** — sees the tracking link and their invoices.

Access is controlled by **roles + permissions** (RBAC). `['*']` = full access (owner). Every screen and
action checks permission and fails closed.

---

## 3. The golden thread — how the whole system works end to end
This is the ONE flow everything else supports. Each step feeds the next automatically — no double entry:

```
BOOKING → LR / BILTY → DISPATCH (truck+driver) → LIVE TRACKING → POD → INVOICE (GST) → PAYMENT → LEDGER → PROFIT PER LANE
```

1. **Booking** — a customer gives a load (from A to B, goods, weight, rate).
2. **LR / Bilty** — the lorry receipt is generated (GST-ready, printable, sendable on WhatsApp).
3. **Dispatch** — a free truck + driver is assigned; the trip starts.
4. **Live Tracking** — the truck shows on an India map from origin to destination.
5. **POD** — on delivery, the driver uploads the proof (photo) from the mobile app.
6. **Invoice** — a GST invoice is raised from the trip (CGST/SGST or IGST, line items, PDF).
7. **Payment** — the customer pays (RTGS/NEFT/UPI); the balance updates.
8. **Ledger** — every invoice, payment, and expense posts double-entry accounting automatically.
9. **Profit per lane** — fuel + toll + driver bhatta + maintenance are subtracted from revenue, so the
   owner sees the real profit or loss on that route.

If any module doesn't feed the next one automatically, it's not finished.

---

## 4. The modules — what each one does and how it works

### CORE (the 12 that must work for launch)

**1. Dashboard (Owner home)**
The first screen. Shows today at a glance: trucks running, revenue this month, cash/outstanding,
profit-making vs loss-making lanes, papers expiring soon, alerts. Everything links deeper. This is the
"one number" view — the owner should understand his business in 5 seconds.

**2. Fleet / Vehicles**
Every truck: number (GJ-01-AB-1234), type, capacity, status (on-trip / idle / maintenance), odometer,
last known location, fuel, and papers (permit, insurance, FASTag, fitness) with expiry reminders.
Vehicle detail shows real telemetry, not zeros.

**3. Drivers**
Every driver: name, licence, phone, current status, assigned truck, safety score, trips completed,
on-time %. List shows the correct count (not "0 of 0"). Links to the driver's trips and attendance.

**4. Trips & Dispatch**
Create a trip: pick booking, assign truck + driver, set origin → destination. Shows the real India lane
on the map (real cities, never mock US ones). Trip lifecycle: scheduled → in-progress → completed.
This is the dispatch clerk's main screen.

**5. Live Tracking (Map)**
All active trucks on one India map with city pins and lanes. Reliable raster basemap (no blank tiles),
branded fallback if tiles fail. The customer gets a shareable tracking link.

**6. Invoices**
Raise a GST invoice from a trip: line items (freight, detention, loading), subtotal, CGST/SGST or IGST
(5% freight), grand total. Print / download PDF. GST tax-invoice format (GSTIN, HSN/SAC 9965). Status
(unpaid / partial / paid) is always consistent with the balance.

**7. GST**
The tax engine behind invoices: correct CGST/SGST (intra-state) vs IGST (inter-state), GST-compliant
invoice format, and GST summary for filing. India-specific and correct.

**8. Payments**
Record a payment against an invoice (RTGS / NEFT / UPI / cash), with reference and date. It reduces the
invoice balance and flips status. Shows received vs outstanding.

**9. Ledger & Finance**
Double-entry accounting posted automatically from invoices, payments, and expenses (e.g. invoice → Dr
Receivable / Cr Revenue + Cr GST). General ledger, trial balance, party ledger. Real journal entries,
never empty.

**10. Profitability**
The feature owners love. Profit or loss per trip and per lane: revenue − (fuel + toll + bhatta +
maintenance). Green = makes money, red = loses money. The answer to "which of my trucks is worth
running."

**11. Reports & Dashboard analytics**
Revenue vs expenses (monthly), fleet utilization (active/idle/maintenance), trips completed, top
customers, outstanding. Real charts fed real data — never blank, never "integration ready" placeholders.

**12. Documents**
Upload and store bilties, PODs, permits, insurance, bills (to MinIO/S3). Attach to trips, vehicles,
invoices. Upload actually works and the doc re-opens.

**+ Driver Mobile App (Android)**
The driver's simple companion: his current trip, pickup/drop, navigation, POD photo upload, trip
expenses. One-tap. Points at the API over the network. Installable APK.

### REMAINING REAL MODULES (by mid-project — round out daily use)

**13. Loads / Bookings** — the intake: customer, goods, from→to, rate, date. Becomes a trip.
**14. Lorry Receipt / Bilty** — generate + print the LR (the transport industry's core document).
**15. Fuel & Expenses** — log fuel, toll, bhatta, repairs per trip/truck; feeds profitability.
**16. Customers** — customer master + basic CRM: contacts, rates, history, outstanding.
**17. Vendors** — vendor/supplier master + payments (fuel pumps, mechanics, brokers).
**18. Maintenance** — service logs and schedules per truck; keeps trucks road-legal.
**19. FASTag / Tolls** — toll spends per truck, FASTag balance view.
**20. Permits** — permit/insurance/fitness records with expiry reminders (a missed date stops a truck).
**21. Trailers** — trailer master for fleets that run trailers separately from trucks.
**22. Branches** — multi-branch/office support for fleets operating from several locations.

### CUT FROM SCOPE (Phase 2 / upsell — NOT built now)
The ~60 enterprise/developer modules a transport owner never uses: digital-twin, marketplace, SDK/API
platform, BPM/MDM, EDI, factoring, broker, WMS/warehouse/yard, and the 20+ AI/intelligence engines.
These stay as internal code where needed but are off the product menu and roadmap until a paying client
asks. Chasing "all 118 modules" is the trap — the real product is these ~22.

---

## 5. What makes PariLink DIFFERENT (not just another TMS)
Every competitor has trips, invoices, and GST. These are the things that make an owner *choose* PariLink:

- **WhatsApp-first** — bilty as a WhatsApp PDF, a live tracking link the customer opens with no app,
  automatic payment reminders, and the owner's daily business summary delivered on WhatsApp every
  morning. Transporters live on WhatsApp; meet them there.
- **Profit-per-lane as the hero** — the "which truck makes money" answer on the home screen, not buried
  in a report.
- **AI Copilot, grounded + vernacular** — ask the business anything ("how many trucks are active?",
  "who owes me money?") in Hindi/Gujarati or by voice, answered from real data, never a wrong number.
- **Zero-training design** — built for the 55-year-old munim, not a software user. If it needs a manual,
  it's failed. Simplicity is the feature.
- **Arranged around the person, not the database** — role-based home screens (owner / dispatch /
  accountant / driver), not one giant menu of 22 modules.

---

## 6. Design principles (how it should LOOK and FEEL)
- **Brand:** near-black `#111418` + PariLink Red `#E4002B` on white/light. Real logo (P + truck) and
  the intro animation.
- **Indian by default:** ₹ formatting (lakh/crore), Indian dates, GST, bilty, bhatta, FASTag, GJ-01
  truck numbers, RTGS/NEFT.
- **Never show a blank or a zero as a dead-end** — every screen has real data or a helpful empty state.
- **Fast and clear** — a transport office is busy; screens load quickly and say exactly what to do.
- **Consistent** — one design system, light and dark, same components everywhere.

---

## 7. How it's built (tech, briefly)
- **Backend:** NestJS (Node 20) + Prisma + PostgreSQL with **Row-Level Security** for multi-tenant
  isolation (`runAsTenant(companyId)` vs `runAsSystem`). Redis/BullMQ for jobs. MinIO/S3 for files.
- **Frontend:** Next.js 16 (App Router) + React, Recharts for charts, maplibre-gl + react-map-gl for
  maps (OSM/CARTO raster tiles, no paid token).
- **Mobile:** React Native driver app.
- **Multi-tenant:** every company's data is isolated; the app DB role must be non-superuser so RLS is
  enforced (durable, proven on a clean rebuild).

---

## 8. The rules any agent must follow when building PariLink
1. **The screenshot is the gate.** A described result is not a result. "000" / "0 of 0" / a blank screen
   is never a pass. Prove every fix with a fresh screenshot.
2. **Never fake or mock data to fill a screen** — fix the seed data or the endpoint. Never weaken a
   guard, test, or check to make it pass.
3. **Every module must feed the next** (the golden thread) — no double entry, no dead ends.
4. **Security is not optional:** tenant isolation must be real (non-superuser role, proven on fresh
   `docker compose down -v`); the leaked provider keys are an **owner action** to revoke — never write
   fake keys.
5. **Scope discipline:** build the ~22 real modules well; do NOT build the cut ~60. Different beats more.
6. Commit per change; keep `tsc --noEmit` = 0; no dependency churn.

---

## 9. The one-paragraph summary (if you read nothing else)
PariLink runs an Indian transport company on one screen: a load is booked, a bilty is generated, a truck
and driver are dispatched and tracked on a live India map, the delivery proof is uploaded, a GST invoice
is raised and paid, the accounting posts itself, and the owner sees the real profit or loss on every
lane — with WhatsApp, a grounded AI copilot, and a zero-training design making it feel effortless. Build
the ~22 modules that a real fleet owner uses, make two or three things genuinely different, prove every
screen with a screenshot, and launch it stable and secure on **Diwali, 8 November 2026**.
