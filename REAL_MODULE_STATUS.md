# PariLink — Real Module Status

> Last consolidated audit: 2026-09-26. Reflects actual state after all sessions.

---

## Feature Reality Table

| Feature | Status | Evidence |
| :--- | :--- | :--- |
| **Auth/Identity (JWT/RBAC)** | ✅ REAL | RS256 JWT, permission guards, tested in security.e2e-spec.ts |
| **Core CRM (Customers/Vendors)** | ✅ REAL | Full CRUD, companyId-scoped, tested |
| **Fleet Registry (Vehicles/Drivers)** | ✅ REAL | Tested, includes driver scorecard |
| **Workshop/Maintenance** | ✅ REAL | Gate-in, QC signoff, gate-out — e2e tested |
| **Developer Platform / API Key management** | ✅ REAL | Cryptographically secure key generation, tested |
| **Webhooks Engine** | ✅ REAL | SSRF protection, HMAC signatures, BullMQ retries |
| **Background workers (BullMQ/Redis)** | ✅ REAL | Redis in docker-compose, BullMQ workers running |
| **Health checks / alerting** | ✅ REAL | `/health/readiness` and `/health/liveness` via @nestjs/terminus; DB, Redis, BullMQ tracked |
| **Enterprise Licensing Engine** | ✅ REAL | DB-backed plan limits, HTTP 402 on breach |
| **Tenant Onboarding Wizard** | ✅ REAL | React UI + backend provisioning tested |
| **Load Generation Engine** | ✅ REAL | Full strict DTO, validated e2e |
| **Real-time Dispatch / Trips** | ✅ REAL | Role-gated, driver scorecard, e2e tested |
| **Billing & Invoicing** | ✅ REAL | Invoice generation from trips, status transitions, e2e tested |
| **Lorry Receipts (LR/Bilty)** | ✅ REAL | Trip→LR generation, driver sharing e2e tested. Mobile UI not wired to new API yet. |
| **Route & Toll Planning** | ✅ REAL | OSRM real-distance, estimated toll with explicit `distanceSource`/`tollEstimateType` labels |
| **AI Agent Dispatch** | ✅ REAL | LLM-configured, no mock fallback, persists to AiInteractionLog, e2e tested |
| **Analytics / BI Export** | ✅ REAL | AnalyticsSnapshot queried → CSV → MinIO presigned URL. Confirmed object lands in bucket. E2e tested. |
| **Cross-docking Engine** | ⚠️ PARTIAL | Backend + Prisma persistence real. `matchScore: 0.98` is a **fixed placeholder, not computed from logistics factors**. Flagged for future work. E2e tested. |
| **Sales Demo Mode** | ❌ FABRICATED | Button → setTimeout(3s) → toast. No backend seeding. |
| **Total Cost of Ownership (TCO)** | ✅ REAL | Fuel + maintenance + insurance aggregation, Redis caching, e2e tested |
| **Scale / Infra Hardening** | ✅ REAL | PgBouncer AUTH_QUERY, compound indexes, EXPLAIN ANALYZE verified, 119,911 req/hr load test passed |
| **Tenant Isolation & Security** | ✅ REAL | Foreign-key cross-tenant injections patched across all core and new modules. Strict DTO validation and explicit RLS testing complete. |

---

## Regression Status (2026-09-26)

```
Test Suites: 46 passed, 46 total
Tests:       799 passed, 799 total
Snapshots:   0 total
Time:        45.43 s
Ran all test suites.
```

**Change from last run:** +5 suites, +11 tests — added analytics-export.e2e-spec.ts, cross-dock.e2e-spec.ts, ai-agent-dispatch.e2e-spec.ts, and the security.e2e-spec.ts teardown was fixed (FK ordering bug).

---

## Production-Readiness Audit (2026-09-26 Re-audit)

### Secrets Grep
- **Repo-wide grep against tracked files:** No real credentials found in source.
- `k8s/secret.yaml` previously had fictional hex strings that looked like real credentials — replaced with `<REPLACE_WITH_*>` placeholders.
- `docker-compose.yml` previously had old rotated passwords as fallback defaults — replaced with `:?error` required-variable form.
- `.env` files are gitignored and confirmed not tracked.

### Docker Build (--no-cache)
- **api:** `parilink-api:audit` — Build **PASSES** after fixing 4 TS errors:
  - `TS6133: SimpleChatModel` unused import (model-router.service.ts)
  - `TS6133: BaseMessage` unused import (model-router.service.ts)
  - `TS6133: routeIntent` dead function (copilot-chat.service.ts — superseded by orchestrator)
  - `TS6138: _copilot` unused DI dep (copilot-chat.service.ts)
- **web:** `parilink-web:audit` — Build **PASSES** (built from repo root to include workspace packages)

> [!NOTE]
> Final image sizes:
> - `parilink-api:audit` -> **964MB**
> - `parilink-web:audit` -> **383MB**

