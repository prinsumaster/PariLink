# CI/CD Regression & DevOps Report

## GitHub Actions CI Pipeline
A robust CI pipeline (`.github/workflows/ci.yml`) is deployed. It executes on every Push and Pull Request to `main` and `staging`.

### Pipeline Stages
1. **Linting:** Validates TypeScript strict mode and ESLint rules.
2. **Schema Validation:** Verifies `schema.prisma` integrity and syntax.
3. **Build:** Ensures `npm run build` succeeds (NestJS compilation).
4. **Services Spin-up:** Boots ephemeral `PostgreSQL 15` and `Redis 7` containers.
5. **Database Migration:** Runs `prisma migrate deploy` against the ephemeral DB.
6. **Testing:** Executes Jest Unit and E2E suites.

## Disaster Recovery Validations (Simulated)
1. **Database Crash & Restart:**
   - The NestJS Prisma Client successfully queues requests and automatically reconnects when the DB restores. Minimal dropped requests.
2. **Redis Eviction:**
   - If Redis crashes, user sessions (Throttler/Rate limiting) fail open safely (if configured) or trigger 500s. Rate limit counters reset upon Redis boot.
3. **Data Loss (Point in Time Recovery):**
   - PostgreSQL MUST be configured with WAL archiving (e.g., AWS RDS Automated Backups) for 5-minute RPO.

## Recommendations
- Deploy via Helm Charts to Kubernetes.
- Utilize HPA (Horizontal Pod Autoscaling) tied to CPU.
- Ensure Liveness (`/api/docs`) and Readiness probes are configured in the cluster.
