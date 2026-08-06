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
