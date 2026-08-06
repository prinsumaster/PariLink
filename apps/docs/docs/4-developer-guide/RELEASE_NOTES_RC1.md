# Release Notes: RC1

## What's Included in Release Candidate 1

PariLink RC1 marks the first feature-complete, production-ready milestone for the Enterprise Logistics Platform. The core focus of this release was achieving strict system stability, eliminating critical blockers, enforcing tenant isolation, and verifying performance metrics under load.

### New Features & Architecture (Frozen)
- Multi-tenant architecture using PostgreSQL RLS (Row Level Security) and Prisma Context abstraction is fully deployed and verified.
- Complete Order-to-Cash (O2C) pipeline is stable, linking Dispatch, Fleets, Drivers, Loads, and Billing.
- Playwright UI tests and Jest E2E test environments are standardized for CI/CD environments.

### Bug Fixes & Security Patches
- **Critical Security Patch (BOLA)**: Fixed a severe Business Object Level Authorization vulnerability in `loads.service.ts` where cross-tenant records could be fetched and manipulated due to missing `companyId` constraints on updates and deletes.
- **Performance Defect Resolved**: Removed un-whitelisted DTO properties from `k6` test payloads which caused API validation layers to aggressively reject high-throughput transactions with 400 Bad Requests.
- **Jest E2E Initialization Fixed**: Resolved UUID package ESM resolution issues and dynamic tenant role association mapping that was failing integration tests locally.

### Technical Debt Addressed
- Fixed `access_token` casing inconsistencies across `performance/k6` test suites.
- Reduced strict mode Playwright locator violations to ensure deterministic testing.

---
**Deployment Instructions**
RC1 is certified for deployment to the staging environment. Proceed with the standard `docker-compose up --build -d` workflow. No manual database migrations are required beyond standard container boot logic.
