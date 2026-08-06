# ─────────────────────────────────────────────────────────────────────────────
# PariLink — Production Environment Variables
# Apply: terraform -var-file=environments/production.tfvars
#
# ⚠️  NEVER commit this file with real values to source control.
#     Sensitive values (route53_zone_id) must be provided via:
#     TF_VAR_route53_zone_id environment variable in CI/CD.
# ─────────────────────────────────────────────────────────────────────────────

environment = "production"
aws_region  = "ap-south-1"
domain_name = "parilink.app"
alert_email = "ops@parilink.app"

# ─── Production-grade instance sizes ─────────────────────────────────────────
rds_instance_class    = "db.r7g.xlarge"
rds_allocated_storage = 100
rds_max_storage       = 2000

redis_node_type = "cache.r7g.large"

eks_node_instance_types = ["m6i.xlarge", "m6a.xlarge"]
eks_min_nodes           = 3
eks_desired_nodes       = 5
eks_max_nodes           = 20

# ─── Security ─────────────────────────────────────────────────────────────────
enable_waf             = true
enable_shield_advanced = false  # Enable at $5M+ ARR

# ─── DO NOT set sensitive variables here ─────────────────────────────────────
# route53_zone_id  →  TF_VAR_route53_zone_id
# AWS credentials  →  IAM Role assumption via GitHub Actions OIDC
