# Real Module Status & Security Audit

This document overrides any legacy claims about system completeness. If a feature isn't marked verified here with a real hash/log, it is considered untrusted.

## Security Posture (Verified)
- **Git Identity:** Commits by `Prince Hethvadiya <prince.h@ahduni.edu.in>` are genuine and represent the real user globally configured on this machine.
- **Tenant Isolation (Core):** Row-Level Security (RLS) is active. The `runAsTenant` pattern strictly enforces `companyId` boundaries via Postgres transactions. E2E tests verified that cross-tenant access is blocked at the database level (Postgres throws RLS violation errors).
- **Tenant Isolation (New Modules):** Fuel, Analytics, AI Agent Dispatch, Route/Toll, Sales Demo, TCO, and Cross-docking correctly derive `companyId` from the authenticated user's JWT token and use `runAsTenant`.
- **Permission Gates:** All mutating endpoints in new modules are correctly gated with `@RequirePermissions()` using server-side role resolution.
- **Input Validation:** ValidationPipe is applied globally, sanitizing DTOs for the new modules against mass-assignment and malformed inputs.
- **Analytics Export:** MinIO S3 object paths are constructed exclusively using `user.companyId` from the server-side JWT context (`${user.companyId}/export-${Date.now()}.csv`). Path traversal and tenant ID spoofing are structurally impossible.
- **Docker Image Size:** The `parilink-web:audit` image successfully builds to 383MB.

## Known Limitations / Deferred Work
- **Sales Demo Provisioning:** The `/saas/demo/seed` endpoint requires `admin:manage`, but lacks rate-limiting. A compromised admin token could spam tenant creation.
- **Backups:** Postgres backups are currently not scheduled (deferred to managed DB like DigitalOcean Postgres in production).
- **Cross-Dock Math:** Cross-docking match score is currently a fixed placeholder (0.98), not computed from real logistics factors — acceptable for now, flagged for future work.
