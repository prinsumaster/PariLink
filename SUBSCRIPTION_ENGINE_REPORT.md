# PariLink 2.0 — Enterprise Licensing Engine
# Subscription Engine Report

**Date:** 2026-08-06  
**Engineer:** Principal Platform Engineer  
**Status:** IMPLEMENTED ✅

---

## Overview

The PariLink Enterprise Licensing Engine controls operational capacity for every customer tenant. Every customer receives identical PariLink features — the only commercial difference is their licensed operational capacity (number of trucks, drivers, users, storage).

---

## Architecture

```
Customer Creates Vehicle
         ↓
LicenseCapacityGuard (POST /vehicles)
         ↓
 Reads TenantConfig:
   - unlimitedMode?  → ALLOW
   - boostExpiresAt in future? → use boostMaxVehicles
   - else → use maxVehicles
         ↓
 Count current vehicles (deletedAt: null)
         ↓
 count >= limit?
   YES → HTTP 402 Payment Required
   NO  → ALLOW
```

---

## Subscription Plans

| Plan | Code | Trucks | Drivers | Price (INR/mo) |
|------|------|--------|---------|----------------|
| Starter | STARTER | 20 | 50 | ₹5,000 |
| Growth | GROWTH | 50 | 100 | ₹12,000 |
| Professional | PROFESSIONAL | 100 | 200 | ₹25,000 |
| Business | BUSINESS | 250 | 500 | ₹50,000 |
| Enterprise | ENTERPRISE | 500 | 1,000 | ₹1,00,000 |
| Enterprise Plus | ENTERPRISE_PLUS | 1,000 | 2,000 | ₹2,00,000 |
| Custom | CUSTOM | Unlimited | Unlimited | Custom |

> **These are defaults only.** Super Admin can override any customer's limit at any time without changing their plan.

---

## Database Schema Changes

### `TenantConfig` — New Fields

```prisma
maxVehicles      Int       @default(20)   // Truck/vehicle capacity limit
maxDrivers       Int       @default(50)   // Driver capacity limit
unlimitedMode    Boolean   @default(false) // Admin override — bypasses all checks
boostExpiresAt   DateTime?               // Temporary boost expiry
boostMaxVehicles Int?                    // Override limit during boost period
```

### `SubscriptionPlan` — New Fields

```prisma
planCode           String  @default("STARTER")
defaultMaxVehicles Int     @default(20)
defaultMaxDrivers  Int     @default(50)
```

---

## API Endpoints (Enterprise Licensing)

All endpoints are under `/admin/licenses` and require `admin:license:write` permission.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/licenses` | Full license overview with capacity stats |
| `GET` | `/admin/licenses/usage` | Real-time usage dashboard |
| `GET` | `/admin/licenses/plans` | List all subscription plans |
| `GET` | `/admin/licenses/tenants` | [Super Admin] All tenants with license summary |
| `PUT` | `/admin/licenses/assign-plan` | Assign plan (sets capacity from plan defaults) |
| `PUT` | `/admin/licenses/trucks/limit` | **Override truck limit instantly** |
| `PUT` | `/admin/licenses/drivers/limit` | Override driver limit instantly |
| `PUT` | `/admin/licenses/trucks/boost` | Set temporary capacity boost with expiry |
| `PUT` | `/admin/licenses/unlimited` | Toggle unlimited mode on/off |

---

## License Enforcement

### Vehicle Creation Enforcement

```
POST /vehicles
  → JwtAuthGuard (authenticated)
  → PermissionsGuard (vehicles:create)
  → LicenseCapacityGuard (@CheckCapacity('vehicle'))
  → VehiclesService.create()
```

**HTTP 402 Response when limit exceeded:**
```json
{
  "statusCode": 402,
  "error": "License Limit Reached",
  "message": "Your current plan allows a maximum of 100 vehicles. You have reached this limit (100/100).",
  "code": "LICENSE_CAPACITY_EXCEEDED",
  "resourceType": "vehicle",
  "currentCount": 100,
  "effectiveLimit": 100,
  "upgradeUrl": "/billing/upgrade"
}
```

### Important: Existing Data is Never Deleted

Only **creation** of new assets is blocked when the limit is reached. Existing vehicles, drivers, and data are never modified or deleted.

---

## Admin Override Examples

### Instant Truck Limit Override
```
PUT /admin/licenses/trucks/limit
{ "maxVehicles": 37, "reason": "Customer requested extra capacity" }
```
Takes effect **immediately**. No plan change. Fully audited.

### Temporary Boost
```
PUT /admin/licenses/trucks/boost
{ "boostMaxVehicles": 150, "boostExpiresAt": "2026-09-01T00:00:00Z" }
```
Boost active until expiry date. Automatically reverts to base limit.

### Unlimited Mode (Custom Plan Customers)
```
PUT /admin/licenses/unlimited
{ "unlimited": true }
```
Bypasses all capacity checks. Use for Custom plan customers.

---

## Frontend: Super Admin Subscription Center

**Location:** `/admin/subscriptions`  
**Access:** `SUPER_ADMIN` role only

**Features:**
- Customer list with real-time vehicle/driver usage bars
- Color-coded: green (< 70%), amber (70-89%), red (≥ 90%)
- Per-customer actions: Set Truck Limit, Temporary Boost, Toggle Unlimited
- Modal dialogs for each action with validation
- Plan badges (Starter → Custom) with color coding

---

## Frontend: License Usage Banner

**Component:** `<LicenseUsageBanner />`  
**Refresh:** Every 60 seconds  

Shows in the dashboard sidebar:
- `182 / 250 Trucks` with visual progress bar
- Warning state at 70%+ 
- Critical state at 90%+ (red, with upgrade link)
- Boost indicator when boost is active
- Unlimited mode indicator (∞)

---

## Audit Trail

Every licensing action is recorded in `AuditLog` with:
- Action: `admin:license:set_truck_limit` / `admin:license:set_boost` / etc.
- Before/after values
- Admin user ID
- Timestamp
- Reason (optional free text)

---

## Verification

```bash
# Schema validation
npx prisma validate
# ✅ The schema at prisma/schema.prisma is valid 🚀

# Prisma client generation
npx prisma generate
# ✅ Generated Prisma Client (v5.22.0)

# API typecheck
npx tsc --noEmit
# ✅ 0 errors

# API build
nest build
# ✅ BUILD COMPLETE
```
