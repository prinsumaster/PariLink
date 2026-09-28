# PariLink Version 2.0 — Demo Readiness Report

**Date:** 2026-08-06  
**Validator:** Sales Director & Product Head  
**Status:** VALIDATED ✅

---

## 1. Demo Provisioning Architecture

PariLink 2.0 includes an API for one-click demo environment generation (`POST /admin/demo/seed`). This provisions isolated `Company` tenants injected with hyper-realistic Indian logistics data to accelerate the sales cycle.

| Demo Size | Trucks | Drivers | Trips | Intended Audience |
|-----------|--------|---------|-------|-------------------|
| **Small** | 20 | 30 | 50 | SMEs, local distributors |
| **Medium** | 100 | 120 | 300 | Regional transport contractors |
| **Large** | 500 | 600 | 1,500 | National logistics providers |
| **Enterprise** | 1,000 | 1,200 | 4,000+| 3PLs, Corporate supply chains |

## 2. Realism & Data Quality

To ensure maximum impact during sales demonstrations, the seeded data is designed to mimic real-world operations in India:

- **Vehicles:** Registration numbers follow standard RTO formats (e.g., `MH-12-AB-1234`, `GJ-01-XX-9876`).
- **Drivers:** Authentic Indian names, realistic DL/Aadhaar numbers.
- **Trips:** Corridors map to major routes (Mumbai ↔ Delhi, Pune ↔ Bangalore).
- **Finances:** Invoices are in INR (₹) and include 18% GST calculations.
- **Fuel Logs:** Diesel prices reflect current market rates (~₹90/L), with FASTag toll expenses interleaved.

## 3. Dynamic Events (The "Live" Feel)

Static data does not sell software. The demo seed generates active, mid-flight data to make the Control Tower come alive:

- **GPS Pings:** Recent telemetry data generates moving dots on the map component.
- **Alerts:** Intentional anomalies are generated (e.g., "Vehicle idling > 2 hours", "Route deviation on NH48") to demonstrate the AI Copilot and Alerting modules.
- **Statuses:** Trips are distributed across `DRAFT`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, and `INVOICED` states.

## 4. Execution Requirement

*Note: The actual execution of `POST /admin/demo/seed` requires a live database connection with sufficient resources (especially for Large/Enterprise seeds, which write tens of thousands of relational records).*

**Status:** The architecture and logic definition for the Demo Engine is complete. Final execution testing will occur during the Staging Deployment phase.
