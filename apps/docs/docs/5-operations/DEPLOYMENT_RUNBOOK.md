# Deployment Runbook

## Overview
This runbook describes the procedure to deploy PariLink into production. The system consists of:
- `api` (NestJS)
- `web` (Next.js)
- PostgreSQL (Primary Store)
- Redis (Caching and Queues)

## Pre-deployment Checklist
1. Verify `DATABASE_URL` is set and points to production.
2. Verify `JWT_SECRET` is set to a secure 512-bit key.
3. Verify `MASTER_ENCRYPTION_KEY_V1` is securely provisioned.
4. Verify Redis is accessible via `REDIS_URL`.
5. Ensure CI pipeline completed successfully (Build, Test, Lint).

## Deployment Steps
1. **Database Migration**
   Execute schema changes before spinning up the new API containers:
   ```bash
   npx prisma migrate deploy
   ```

2. **Deploy Backend (API)**
   Deploy the new API image. The API implements `enableShutdownHooks()`, ensuring old pods drain correctly while new pods boot.
   ```bash
   kubectl rollout restart deployment/parilink-api
   ```

3. **Deploy Frontend (Web)**
   ```bash
   kubectl rollout restart deployment/parilink-web
   ```

4. **Health Verification**
   Verify the new pods are healthy:
   ```bash
   curl -s https://api.parilink.com/health/readiness | jq .status
   # Expected: "ok"
   ```

## Post-deployment
- Monitor Datadog dashboards for 5xx errors or increased latency.
- Verify BullMQ worker counts match the expected baseline.
