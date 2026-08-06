# PariLink Enterprise — Infrastructure README

## Architecture Overview

```
Internet
   │
   ▼
┌──────────────────────────────────────────────────────────────────────┐
│ AWS WAFv2 (OWASP Top 10 + Rate Limiting + Geo Restriction)           │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Application Load Balancer (HTTPS:443 only, HTTP→HTTPS redirect)      │
│ Public Subnets: 10.0.101.0/24, 10.0.102.0/24, 10.0.103.0/24        │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                   ┌────────────▼────────────┐
                   │   AWS EKS Cluster       │
                   │  (Private Subnets)      │
                   │  API Pods / Workers     │
                   └────┬──────────┬─────────┘
                        │          │
              ┌─────────▼──┐   ┌──▼──────────────┐
              │  RDS        │   │  ElastiCache      │
              │  PostgreSQL │   │  Redis 7          │
              │  Multi-AZ   │   │  Replication Grp  │
              │  DB Subnets │   │  (Private Subnets)│
              └────────────┘   └──────────────────┘
```

## Terraform Modules

| File | Purpose |
| :--- | :--- |
| `versions.tf` | Provider version pins (Terraform ≥ 1.8) |
| `providers.tf` | AWS provider with default tags |
| `variables.tf` | All input variables with validation |
| `outputs.tf` | All outputs for CI/CD and Kubernetes |
| `networking.tf` | VPC, Subnets, IGW, NAT, Route Tables, NACLs, Flow Logs, SSM Endpoints |
| `kms.tf` | Customer-managed KMS keys (CloudWatch, Secrets, EKS) |
| `rds.tf` | RDS PostgreSQL module wiring |
| `redis.tf` | ElastiCache Redis module wiring |
| `s3.tf` | S3 Buckets (uploads, logs, assets, backups, tf-state) |
| `iam.tf` | IAM Roles (EKS, IRSA, GitHub Actions OIDC, Backup) |
| `secrets.tf` | Secrets Manager entries for all runtime credentials |
| `monitoring.tf` | CloudWatch Alarms, Dashboards, SNS, AWS Backup |
| `main.tf` | Root orchestration (EKS, CDN, ALB, WAF) |

## Module Directory

| Module | Purpose |
| :--- | :--- |
| `modules/postgres` | RDS PostgreSQL (Multi-AZ, read replicas, parameter group) |
| `modules/redis` | ElastiCache Replication Group (production-grade) |
| `modules/s3` | S3 assets + backups + state buckets |
| `modules/iam` | Supporting IAM sub-resources |
| `modules/eks` | EKS cluster and managed node groups |
| `modules/alb` | Application Load Balancer |
| `modules/monitoring` | Extended metric alarms |
| `modules/secrets` | Secrets Manager helpers |

## Security Architecture

- **No Bastion Host:** All node access via AWS SSM Session Manager.
- **All subnets private:** No resource has a public IP. Only ALB is internet-facing.
- **Encryption at rest:** RDS, Redis, S3, CloudWatch Logs all use KMS CMKs.
- **Encryption in transit:** RDS forces SSL; Redis uses TLS; S3 enforces HTTPS.
- **WAFv2:** OWASP Core Rule Set + SQLi + Rate Limiting (1000 req/5min).
- **VPC Flow Logs:** All traffic captured to CloudWatch (90-day retention).
- **Network ACLs:** Defense-in-depth layered on top of Security Groups.
- **IRSA:** No long-lived IAM credentials. Kubernetes pods use short-lived tokens.

## Cost Estimate

| Resource | Staging (~$/month) | Production (~$/month) |
| :--- | :--- | :--- |
| EKS Cluster | $73 | $73 |
| EC2 Nodes (3x t3.xlarge) | $220 | $720 (5x m6i.xlarge) |
| RDS db.r7g.large | $210 | $420 (db.r7g.xlarge) |
| ElastiCache cache.t4g.medium | $40 | $180 (cache.r7g.large × 3) |
| NAT Gateway (1) | $45 | $135 (3 AZs) |
| ALB | $25 | $50 |
| S3 + CloudWatch | $20 | $50 |
| **Total** | **~$633/month** | **~$1,628/month** |

> Note: Traffic and data transfer costs are excluded. Spot instances can reduce EC2 costs by 60%.
