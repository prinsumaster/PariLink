# PariLink Infrastructure — Deployment Guide

## Prerequisites

| Tool | Minimum Version | Install |
| :--- | :--- | :--- |
| Terraform | 1.8.0 | `brew install terraform` |
| AWS CLI | 2.15+ | `brew install awscli` |
| kubectl | 1.31 | `brew install kubectl` |
| helm | 3.14+ | `brew install helm` |

## First-Time Bootstrap (Run Once)

The Terraform state S3 bucket and DynamoDB lock table must exist before any Terraform commands.

```bash
# 1. Authenticate AWS CLI with your IAM user or SSO
aws sso login --profile parilink-dev

# 2. Bootstrap the state bucket manually (one-time only)
aws s3 mb s3://parilink-terraform-state-staging --region ap-south-1
aws s3api put-bucket-versioning \
  --bucket parilink-terraform-state-staging \
  --versioning-configuration Status=Enabled

aws dynamodb create-table \
  --table-name parilink-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

## Deploy: Staging

```bash
cd terraform/

# Initialize with staging backend
terraform init -reconfigure

# Plan (dry-run) — always review before apply
terraform plan -var-file=environments/staging.tfvars -out=tfplan.staging

# Apply
terraform apply tfplan.staging
```

## Deploy: Production

```bash
cd terraform/

# Provide sensitive variables via environment (NEVER commit to git)
export TF_VAR_route53_zone_id="Z1234ABCDEFGHIJ"
export TF_VAR_alert_email="ops@parilink.app"

terraform plan -var-file=environments/production.tfvars -out=tfplan.production
terraform apply tfplan.production
```

## Post-Deploy: Configure kubectl

```bash
# Update kubeconfig after EKS cluster is created
aws eks update-kubeconfig \
  --name parilink-production \
  --region ap-south-1 \
  --profile parilink-prod

# Verify cluster access
kubectl get nodes
kubectl get pods -A
```

## Deploy Order (First Time)

1. `networking.tf` — VPC and subnets must exist first
2. `kms.tf` — KMS keys needed by RDS, Redis, CloudWatch
3. `rds.tf` / `redis.tf` — Databases 
4. `s3.tf` — Buckets
5. `iam.tf` — Roles (after EKS OIDC URL is known — 2nd apply)
6. `secrets.tf` — All secrets wired
7. `monitoring.tf` — Alarms and dashboards
8. `main.tf` — EKS, ALB, WAF, CDN

> Terraform handles dependency ordering automatically. Run `terraform apply` once and it will sequence correctly.

## Targeted Applies (For Specific Changes)

```bash
# Only recreate the Redis parameter group
terraform apply -target=module.redis.aws_elasticache_parameter_group.redis

# Only update CloudWatch alarms
terraform apply -target=aws_cloudwatch_metric_alarm.rds_cpu
```

## Tear Down (CAUTION)

```bash
# Staging only — this destroys all resources
terraform destroy -var-file=environments/staging.tfvars

# Production resources are protected by prevent_destroy = true
# You must manually remove the lifecycle block from rds.tf before destroying production
```
