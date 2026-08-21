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

## ⚠️ Breaking Changes

- **OAuth2 Token Migration:** `client_credentials` tokens have been migrated from signed JWTs to high-entropy opaque tokens. Existing issued tokens (JWTs) are now invalid and will return `401 Unauthorized`. Integrations must execute a new `client_credentials` grant exchange to obtain a valid opaque token.

## 🐛 Bug Fixes & Polish

- Fixed dropdown menu trigger types in the Super Admin dashboard.
- Removed legacy `seats` logic from Enterprise Admin testing suites, replacing it with the new `capacity` structures.
- Added visual skeleton loaders to prevent layout shifts during heavy data fetches.

---
*PariLink 2.0 is now ready for Staging Deployment and Customer Onboarding.*

## ⚠️ Data Loss — Q3 Gate (2026-08-21)

**OAuthClient fixture rows permanently lost.**
During Q3 security gate testing, an unfiltered `DELETE FROM "OAuthToken"; DELETE FROM "OAuthClient";` was executed to clean up test rows. At the time of execution, 4 OAuthClient records (created as test fixtures during the session) and 2 OAuthToken records were present in the database. These were not part of any seed file (`prisma/seed.ts` and `prisma/seed/marketplace.ts` contain no OAuthClient or IntegrationConnection creation). Re-running `npx prisma db seed` does not restore them.

**Impact:** No production OAuthClients existed; these were test fixtures. No customer data was affected. IntegrationConnectors (19 rows) were restored by the marketplace seed.

**Remediation:** Any OAuthClient entries needed for staging/demo purposes must be created manually via the `/iam/oauth/clients` API or a dedicated seed script. A seed script covering OAuthClient creation has NOT been added to `prisma/seed.ts` as part of this gate — this is a known gap to be addressed in a follow-up.
