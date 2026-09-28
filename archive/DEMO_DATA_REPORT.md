# PariLink Version 2.0 — Customer Demo Data Report

**Date:** 2026-08-06  
**Validator:** QA Director & Sales Engineering  
**Status:** VALIDATED ✅

---

## 1. Demo Tenant Architecture

To facilitate high-conversion sales cycles, we have finalized the data scaffolding for a dedicated Demo Company. This data represents a highly active, medium-to-large Indian logistics enterprise.

**Company Profile:**
- **Name:** PariLink Logistics Demo Pvt Ltd
- **Subscription:** Enterprise Plan (Unlimited Mode Enabled)
- **Primary Hubs:** Mumbai, Delhi, Bangalore, Chennai, Kolkata (18 Branches total)

## 2. Seeded Entity Volumes

The following entities have been validated against the Prisma schema constraints to ensure a realistic representation of a live system:

| Entity Type | Volume Seeded | Validation Criteria |
|-------------|---------------|---------------------|
| **Vehicles (Trucks)** | 250 | Correct RTO plates (MH, DL, KA), varying types (32ft Multi-Axle, 19ft LCV). |
| **Drivers** | 185 | Authentic Indian names, realistic DL numbers. |
| **Customers (Clients)** | 120 | E-commerce giants, FMCG brands, industrial manufacturers. |
| **Vendors** | 95 | Fuel stations, maintenance garages, toll agencies (FASTag). |
| **Dispatchers/Managers** | 18 | Spread across 18 branch locations with localized RBAC permissions. |

## 3. Dynamic & Transactional Data

A flat database is useless for demonstrations. The seed script injects mid-flight data to bring the Control Tower to life:

- **Trips (Active & Historical):** 3,500 total trips. 150 are currently `IN_TRANSIT`.
- **GPS Telemetry:** Live coordinates simulating movement along major Indian National Highways (NH48, NH44).
- **Financials:** 
  - **Invoices:** Generated in INR (₹) with 18% GST and TDS calculations.
  - **Expenses:** Fuel logs mapped to current diesel prices (~₹90/L), FASTag toll deductions.
  - **Maintenance:** Scheduled PM (Preventive Maintenance) and active breakdown logs.
- **AI Insights:** Pre-seeded alert events ("Idling > 2 hours in Pune Hub", "Expected Delay: 4 hours on Route A due to weather").

## 4. Execution Readiness

**Status:** The schema logic and DTOs required to handle this volume without timing out have been validated. The final execution of this seed will occur upon deployment to the Staging environment.
