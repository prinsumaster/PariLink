# PariLink Enterprise Logistics OS

PariLink is a unified Logistics Operating System designed for modern Freight Forwarders, Asset-Based Carriers, and Third-Party Logistics (3PL) providers. It integrates Transportation Management (TMS), Customer Relationship Management (CRM), Fleet Maintenance, Telematics, HR, and Financial Accounting into a single, highly concurrent GraphQL & REST backend.

## Architecture

PariLink is a multi-tenant monorepo built for enterprise scale:
- **Backend**: NestJS (Node 20), Prisma ORM, PostgreSQL (Row Level Security enabled)
- **Frontend**: Next.js 16 (App Router, Turbopack, TailwindCSS)
- **Caching & Locks**: Redis cluster
- **Storage**: S3-compatible Blob Storage (MinIO default)
- **Queues**: BullMQ

## Quick Start (Local Development)

### Prerequisites
- Node.js (v20+)
- Docker Desktop
- npm (v10+)

### 1. Environment Setup
```bash
cp .env.example .env
```
Ensure `JWT_SECRET`, `POSTGRES_PASSWORD`, and `MASTER_ENCRYPTION_KEY_V1` are populated securely.

### 2. Start Dependencies
Boot up the local PostgreSQL, Redis, and MinIO instances:
```bash
docker-compose up postgres redis minio -d
```

### 3. Initialize Database
```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Services
Start the API:
```bash
cd apps/api
npm run start:dev
```

Start the Web Frontend:
```bash
cd apps/web
npm run dev
```
## Database migrations

To deploy database migrations manually:
```bash
cd apps/api && DATABASE_URL="<privileged_connection_url>" npx prisma migrate deploy
```
- Connection requirement: Requires a privileged connection string (`DATABASE_URL`) capable of `CREATE EVENT TRIGGER` (admin/superuser role).
- Automated deployment: Setting `RUN_MIGRATIONS=true` in `docker-compose.yml` makes the API container run migrations automatically on startup via `start.sh`.

## Row-level security

Tenant isolation is enforced natively via PostgreSQL Row-Level Security (`tenant_isolation_policy`) across 224 tables. The legacy `app.bypass_rls` session GUC was removed in migration `20260902000000_drop_bypass_rls` and no longer exists in any policy predicate. RLS bypass is exclusively an administrative role attribute granted to `parilink_sys` (`BYPASSRLS`), accessible solely through `PrismaService.runAsSystem()`. As of 2026-09-02, the baseline is verified at 224 tables with policies and 231 total policies with `still_bypass = 0` via `SELECT count(*) FILTER (WHERE qual LIKE '%bypass_rls%') AS still_bypass, count(DISTINCT tablename) AS tables_with_policies, count(*) AS total_policies FROM pg_policies WHERE schemaname='public';`.

## Production Deployment

### Docker Orchestration (Single Node)
To deploy PariLink on a single virtual machine using standard Docker Compose:
```bash
docker-compose up -d --build
```
*Note: In `NODE_ENV=production`, the application is configured to fail-fast if `JWT_SECRET`, `DATABASE_URL`, or `REDIS_URL` are missing or insecure.*

### Kubernetes (Multi-Node)
Helm charts are located in `deploy/helm/parilink`. 
Ensure you inject your infrastructure URLs dynamically via Kubernetes Secrets.

## Documentation
- API Documentation (Swagger) is available in dev mode at `http://localhost:8080/api/docs`.
- Check [SECURITY.md](./SECURITY.md) for vulnerability reporting.
- Check [SUPPORT.md](./SUPPORT.md) for SLA targets.
- Check [CHANGELOG.md](./CHANGELOG.md) for version history.

## License
Proprietary Commercial License. See `LICENSE` for details.

## Frontend changes
`apps/web` is built into the container image rather than mounted.
`docker compose build web` is required after any frontend changes to update the container.
`npm run dev` on the host is the fast path for development.

## Container state
- both `api` and `web` are built into images, not mounted, so a source change needs `docker compose build <service>`
- never `docker cp` a host-built file into a running container — the host `dist/` and the image's `node_modules` layout can differ, and the container reverts on any recreate
- `docker compose up -d --force-recreate <service>` after a build, to be sure the old container is gone

## Trip origin and destination

A `Trip` has no `origin` or `destination` columns in the database.
They are derived from the first and last `Load` attached to the trip — `loads[0].originCity` and `loads[N-1].destinationCity`.
`trips.service.ts` includes loads ordered by `createdAt` ascending for this reason, returning only the fields the UI needs.
The trip detail UI falls back to `'Unknown Origin'` / `'Unknown Destination'` when a trip has no loads.
