# PariLink Enterprise 1.0.0 — Operations Runbook

This document is the authoritative operations guide for managing the PariLink Enterprise v1.0.0 platform in production environments.

## 1. Deployment
Deployments are managed via Kubernetes manifests located in the `/k8s` directory.

**Standard Deployment Steps:**
1. Build and push new Docker images (`parilink-api:tag`, `parilink-web:tag`) to the secure registry.
2. Update the `VERSION` file.
3. Apply configuration changes: `kubectl apply -f k8s/configmap.yaml`
4. Apply secret changes: `kubectl apply -f k8s/secret.yaml`
5. Apply database migrations: Run a one-off job or execute `npx prisma migrate deploy` against the RDS instance.
6. Trigger rolling restart: `kubectl rollout restart deployment parilink-api -n parilink`

## 2. Rollback
If a deployment degrades system health (metrics drop, 500 error spikes):
1. **API Rollback:** `kubectl rollout undo deployment/parilink-api -n parilink`
2. **Web Rollback:** `kubectl rollout undo deployment/parilink-web -n parilink`
3. **Database Rollback:** If the rollback crosses a destructive database schema boundary, restore from the immediate pre-launch RDS snapshot.

## 3. Backup
Backups are primarily managed at the infrastructure layer (e.g., AWS RDS Automated Backups).
- **Logical Backup:** The `OperationsScheduler` executes a cron job every day at `02:00 UTC` invoking `BackupRecoveryService.startBackupJob()`.
- **Manual Trigger:** Administrators can trigger a point-in-time backup via the internal API: `POST /api/v1/operations/backup/trigger`.

## 4. Restore
To restore data from a system failure:
1. Identify the most recent healthy snapshot ID.
2. Spin up a secondary database instance from the snapshot.
3. Drain all incoming traffic from the primary DB (suspend queues, scaledown API).
4. Synchronize missing differential data (if any) or pivot the `DATABASE_URL` secret to the restored instance.
5. Scale up API pods.

## 5. Incident Response
For P1/P2 incidents (e.g., `[Health Pulse] System status: DOWN`):
1. **Acknowledge:** On-call engineer acknowledges the PagerDuty alert.
2. **Triaging:** Check `/api/v1/operations/health/global` to isolate the degraded component.
3. **Logs:** Query the `apiAnalyticsLog` database table or Kibana for localized stack traces.
4. **Resolution:** Implement mitigations (scale-up, rollback, feature flag toggle).
5. **Post-Mortem:** Document root cause within 48 hours.

## 6. Monitoring
The platform features an autonomous `OperationsScheduler` running inside the API Gateway:
- **Health Pulse:** Runs every 60s, checking Database, Redis, Queues, Storage, and Memory limits.
- **Metrics Collection:** Runs every 5m, tracking CPU > 85% and Heap > 800MB.
- **Error Rates:** Runs every 5m, alerting if 5xx errors exceed 5%.
- **Slow Query:** Runs every 10m, logging endpoints > 3000ms latency.

## 7. Scaling
The system uses Kubernetes Horizontal Pod Autoscalers (HPA) located in `k8s/hpa/`.
- **API Nodes:** Auto-scale on CPU > 75% or Memory > 75%.
- **Worker Nodes:** Auto-scale based on BullMQ queue depth (Custom Metrics API).
- **Manual Override:** `kubectl scale deployment parilink-api --replicas=10 -n parilink`

## 8. Environment Variables
Mandatory production environment variables:
- `NODE_ENV=production`
- `DATABASE_URL`: Connection string to PostgreSQL instance.
- `REDIS_URL`: Connection string to Redis cluster.
- `JWT_SECRET`: Minimum 64-byte hex cryptographically secure key.
- `COOKIE_SECRET`: Minimum 64-byte hex cryptographically secure key.
- `MASTER_ENCRYPTION_KEY_V1`: Exactly 32-byte hex for AES-256-GCM symmetric encryption of sensitive fields.
