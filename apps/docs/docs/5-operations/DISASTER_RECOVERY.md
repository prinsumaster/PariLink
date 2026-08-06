# Disaster Recovery (GA)

## 1. Objectives
- **RTO (Recovery Time Objective)**: 15 Minutes. The time taken to restore services after a critical failure.
- **RPO (Recovery Point Objective)**: 5 Minutes. The maximum acceptable data loss in the event of a catastrophic database failure.

## 2. Disaster Playbooks

### A. Region / Cloud Provider Failure
1. **Trigger**: Complete outage of the primary availability zone or region.
2. **Action**:
   - Update DNS to point `app.parilink.com` to the warm-standby region.
   - Promote the cross-region database replica to Primary.
   - Scale HPA in the standby region from 0 to baseline (3 replicas).
3. **Validation**: Run k6 Smoke tests against the new region.

### B. Primary Database Corruption / Failure
1. **Trigger**: Database corruption, accidental `DROP TABLE`, or hardware failure.
2. **Action**:
   - If Point-in-Time Recovery (PITR) is required, use `pgBackRest` to restore to `(Incident Time - 1 minute)`.
   - Update the Kubernetes Secret `DATABASE_URL` with the new restored instance URI.
   - Trigger a rollout restart of the API deployment to kill hanging connections.

### C. Redis Failure (Cache Loss)
1. **Trigger**: Redis OOM or pod crash loop.
2. **Action**:
   - Redis data is entirely ephemeral (sessions and rate limiting).
   - Delete the failing pod: `kubectl delete pod -l app=parilink-redis`.
   - Let Kubernetes recreate it.
   - *Impact*: Users will be logged out and forced to re-authenticate. Rate limits are reset.

### D. Persistent Storage / PVC Failure
1. **Trigger**: Cloud volume detachment or degradation.
2. **Action**:
   - Restore the volume from the latest nightly snapshot into a new PVC.
   - Rebind the database deployment to the new PVC.
