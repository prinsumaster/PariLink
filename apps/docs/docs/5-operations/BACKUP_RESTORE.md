# Backup and Restore Guide

## PostgreSQL Backups
PariLink relies on a managed PostgreSQL database (e.g., AWS RDS or GCP Cloud SQL) which natively supports Point-In-Time Recovery (PITR) and automated daily snapshots.

### Verifying Backups
- Backups are automatically taken daily at 03:00 UTC.
- Write-Ahead Logs (WAL) are archived continuously, allowing PITR down to a 5-minute window.
- **Action:** Weekly, manually verify that snapshots exist and are marked "Available".

### Restore Procedure (Disaster Recovery)
If database corruption or accidental data deletion occurs:
1. Identify the exact timestamp before the corruption event.
2. In the cloud console (or via CLI), initiate a PITR restore to a **new database instance**.
   ```bash
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier parilink-prod \
     --target-db-instance-identifier parilink-prod-restored \
     --restore-time 2026-07-24T12:00:00Z
   ```
3. Update the `DATABASE_URL` in the secrets manager to point to the new instance.
4. Restart the API pods: `kubectl rollout restart deployment/parilink-api`

## Redis / Queue Recovery
Redis is primarily used for caching and transient jobs (BullMQ). 
- In the event of a Redis crash, BullMQ jobs that were active may be moved to the `stalled` or `failed` state.
- Upon restart, BullMQ will automatically attempt to resume stalled jobs.
- **Action:** Monitor the BullMQ dashboard (if enabled) or logs to ensure jobs are processed. No manual Redis snapshot restoration is necessary unless long-term rate limit states are critical.
