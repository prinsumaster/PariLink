# Disaster Recovery Runbook

## PostgreSQL Database Restore
We use a self-hosted PostgreSQL instance with an automated Kubernetes CronJob (`k8s/cronjobs/postgres-backup.yaml`) that executes a `pg_dump` every 6 hours and uploads it to our S3/MinIO bucket.

### Restoration Procedure:
1. **Locate Backup**: Identify the latest compressed dump in the `parilink-db-backups` S3 bucket.
2. **Pause Traffic**: Scale the API deployment to 0 replicas to prevent state mutation.
   ```bash
   kubectl scale deployment parilink-api --replicas=0 -n parilink-prod
   ```
3. **Execute Restore**: Drop and restore the database using `pg_restore`.
   ```bash
   kubectl exec -it <postgres-pod-name> -n parilink-prod -- pg_restore -U parilink -d parilink_db -1 /path/to/downloaded/backup.sql
   ```
4. **Resume Traffic**: Scale the API deployment back up. The `/health/readiness` probe will automatically verify the restored DB connection.
   ```bash
   kubectl scale deployment parilink-api --replicas=3 -n parilink-prod
   ```

## Redis Cluster Failure
Redis holds ephemeral idempotency and rate-limiting data, but no persistent business logic.
1. Flush the cluster.
2. Restart the deployment. Clients will automatically fall back to memory limits temporarily if so configured, or reset their quotas.
