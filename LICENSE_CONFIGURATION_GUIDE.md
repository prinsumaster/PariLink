# PariLink 2.0 — License Configuration Guide

**Audience:** PariLink Super Administrators  
**Version:** 2.0

---

## Overview

PariLink's licensing is capacity-based. Every customer gets identical features — the only variable is how many trucks, drivers, and users they can operate.

---

## Default Subscription Plans

| Plan | Code | Trucks | Drivers | Monthly (INR) |
|------|------|--------|---------|---------------|
| Starter | `STARTER` | 20 | 50 | ₹5,000 |
| Growth | `GROWTH` | 50 | 100 | ₹12,000 |
| Professional | `PROFESSIONAL` | 100 | 200 | ₹25,000 |
| Business | `BUSINESS` | 250 | 500 | ₹50,000 |
| Enterprise | `ENTERPRISE` | 500 | 1,000 | ₹1,00,000 |
| Enterprise Plus | `ENTERPRISE_PLUS` | 1,000 | 2,000 | ₹2,00,000 |
| Custom | `CUSTOM` | Unlimited | Unlimited | Negotiated |

---

## Managing Customer Licenses

### From the Subscription Center UI

1. Navigate to **Admin Console → Subscription Center**
2. Find the customer in the table
3. Click the **⋮ menu** next to the customer
4. Choose an action:
   - **Set Truck Limit** — change the vehicle capacity immediately
   - **Temporary Boost** — add temporary extra capacity with an expiry date
   - **Enable/Disable Unlimited** — remove all capacity restrictions

### From the API

#### Assign a Subscription Plan
```http
PUT /admin/licenses/assign-plan
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "subscriptionPlanId": "plan-uuid-here"
}
```

#### Override Truck Limit (Instant, No Plan Change)
```http
PUT /admin/licenses/trucks/limit
Authorization: Bearer <admin-token>

{
  "maxVehicles": 37,
  "reason": "Customer requested interim capacity increase"
}
```

#### Set Temporary Boost
```http
PUT /admin/licenses/trucks/boost
Authorization: Bearer <admin-token>

{
  "boostMaxVehicles": 150,
  "boostExpiresAt": "2026-09-30T23:59:59Z",
  "reason": "Seasonal peak — Diwali logistics"
}
```

#### Enable Unlimited Mode
```http
PUT /admin/licenses/unlimited
Authorization: Bearer <admin-token>

{
  "unlimited": true,
  "reason": "Custom enterprise contract signed"
}
```

---

## License Enforcement Behavior

When a customer reaches their truck limit:

1. `POST /vehicles` returns **HTTP 402 Payment Required**
2. Error response includes current count, limit, and upgrade URL
3. Existing vehicles are **never deleted or hidden**
4. Only **new vehicle creation** is blocked

---

## Understanding Usage Dashboard

The **License Usage Dashboard** at `/admin/licenses/usage` shows:

```json
{
  "capacity": {
    "vehicles": {
      "used": 87,
      "limit": 100,
      "effectiveLimit": 150,        ← includes active boost
      "utilizationPct": 58,
      "unlimitedMode": false,
      "boost": {
        "boostMaxVehicles": 150,
        "boostExpiresAt": "2026-09-30T23:59:59Z"
      }
    },
    "drivers": { "used": 120, "limit": 200, "utilizationPct": 60 },
    "users": { "used": 12, "total": 15, "limit": 50, "utilizationPct": 24 }
  }
}
```

---

## Audit Trail

All license changes are recorded with:
- Who made the change (admin user ID)
- What changed (before/after)
- When it changed (timestamp)
- Why (reason field)

View at **Admin Console → Audit Logs** — filter by action prefix `admin:license:`

---

## Frequently Asked Questions

**Q: Can a customer see how many trucks they have left?**  
A: Yes — the `LicenseUsageBanner` in their dashboard shows real-time usage.

**Q: What happens when a boost expires?**  
A: The limit automatically reverts to the base `maxVehicles` value. No manual action needed.

**Q: Can I change the price of a plan?**  
A: Yes — plan prices can be updated in the database. Contact engineering to update the Stripe price ID for billing sync.

**Q: What's the maximum truck limit we can set?**  
A: No hard maximum. You can set any integer value, or enable `unlimitedMode` to bypass all checks.
