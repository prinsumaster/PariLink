# PariLink SRE Runbook — Incident Response

## Severity Levels
* **SEV-1 (Critical)**: Platform is completely down. Users cannot log in, APIs return 5xx. Immediate response required (SLA: 5 mins).
* **SEV-2 (High)**: Major feature broken (e.g., Dispatching, Mobile offline sync). Users degraded. (SLA: 15 mins).
* **SEV-3 (Medium)**: Minor feature broken or performance degradation. (SLA: 1 hour).
* **SEV-4 (Low)**: Cosmetic issue or individual user problem. (SLA: 24 hours).

## Incident Response Flow
1. **Acknowledge**: On-call engineer acknowledges the PagerDuty alert.
2. **Triage**: Check Grafana dashboards (`PariLink Service Metrics`) and Loki logs. Identify the blast radius.
3. **Communicate**: Open a `#incident-xyz` Slack channel. Post an initial update to the status page (if SEV-1/2).
4. **Mitigate**: Apply a fix to stop the bleeding (e.g., rollback deployment, scale up pods, block IP). Mitigation > Root Cause during an active incident.
5. **Resolve**: Confirm metrics return to normal. Update status page.
6. **Post-Mortem**: Required for all SEV-1 and SEV-2 within 48 hours. Focus on "blameless" root cause analysis and action items.

---

## Specific Runbooks

### 1. API High Error Rate (>5% HTTP 5xx)
**Symptoms**: Alert `APIErrorRateCritical` fires. Users report errors.
**Steps**:
1. Check Kubernetes pods: `kubectl get pods -n parilink-prod`
2. Check logs for panics/exceptions: `kubectl logs -l app=api -n parilink-prod --tail=100 | grep -i error`
3. Check Database connections: Are we exhausting the RDS connection pool?
4. **Mitigation**: If caused by a recent deployment, immediately rollback:
   `kubectl rollout undo deployment/parilink-api -n parilink-prod`
5. **Mitigation**: If caused by a traffic spike, manually scale up:
   `kubectl scale deployment parilink-api --replicas=10 -n parilink-prod`

### 2. Database Connection Pool Exhaustion
**Symptoms**: Alert `DatabaseConnectionPoolSaturated` fires. API logs show "too many clients already".
**Steps**:
1. Check active connections in RDS Performance Insights.
2. Identify the offending query or tenant causing table locks.
3. **Mitigation**: Restart API pods to clear zombie connections:
   `kubectl rollout restart deployment/parilink-api -n parilink-prod`
4. **Long-term**: Check PgBouncer configuration and ensure Prisma connection pooling is configured correctly via `DATABASE_URL` arguments (e.g., `?connection_limit=50`).

### 3. Node Memory Pressure / OOM Kills
**Symptoms**: Alert `NodeMemoryPressure` or `PodOOMKilled` fires.
**Steps**:
1. Identify the OOMKilled pod: `kubectl get pods -n parilink-prod | grep OOMKilled`
2. Check memory metrics in Grafana. Does the application have a memory leak?
3. **Mitigation**: Temporarily increase memory limits in VPA or Deployment manifest.
4. **Mitigation**: Add more nodes to the cluster by adjusting the EKS Auto Scaling Group.

### 4. Database Failure (Disaster Recovery)
**Symptoms**: Database pods crash continuously or PVC volume is lost.
**Steps**:
1. Follow the [Disaster Recovery Runbook](./disaster-recovery.md) for restoration steps.
2. We rely on a 6-hour RPO automated `pg_dump` via Kubernetes CronJob, stored in S3/MinIO.
3. Once `pg_restore` completes, ensure you bounce the API pods to reset connection pools:
   `kubectl rollout restart deployment/parilink-api -n parilink-prod`
