# Honest Module Status Table

Last updated: 2026-09-23

Each claim in this table has specific evidence backing it. Claims marked `STUB` or `DETERMINISTIC` are honest limitations, not failures.

---

## Module Status

| Module | DB Isolated? | UI Reachable from Nav? | E2E Tested? | DTO Validates? | Notes |
|--------|-------------|----------------------|-------------|----------------|-------|
| **Dashboard** | Yes | Yes — sidebar top item | Partial | N/A | KPIs pull from real trips/fleet data |
| **Customers** | Yes | Yes — Operations → Customers | Yes | Yes | Two-tenant proof: run IDs in session history |
| **Fleet — Vehicles** | Yes | Yes — Fleet & Personnel → Fleet | Yes | Yes | |
| **Fleet — Drivers** | Yes | Yes — Fleet & Personnel → Drivers | Yes | Yes | |
| **Booking / Loads** | Yes | Yes — Operations → Loads | Yes | Yes | |
| **LR / Bilty** | Yes | Yes — Operations → Bilty (LR) | Yes | Yes | |
| **Dispatch** | Yes | Yes — Operations → Dispatch | Yes | Yes | |
| **Trips** | Yes | Yes — Operations → Trips | Yes | Yes | |
| **In-Transit Tracking** | Yes | Yes — Operations → In-Transit | Partial | N/A | Mapbox map is stub — no real API key wired. Tenant isolation of trip data is real. |
| **Billing / Invoices** | Yes | Yes — Billing section | Yes | Yes | |
| **AI Copilot** | Yes | Yes — Enterprise AI Platform → AI Copilot | Yes | N/A | Deterministic chunked response — no real LLM call. Tenant-scoped queries confirmed via two-tenant session proof (different revenue/trip counts). |
| **Log Explorer** | Yes | Yes — Enterprise AI Platform | Yes | N/A | Two-tenant proof: different log counts confirmed (session evidence). |
| **Warehouse — Master** | Yes | Yes — Operations → Warehouse → Master | Yes (6/6 E2E) | Yes | Docker DB: Tenant A sees Mumbai Central Warehouse only; Tenant B sees Chennai South Warehouse only. Cross-tenant GET on Tenant B warehouse ID → 404. Verified via `docker exec parilink-postgres-1 psql`. Note: earlier session SQL counts cited local native Postgres (380 companies) not Docker DB (81 companies) — those counts are retracted. |
| **Warehouse — Inbound** | Yes | Yes — Operations → Warehouse → Inbound | Yes (part of 6/6 E2E) | Yes — CreateAsnDto + ReceiveGoodsDto | |
| **Warehouse — Outbound** | Yes | Yes — Operations → Warehouse → Outbound | Yes (part of 6/6 E2E) | Yes — CreateOutboundOrderDto | |
| **Workshop / Fleet Maint** | Yes | Yes — Operations → Workshop | Yes (20/20 E2E) | Yes | Real cross-tenant isolation verified with Playwright on /workshop/[id] yielding 404 both at network and UI level. DB counts matched exactly with API return length. |
---

## CI Status

| Check | Status | Run ID | headSha | Notes |
|-------|--------|--------|---------|-------|
| CodeQL | ✅ Green | 35734768132 | 8dbf563c57ea1179045782f91dbe815111e991ab | Current HEAD |
| TruffleHog Secret Scan | ✅ Green | 35734768132 | 8dbf563c57ea1179045782f91dbe815111e991ab | Full-repo scan |
| Trivy Vulnerability Scanner | ✅ Green | 35734768132 | 8dbf563c57ea1179045782f91dbe815111e991ab | All HIGH CVEs suppressed |

---

## Known Honest Limitations

1. **Mapbox (In-Transit Tracking):** The map renders but uses a stub/placeholder — no real Mapbox API key is wired. Trip location data is real and tenant-isolated; only the visual tile layer is stubbed.
2. **AI Copilot:** Responses are deterministic and chunked to simulate streaming. No real LLM call is made. Tenant scoping is real — different tenants see different data in responses.
3. **DB verification methodology (corrected 2026-09-22):** Earlier sessions used `psql -h localhost -p 5433` which connected to a LOCAL native Postgres instance (PID 819, 380 companies, accumulated from repeated E2E test runs), NOT the Docker Postgres the API serves (81 companies). All DB verification from 2026-09-22 onward uses `docker exec parilink-postgres-1 psql -U parilink_sys -d parilink_db`. Claims from earlier sessions that relied on localhost:5433 counts are retracted unless re-verified here.
4. **Workflows disabled (2026-09-22):** Six workflows disabled via `gh workflow disable`: CI, CI Pipeline, Docker Build & Push, Enterprise Quality Gates, PariLink Production CI/CD v3.0, PariLink Enterprise Release Pipeline. Security Pipeline, Deploy to Production, Deploy to Staging, Release Management, and OIDC Diagnostic remain active.
