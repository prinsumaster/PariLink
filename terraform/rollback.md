# PariLink Infrastructure — Disaster Recovery Runbook

## RTO / RPO Targets

| Scenario | RTO | RPO |
| :--- | :--- | :--- |
| AZ failure | < 5 minutes | 0 (Multi-AZ automatic) |
| Region-level disaster | < 4 hours | < 24 hours (daily snapshot) |
| Accidental data deletion | < 2 hours | < 1 hour (PITR) |
| Full infrastructure rebuild | < 60 minutes | Per snapshot |

---

## Scenario 1: RDS Primary Instance Failure (AZ Outage)

**Expected behavior:** Fully automatic. Multi-AZ RDS will failover to the standby in ~60 seconds.

**Manual verification:**
```bash
# Confirm the new primary endpoint
aws rds describe-db-instances \
  --db-instance-identifier parilink-production \
  --query 'DBInstances[0].Endpoint.Address'

# Check PariLink API error rate in CloudWatch
aws cloudwatch get-metric-statistics \
  --namespace PariLink/API --metric-name 5XXErrorRate \
  --period 60 --statistics Sum \
  --start-time $(date -u -d '10 minutes ago' '+%Y-%m-%dT%H:%M:%SZ') \
  --end-time $(date -u '+%Y-%m-%dT%H:%M:%SZ')
```

**If API pods are not recovering:**
```bash
kubectl rollout restart deployment parilink-api -n default
```

---

## Scenario 2: Accidental Data Deletion (PITR Restore)

RDS has Point-in-Time Recovery (PITR) enabled. You can restore to any second within the last 35 days.

```bash
# Restore to a specific time
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier parilink-production \
  --target-db-instance-identifier parilink-production-recovered \
  --restore-time "2026-07-28T15:30:00Z" \
  --db-instance-class db.r7g.xlarge \
  --multi-az

# Verify instance is available (~20 minutes)
aws rds wait db-instance-available \
  --db-instance-identifier parilink-production-recovered

# Update Secrets Manager with new endpoint
# Update the EKS ExternalSecret to point to the recovered instance
```

---

## Scenario 3: Redis Cache Failure (Automatic Failover)

ElastiCache Replication Group with automatic failover enabled. Failover to reader node is automatic (~30 seconds).

**Manual verification:**
```bash
aws elasticache describe-replication-groups \
  --replication-group-id parilink-production \
  --query 'ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint'
```

---

## Scenario 4: Full Infrastructure Rebuild

If the entire AWS account or region is unavailable:

```bash
# 1. Provision in DR region (ap-southeast-1 — Singapore)
cd terraform/
export TF_VAR_route53_zone_id="Z_DR_ZONE_ID"

terraform init \
  -backend-config="bucket=parilink-terraform-state-dr" \
  -backend-config="region=ap-southeast-1"

terraform apply \
  -var-file=environments/production.tfvars \
  -var="aws_region=ap-southeast-1" \
  -var="environment=dr"

# 2. Restore RDS from latest snapshot (copied to DR region via AWS Backup)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier parilink-dr \
  --db-snapshot-identifier <latest-snapshot-id> \
  --region ap-southeast-1

# 3. Update Route53 to point to DR ALB
aws route53 change-resource-record-sets \
  --hosted-zone-id $TF_VAR_route53_zone_id \
  --change-batch file://dr-dns-changeset.json

# 4. Update Secrets Manager endpoints in EKS
kubectl apply -f k8s/external-secrets-dr.yaml
```

---

## Backup Verification Procedure (Monthly)

Run the following on the first Monday of each month:

```bash
# 1. List latest RDS backup
aws backup list-recovery-points-by-resource \
  --resource-arn arn:aws:rds:ap-south-1:ACCOUNT:db:parilink-production

# 2. Initiate a test restore (to a temporary instance)
aws backup start-restore-job \
  --recovery-point-arn <arn-from-above> \
  --iam-role-arn arn:aws:iam::ACCOUNT:role/parilink-backup-production \
  --metadata '{"DBInstanceClass":"db.t3.medium","MultiAZ":"false"}'

# 3. Verify restored instance data integrity
# Run read-only smoke tests against the restored instance

# 4. Delete the test restore instance
aws rds delete-db-instance \
  --db-instance-identifier parilink-production-restore-test \
  --skip-final-snapshot
```
