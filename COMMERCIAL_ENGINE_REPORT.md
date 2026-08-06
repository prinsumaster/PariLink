# PariLink 2.0 — Commercial Engine Report

**Date:** 2026-08-06  
**Status:** DEPLOYED ✅

This report summarizes the commercial capabilities embedded within PariLink 2.0.

---

## 1. Monetization Strategy
PariLink relies on a **Capacity-Based SaaS Model**. All customers have access to the same core enterprise modules (Dispatch, Fleet, Finance, App). Differentiation is based entirely on the number of trucks and drivers managed.

## 2. Capacity Controls
The commercial engine enforces limits dynamically based on the customer's `TenantConfig`.

- **Hard Limits:** New vehicle creation is blocked with an HTTP 402 error if the fleet size exceeds the licensed capacity.
- **Visual Nudges:** The UI provides color-coded usage bars (Green, Amber at 70%, Red at 90%) to encourage upgrades before hard limits are hit.
- **Graceful Escalations:** Existing data is never locked or deleted. Limits only apply to the addition of new assets.

## 3. Administrative Flexibility
Sales and Support teams require flexibility. The commercial engine provides:
- **Instant Overrides:** Increase a customer's truck limit without altering their base contract.
- **Capacity Boosts:** Grant temporary additional capacity (e.g., for seasonal spikes) that automatically expires and reverts.
- **Unlimited Mode:** Completely bypass limits for VIP or Custom-tier enterprise clients.

## 4. Analytics
Super Admins have access to a centralized dashboard showing all tenants, their current plan, and real-time truck/driver utilization. This data is critical for Customer Success teams to identify upsell opportunities (e.g., customers hovering at 95% capacity).
