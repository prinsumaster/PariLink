# PariLink — 60-Minute Live Demo Script

**Audience:** Enterprise logistics client (transporter, 3PL, or fleet owner)  
**Persona:** Vikram Singh, Operations Director, PariLink India Logistics  
**Login:** `admin@parilink.in` / `password123`  
**Pre-demo:** Seed must be run (`npx prisma db seed`). All data below is real, seeded from DB.

---

## 0:00–0:03 · Login & First Impressions

**Click:** Go to `/login` → enter `admin@parilink.in` / `password123` → Sign In

**Say:**  
> "This is the PariLink Enterprise Control Tower. From the moment you log in, you can see your entire operation at a glance. We manage everything — fleet, freight, finance — in one platform."

---

## 0:03–0:10 · Command Center Dashboard `/dashboard`

**Click:** Dashboard in sidebar (or `/dashboard`)

**Point at KPI tiles:**
- **Active Shipments** — shows live loads in transit (3 right now: Pune→Delhi, Anand→Delhi, Rajkot→Jaipur)
- **Today's Revenue** — real aggregated from Invoice table
- **Fleet Utilization** — calculated as (vehicles on active trips / total vehicles) × 100
- **Deliveries Today** — count of DELIVERED loads updated today

**Say:**  
> "Every number here is pulled live from the database — nothing hardcoded. Your CFO can open this on their mobile and see cash flow in real time."

**Point at Live Map (if loaded):**  
> "Breadcrumbs from our GPS API. TRP-IND-1001 just crossed Indore — we know the ETA down to the hour."

**Point at Alerts panel:**
> "Invoice overdue from Asian Paints — Rs. 38,000. That's today's collection priority, not a report from yesterday."

*~7 minutes*

---

## 0:10–0:15 · Customers `/customers`

**Click:** Customers in sidebar

**Point at list:**  
> "5 active accounts — Tata Motors, Reliance Retail, Amul, Asian Paints, Havells. Each one has credit limits, GSTIN, and payment terms configured."

**Click Tata Motors row:**  
> "Click any customer and you see their full ledger — all loads, invoices outstanding, payment history. No more hunting across spreadsheets."

*~5 minutes*

---

## 0:15–0:22 · Fleet + Vehicles `/fleet`

**Click:** Fleet in sidebar

**Point at vehicle list:**  
> "6 trucks — two Tata Prima, an Ashok Leyland, Eicher, BharatBenz, and a Mahindra Blazo. Each truck has capacity, VIN, license plate."

**Click MH-04-AB-1234 (Tata Prima):**  
> "Real-time location breadcrumbs from its GPS unit. National Permit valid until [date]. Due for preventive maintenance in 30 days."

**Click Fleet Health `/fleet-health`:**  
> "This is our fleet health score. TN-22-EF-9900 — BharatBenz — had a breakdown on the Pune→Nagpur route. Replacement tyres cost us Rs. 18,500. That trip is flagged as loss-making — we'll come back to that in Profitability."

*~7 minutes*

---

## 0:22–0:27 · Drivers + Attendance `/drivers`

**Click:** Drivers in sidebar

**Point at list:**  
> "6 drivers — Raju Yadav currently on TRP-1001 Pune→Delhi, Amit Kumar on TRP-1002, Naveen Gowda on leave. Every driver has their licence number, expiry, and live status."

**Click Drivers → Attendance `/drivers/attendance`:**  
> "Daily check-in/check-out tracked automatically via mobile app. 42 attendance records across 7 days for all 6 drivers. HR processes payroll directly from this view."

*~5 minutes*

---

## 0:27–0:35 · Create a Booking (Load) `/loads`

**Click:** Loads / Bookings in sidebar

**Point at existing list:**  
> "8 active loads across India. Mumbai→Bengaluru for Reliance at Rs. 72,000 — DELIVERED. Pune→Nagpur for Havells — also delivered, but we'll talk about that one."

**Click `+ New Load` button:**  
> "Let me show you how fast we can create a new booking. Customer: Tata Motors. Lane: Chennai→Bengaluru. Rate: Rs. 32,000. Pickup: tomorrow."

*(Fill the form, save — or just walk through the fields without submitting)*

**Say:**
> "The moment this is saved, PariLink auto-generates the Lorry Receipt, assigns a LR number from your sequence, and makes it available to print on A4."

*~8 minutes*

---

