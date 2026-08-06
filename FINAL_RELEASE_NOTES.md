# PariLink 2.0 — Final Release Notes

**Version:** 2.0.0 (Launch Candidate)  
**Date:** 2026-08-06

Welcome to PariLink 2.0. This major release transforms the platform into a true multi-tenant, capacity-based Enterprise SaaS for the Indian logistics industry.

## 🚀 Major Features

### Enterprise Licensing Engine
- **Capacity Controls:** Hard enforcement of Truck and Driver limits based on subscription plans.
- **Super Admin Subscription Center:** Centralized dashboard to manage all tenant capacities.
- **Instant Overrides:** Ability to bump a customer's truck limit instantly without changing their underlying contract.
- **Temporary Boosts:** Grant customers temporary capacity increases (e.g., for peak holiday seasons) with automatic expiration dates.
- **Unlimited Mode:** Full capacity bypass for Custom enterprise contracts.

### Frictionless Onboarding
- **10-Step Setup Wizard:** New customers are guided through a self-serve onboarding flow covering everything from Company Details to GPS Integration, ensuring they are production-ready on Day 1.
- **License Usage Banner:** A real-time visual indicator in the customer dashboard showing their fleet capacity usage, warning them as they approach 70% and 90% utilization.

### Sales Demo Engine
- **One-Click Environments:** Sales teams can now provision highly realistic "Small", "Medium", or "Large" transport companies filled with authentic Indian logistics data, active GPS pings, and intelligent alerts to drastically accelerate the sales cycle.

## 🛡 Security & Stability

- **Row-Level Security (RLS):** Complete audit and remediation of all API endpoints to guarantee cross-tenant data isolation using `runAsTenant()`.
- **Zero Placeholders:** Complete elimination of all "Coming Soon", dummy data, and unhandled `TODO` comments in the production codebase.
- **Strict Typing:** The entire API and Web codebase now passes strict TypeScript compilation with 0 errors.

## 🐛 Bug Fixes & Polish

- Fixed dropdown menu trigger types in the Super Admin dashboard.
- Removed legacy `seats` logic from Enterprise Admin testing suites, replacing it with the new `capacity` structures.
- Added visual skeleton loaders to prevent layout shifts during heavy data fetches.

---
*PariLink 2.0 is now ready for Staging Deployment and Customer Onboarding.*