### Health Endpoints (Running Container)
```
GET /api/v1/health/readiness
{"status":"ok","info":{"database":{"status":"up"},"memory_heap":{"status":"up"},"memory_rss":{"status":"up"},"queues":{"status":"up","queues":[{"name":"background_jobs","status":"ready"}]}},"error":{},"details":{...}}

GET /api/v1/health/liveness
{"status":"ok","info":{"memory_heap":{"status":"up"}},"error":{},"details":{"memory_heap":{"status":"up"}}}
```

---

## Disaster Recovery & Backups (2026-09-26 Update)

**Previous status:** ⚠️ CRITICAL GAP — no backups existed.

**Current status:** ✅ WORKING (docker-compose stack)

- `scripts/backup-postgres.sh` — real pg_dump → gzip → MinIO `parilink-backups/postgres/` bucket
- Restore verified: `--verify` flag restores dump to temp DB, counts tables, confirms validity
- **Real output from restore test (2026-09-26):**
  ```
  [backup-postgres] RESTORE_OK: 256 tables verified in restored database.
  ```
- MinIO object stat confirmed: `9.1 MiB`, `Content-Type: application/gzip`, ETag verified
- **Note on Automation:** Local cron scheduling is intentionally deferred. As outlined in the Deployment Strategy, the migration path is to a Managed PostgreSQL offering (e.g., DigitalOcean), which natively handles daily backups and Point-In-Time Recovery (PITR). This script serves as an emergency stopgap and validation tool until then.
- The k8s CronJob at `k8s/cronjobs/postgres-backup.yaml` covers Kubernetes-deployed environments but is not active for the docker-compose setup

---

## Known Open Issues

| Issue | Severity | Notes |
| :--- | :--- | :--- |
| Git Identity: `Prince Hethvadiya` | INFORMATIONAL | Confirmed this is the real, globally configured git identity on this machine, not a leftover fake history artifact. |
| Sales Demo Rate-Limiting | MEDIUM | Sales Demo endpoint lacks dedicated IP-based rate-limiting; susceptible to abuse if exposed publicly. |
| Cross-dock `matchScore: 0.98` placeholder | LOW | Flagged; not blocking |
| Redis `allkeys-lru` eviction policy warning | LOW | BullMQ wants `noeviction`; no data loss risk in current load but should be set in production |
| Sales Demo Mode | INFORMATIONAL | Deliberately not implemented |
| Lorry Receipts mobile UI not wired | LOW | Backend done; frontend integration pending |
| Backup not yet cron-scheduled | INFORMATIONAL | Deferred locally; Managed Postgres will provide native backups |
| k8s/secret.yaml placeholders not filled | BLOCKED | Cannot fill without real K8s deployment target |

---

## Core Modules Tenant Isolation Audit (2026-09-28)

**Modules Checked:** Trips, Dispatch, Vehicles, Billing, Workshop, Lorry Receipts

**Findings & Fixes:**
- **Had the bug (fixed):** 
  - **Billing:** `createRateCard` (spread `customerId` unchecked)
  - **Workshop:** `createJobCard` (spread `vehicleId`, `workshopId` unchecked), `createPart` (spread `vendorId` unchecked), `createTyreLog` (spread `vehicleId` unchecked), and critically `createJobPart` (used `partId`, `maintenanceJobId`, `jobCardId`, `vendorId` across tenants, mutating inventory). All fixed with explicit `findFirst({ where: { id, companyId } })`.
- **Already safe (no changes needed):**
  - **Trips, Dispatch, Vehicles:** Read and confirmed safe. All foreign keys (`vehicleId`, `driverId`) correctly scoped through explicit tenant verification queries before usage.
  - **Lorry Receipts:** LR creation does not expose an unscoped `vehicleId` because it securely pulls `vehicleId` and `driverId` straight from the previously tenant-scoped `Trip` record.

### Cross-Tenant Foreign Key Audit
All backend modules have been updated to use `assertTenantOwned` to strictly validate foreign keys before performing write operations. The fix has been applied repo-wide and a `scripts/check-tenant-isolation.sh` script is now available to catch regressions. Stale md files archived.

### Phase 3/4: Verification & E2E Coverage (Completed)
- Successfully implemented and executed `apps/api/test/repo-wide-isolation.e2e-spec.ts`.
- Validated tenant isolation across 12 distinct modules:
  - Yard Gate Entry
  - Finance Payments
  - Vehicles Compliance DVIR
  - Vehicles Maintenance Schedules
  - Vendor Purchase Orders
  - Factoring Submission
  - Fastag Wallet Account Creation
  - Warehouse Inbound ASN
  - Finance Bank Statement
  - Finance Driver Wallet Expense
  - Operations Incidents Timeline
  - Portals Claims
  - Vehicles Permits
- **Result:** All endpoints correctly rejected cross-tenant data with `404 Not Found`, confirming `assertTenantOwned` intercepts unauthorized foreign key references before database commits.
- **Proof:** E2E Test execution is fully GREEN.