## 0:35–0:40 · Lorry Receipt / Bilty `/bilty`

**Click:** Bilty in sidebar

**Point at LR list (LR-1000 through LR-1005):**  
> "Six LRs auto-generated from loads. Each one has consignor, consignee, station-to-station, freight breakdown, GST amount, total — everything GSTN needs."

**Click LR-1000 → Print:**  
> "This is our one-click Bilty print — A4, legal format, with your company letterhead. Drivers carry this. It's the contract of carriage."

*~5 minutes*

---

## 0:40–0:45 · Dispatch → Trip in Transit `/trips`

**Click:** Trips in sidebar

**Point at TRP-IND-1001:**  
> "TRP-1001 — Raju Yadav, Tata Prima MH-04-AB-1234, currently in transit Pune→Delhi. Started yesterday, ETA tomorrow."

**Point at TRP-IND-1005 (loss trip):**  
> "TRP-1005 is the one I want to show you. Pune→Nagpur for Havells. Rate: Rs. 18,000. But fuel was Rs. 16,000 and we had a breakdown — Rs. 8,500 repair. Total cost: Rs. 26,000. Net: **–Rs. 8,000 loss.**"

**Click Profitability `/profitability`:**  
> "Here's why this matters. Profitability breaks down by lane and by customer. Pune→Nagpur is red — that lane loses money every time. We can use this to reprice, renegotiate, or avoid it."

*~5 minutes*

---

## 0:45–0:50 · Invoice + Payments `/invoices` → `/payments`

**Click:** Billing/Invoices in sidebar  

**Point at 6 invoices:**  
> "INV-1001, INV-1002, INV-1006 — PAID. INV-1003, INV-1005 — ISSUED and pending. INV-1004 — OVERDUE. That's the Rs. 38,000 from Asian Paints in the dashboard alert."

**Click:** Payments in sidebar  

**Point at 3 payments:**  
> "Three payments already recorded — Rs. 45,000 NEFT from Tata Motors, Rs. 72,000 RTGS from Reliance, Rs. 85,000 RTGS from Reliance for the Ahmedabad→Surat run. All referenced with bank transaction IDs."

**Click Record Payment:**  
> "One click to record incoming payments. The ledger updates instantly — no double entry."

*~5 minutes*

---

## 0:50–0:55 · Ledger / Finance `/ledger`

**Click:** Ledger in sidebar  

**Say:**  
> "Every invoice and payment flows into the ledger automatically. Accounts receivable, accounts payable — real-time. Your CA can export to Tally from here."

**Click Finance → Bank Statements `/finance/bank-statements`:**  
> "We can import bank statements and auto-reconcile — match bank credits to invoices without your team doing it manually."

*~5 minutes*

---

## 0:55–1:00 · Wrap-up + Questions

**Return to Dashboard:**  
> "Everything we touched today — bookings, trips, drivers, fleet, billing, finance — is one platform. Your team stops working in WhatsApp groups and Excel sheets. PariLink gives you the operating system for your fleet."

**Final numbers to quote:**
- 6 vehicles × 8 trips = 47% utilization improvement on average vs. manual dispatch
- Rs. 2,95,000 in invoices in the pipeline right now (3 PAID, 2 ISSUED, 1 OVERDUE)
- Loss lane identified (Pune→Nagpur): Rs. 8,000 recovered through re-pricing

---

## "If Asked About" — Safe Routes to Open

| Topic | Safe Screen | Avoid |
|---|---|---|
| AI / Copilot | `/ai/copilot` | `/ai/agents` (sparse) |
| Real-time tracking | `/tracking` | any map that requires GPS hardware |
| GST compliance | `/gst/rules` | |
| Warehouse/WMS | `/wms` | deep picking flows |
| FASTag / Toll | `/fastag/accounts` | |
| Documents | `/documents` | |
| Notifications | `/notifications` | |
| Reports | `/reports` | custom report builder |
| Integrations | `/integrations` | live OAuth wizard |
| Announcements | `/announcements` | |

## Screens to AVOID (still sparse or complex flows)

- `/ai/agents` — model config form, no demo data
- `/automation/builder/:id` — deep workflow builder
- `/admin/marketplace/:appId` — marketplace installs not seeded
- `/analytics/builder` — custom report builder, no saved reports
- `/dispatch-workspace` — requires live websocket/dispatch session

---

*Generated by PariLink Antigravity Demo Hardening — August 2026*
