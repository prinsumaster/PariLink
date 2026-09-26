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
- **web:** `parilink-web:audit` — (build in progress)

> [!NOTE]
> Final image sizes:
> - `parilink-api:audit` -> **964MB**
> - `parilink-web:audit` -> (pending)

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
| Cross-dock `matchScore: 0.98` placeholder | LOW | Flagged; not blocking |
| Redis `allkeys-lru` eviction policy warning | LOW | BullMQ wants `noeviction`; no data loss risk in current load but should be set in production |
| Sales Demo Mode | INFORMATIONAL | Deliberately not implemented |
| Lorry Receipts mobile UI not wired | LOW | Backend done; frontend integration pending |
| Backup not yet cron-scheduled | INFORMATIONAL | Deferred locally; Managed Postgres will provide native backups |
| k8s/secret.yaml placeholders not filled | BLOCKED | Cannot fill without real K8s deployment target |
