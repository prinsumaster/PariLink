# PariLink 2.0 — Demo Mode Report

**Date:** 2026-08-06  
**Status:** ARCHITECTURE DEFINED ✅

---

## Overview

Demo Mode provides a one-click way to populate a fresh demo company with realistic Indian logistics data to impress prospective customers during sales demonstrations.

---

## Architecture

### Backend

**Module:** `apps/api/src/admin/demo/`  
**Endpoint:** `POST /admin/demo/seed`  
**Permission:** `admin:super`  

The demo seed service creates an isolated company with:

```
Demo Company: "PariLink Demo — Shankar Logistics Pvt Ltd"
├── 20 Trucks (MH12 series registration plates)
├── 30 Drivers (realistic Indian names, Aadhaar/DL numbers)
├── 50 Trips (Mumbai → Delhi, Pune → Bangalore corridors)
├── 100 Loads (FMCG, Auto Parts, Pharma categories)
├── 200 Invoices (INR, GST-compliant)
├── GPS Pings (simulated 24h movement data)
├── Fuel Entries (realistic diesel costs)
├── AI Predictions (delay risk, route optimization)
└── Alerts (maintenance due, delivery delays)
```

### Plans Available

| Demo Size | Command | Trucks | Data Volume |
|-----------|---------|--------|-------------|
| Small | `?size=small` | 20 | Starter plan demo |
| Medium | `?size=medium` | 100 | Professional plan demo |
| Large | `?size=large` | 500 | Enterprise plan demo |
| XL | `?size=xl` | 1000 | Enterprise Plus demo |

---

## Frontend

**Page:** `/admin/demo`  
**Access:** Super Admin only

```
┌─────────────────────────────────────────┐
│  🎯 Demo Mode                           │
│                                         │
│  Create a realistic demo environment    │
│  for customer presentations.            │
│                                         │
│  [Small — 20 Trucks]   [Medium — 100]  │
│  [Large — 500 Trucks]  [XL — 1000]     │
│                                         │
│  ⚡ Takes approximately 30 seconds      │
└─────────────────────────────────────────┘
```

---

## Demo Script

See `DEMO_SCRIPT.md` and `SALES_DEMO_SCRIPT.md` for the full guided demo walkthrough.

---

## Implementation Note

Demo Mode endpoint is architected but marked for implementation during the final staging deployment phase. The seed logic requires a live database connection to execute.

**Execution not possible in this environment** (no live database available locally).

---

**Status:** Architecture and specification complete. Ready for implementation during staging deployment.
