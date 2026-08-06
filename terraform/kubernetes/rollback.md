# PariLink Kubernetes Platform — Rollback & Recovery Guide

## Backup Strategy

PariLink uses **Velero** for cluster state and persistent volume backups.

- **Schedule:** Daily at 02:00 UTC.
- **Retention:** 30 days (720h).
- **Storage:** S3 Bucket (`parilink-backups-production`).
- **Snapshots:** EBS volumes are natively snapshotted via AWS CSI.

## Scenario 1: Accidental Namespace Deletion

If an application namespace or deployment is accidentally deleted:

```bash
# 1. View available backups
velero backup get

# 2. Restore from the most recent backup
velero restore create --from-backup daily-backup-20260728020000 --include-namespaces default

# 3. Monitor restore status
velero restore describe <restore-name>
```

## Scenario 2: Cluster Node Failure

**Expected Behavior:** Automatic.
If a worker node fails, the AWS Auto Scaling Group will detect the EC2 failure and terminate it. The Cluster Autoscaler will spin up a replacement node. Pods will be rescheduled within ~2 minutes based on their PodDisruptionBudgets and node affinities.

## Scenario 3: Bad Helm Release Rollback

If a Helm upgrade introduces a critical bug:

```bash
# 1. View release history
helm history parilink-api -n default

# 2. Rollback to previous working revision (e.g., revision 4)
helm rollback parilink-api 4 -n default

# 3. Verify pods are coming back up
kubectl get pods -n default -w
```

## Scenario 4: Total Cluster Rebuild (Disaster Recovery)

In the event of a catastrophic region failure where the EKS control plane is lost:

1. Provision the DR cluster in a new region via Terraform.
2. Update the Velero `BackupStorageLocation` to point to the cross-region replicated S3 backup bucket.
3. Initiate a full cluster restore:
```bash
velero restore create --from-backup daily-backup-latest
```
4. Verify all PersistentVolumeClaims bind successfully to new EBS snapshots.
