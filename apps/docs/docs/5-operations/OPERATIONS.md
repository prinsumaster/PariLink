# PariLink Operations & SRE Guide

## 1. Database Management

### Backups (PostgreSQL)
We recommend setting up automated cron jobs for daily snapshots. 
To manually trigger a backup using Docker:
```bash
docker exec -t parilink-postgres pg_dumpall -c -U parilink > backup_$(date +%Y-%m-%d).sql
```
For Kubernetes:
```bash
kubectl exec -it statefulset/parilink-postgres -- pg_dumpall -c -U parilink > backup_$(date +%Y-%m-%d).sql
```

### Restore Verification
To restore a backup into the running database:
```bash
cat backup.sql | docker exec -i parilink-postgres psql -U parilink -d parilink_db
```

### Migrations & Seed Management
Migrations are automatically applied on startup via the `start.sh` script built into the API Docker container.
To manually seed the database with reference data (e.g. default roles, super-admin account):
```bash
docker exec -it parilink-api npx prisma db seed
```

## 2. Platform Upgrades & Rollbacks

### Rolling Updates (Kubernetes)
PariLink supports zero-downtime rolling updates. When a new tag is pushed, the CD pipeline automatically triggers the update.
To manually trigger a rolling restart:
```bash
kubectl rollout restart deployment/parilink-api
kubectl rollout restart deployment/parilink-web
```

### Rollback Procedures
If a newly deployed version fails readiness probes, Kubernetes will automatically halt the rollout.
To manually rollback to the previous stable version:
```bash
kubectl rollout undo deployment/parilink-api
kubectl rollout undo deployment/parilink-web
```

> [!WARNING]
> If a database migration was applied during the failed upgrade, rolling back the application code might cause schema mismatches. Always review the migration history before rolling back application code.

## 3. Storage Operations (MinIO)
If running MinIO locally instead of AWS S3, document storage backups must be handled at the volume level.
- MinIO Data Directory: `/var/lib/docker/volumes/parilink_minio_data`
Use standard rsync or volume snapshotting to backup this directory daily.