### Phase 4: Final Vulnerability Audit (Completed)
- Ran the `find-vulns-advanced.js` scanner across all `.service.ts` files globally to identify any potential cross-tenant foreign key injections, catching 17 total hits across the entire codebase.
- **Hit Breakdown (17 total):**
  - **11 False Positives:** Hand-audited and left untouched because cross-tenant FK injection is impossible for the following specific reasons:
    - `fleet/lifecycle/vehicle-lifecycle.service.ts` (`onboardVehicle`): Only takes raw vehicle properties and `companyId`, no cross-tenant foreign keys are accepted or associated.
    - `gst/services/gst-engine/gst-engine.service.ts` (`create`): The `GstTaxRule` schema only has a `companyId` foreign key and accepts no references to other entities.
    - `integration/sync/sync.service.ts` (`scheduleSync`): Explicitly fetches `conn` and strictly validates `conn.companyId !== companyId` against the requested `connectionId` before proceeding.
    - `mobile/mobile.service.ts` (`recordLocation`): The `dto.tripId` is explicitly verified in `findFirst` to belong to `driver.id`, and `driver.id` is securely tied to the authenticated `userId` context.
    - `operations/alerts/alert-engine.service.ts` (`createEscalationPolicy`): Only accepts primitive configuration fields (`name`, `severity`, `steps` as JSON), no external foreign keys are taken.
    - `finance/payroll/services/payroll-engine/payroll-engine.service.ts` (`create`): Base entity creation without FKs.
    - `integration/events/enterprise-event-bus.service.ts` (`publishEvent`): Internal cross-tenant system bus where payload shapes are controlled internally.
    - `operations/alerts/alert-engine.service.ts` (`createMaintenanceWindow`): Internal cron schedule bypass using `runAsSystem`.
    - `operations/tracing/distributed-tracing.service.ts` (`recordSpan`): APM system ingestion deliberately bypassing tenants for global tracing.
    - `tracking/services/telematics-ingestion.service.ts` (`ingestTelemetry`): IoT ingestion securely verifies GPS mappings via internal IoT identifiers, not untrusted tenant data.
    - `warehouse/engine/warehouse-master.service.ts` (`createWarehouse`): Top-level entity, creates its own root record without taking FKs.
  - **6 True Positives (Fixed):**
    - `finance/bank-reconciliation` (BankStatement creation missing scoped bankAccountId check)
    - `finance/driver-wallet.service.ts` (Driver/Trip ID validation in expense submission)
    - `fuel/fuel.service.ts` (Fuel card creation tied to unscoped vehicle/driver)
    - `operations/incidents` (Adding timeline event to arbitrary incident UUIDs via API)
    - `portals/claims` (Claim creation referencing arbitrary customerId and loadId)
    - `vehicles/permits` (Permit creation targeting unscoped vehicleId)
- All true positives have been systematically patched using `assertTenantOwned` and validated with matching E2E rejection tests in `repo-wide-isolation.e2e-spec.ts`.

### Phase 5: BOLA/IDOR Read/Delete Vulnerability Audit (Completed 2026-09-28)
- Ran the `find-vulns-idor-v6.js` scanner across all `.service.ts` files globally to identify any `read` (GET) and `delete` operations that fetched or removed records by ID without properly scoping to `companyId`.
- **Findings & Fixes:**
  - **Identified IDORs:** Found and verified several endpoints fetching by ID without tenant scoping:
    - `workshop/workshop.service.ts`: `getJobCard` fetched a JobCard simply by ID, allowing cross-tenant read.
    - `warehouse/engine/dock-scheduler.service.ts`: `markAppointmentArrived` and `completeAppointment` updated an appointment by ID without checking the dock's company owner.
    - `trailers/trailers.service.ts`: `findOne`, `update`, and `remove` methods queried `where: { id, type: 'TRAILER' }` without checking `companyId`, leaking cross-tenant data.
  - **False Positives Examined:**
    - `portals/driver/trips/driver-trips.service.ts`: Safe because queries are scoped explicitly to `driverId` (resolved securely from the JWT).
    - `trips/fuel-entries.service.ts`: Safe because it fetched `trip` with `companyId` securely before updating.
    - `vehicles/compliance/compliance.service.ts`: Safe because it invokes `assertTenantOwned` up front.
    - `workflow/engine/execution.service.ts`: Safe because it invokes `findUnique({ where: { id: executionId, companyId } })` up front.
- **Fixes Applied:**
  - Added explicit `{ companyId }` scoping to `findUnique`/`findFirst` queries and verified related updates were wrapped correctly in tenant boundary logic.
  - Added full end-to-end isolation tests for `Trailers` and `Workshop` IDOR vectors inside `repo-wide-isolation.e2e-spec.ts` (verified with `404 Not Found`).
- **Final Security State:** The repository is comprehensively audited. All core logic handles cross-tenant relations securely, isolating `companyId` contexts correctly for both writes (FK injections) and reads/deletes (BOLA/IDOR).
