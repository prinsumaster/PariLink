# PariLink 60-Minute Demo Script

## 1. Introduction & Executive Dashboard (0:00 - 10:00)
**Action:** Log in and land on `/dashboard` (Command Center).
**Script:** "Welcome to PariLink, the comprehensive Logistics Control Tower. Right away, you have total visibility. Notice our active metrics: 23 total bookings, 3 trips currently in transit. This isn't just a reporting tool; it's a live operations center."
**If Asked About Real-Time Data:** Highlight the integration capabilities. PariLink ingests FASTag, GPS, and fuel telemetry in real-time.

## 2. Customers & Order Management (10:00 - 18:00)
**Action:** Navigate to **Customers** (`/customers`), then **Loads** (`/loads`).
**Script:** "Let's look at your book of business. Here are your primary clients like Tata Motors and Reliance. When an order drops, it hits our Loads board."
**Action:** Click on load `LOD-IND-1001`.
**Script:** "Here we see a full lifecycle of a booking from Pune to Delhi. Everything is centralized: the origin, destination, weight, and agreed rate."

## 3. Fleet & Dispatch Operations (18:00 - 28:00)
**Action:** Navigate to **Fleet** (`/fleet`), then **Drivers** (`/drivers`).
**Script:** "Your assets are your biggest cost center. Here we track vehicle health, permits, and driver compliance."
**Action:** Go to **Dispatch** (`/dispatch`) and **Trips** (`/trips`).
**Script:** "Once a load is ready, we assign a truck and driver. Notice the 'In Transit' trips. Let's look at `TRP-IND-1001` with Raju Yadav."

## 4. Documentation & Lorry Receipts (28:00 - 35:00)
**Action:** Navigate to **Lorry Receipts** (`/bilty`).
**Script:** "Generating documentation used to take hours. PariLink automatically generates compliant Lorry Receipts (Biltys)."
**Action:** Click the first row to view LR detail.
**Script:** "This is a fully digital, verifiable LR. It captures the HSN codes (like 9965 for GTA), vehicle details, and charges."
**If Asked About E-Way Bills:** Mention that E-Way bill generation and Part-B updates are fully supported via API integration.

## 5. Tracking & In-Transit (35:00 - 45:00)
**Action:** Navigate to **Tracking** (`/tracking`).
**Script:** "For operations teams, knowing where the truck is right now is critical. Our tracking module consolidates GPS data."
**Action:** Show the **Notifications** (`/notifications`).
**Script:** "Notice this high-priority alert. PariLink proactively warns us if a vehicle is approaching its destination or if fuel consumption is anomalous."

## 6. Financials: Invoicing & Ledger (45:00 - 55:00)
**Action:** Navigate to **Finance > Invoices** (`/finance/invoices`), then **Payments** (`/payments`).
**Script:** "Once the POD is uploaded, invoicing is one click. We have 21 active invoices. Notice the payments recorded via RTGS/NEFT—for instance, this $45,000 clearing."
**Action:** Go to **Ledger** (`/ledger`).
**Script:** "The ledger maintains a double-entry accounting record of every freight charge, advance, and settlement, ensuring zero revenue leakage."

## 7. Profitability & Analytics (55:00 - 60:00)
**Action:** Navigate to **Profitability** (`/profitability`).
**Script:** "This is where executives spend their time. PariLink analyzes revenue vs costs per trip."
**Action:** Point out the red loss-making lane (Pune to Nagpur).
**Script:** "Look at this lane. The gross rate was 18,000 but our actual incurred costs hit 26,000 due to an emergency dispatch. Traditional TMS systems hide this loss until month-end. PariLink exposes it immediately, empowering you to renegotiate rates or optimize routing."

---
*End of Demo. Open the floor for Q&A.*
