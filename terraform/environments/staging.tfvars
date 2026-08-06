# ─────────────────────────────────────────────────────────────────────────────
# PariLink — Staging Environment Variables
# Apply: terraform -var-file=environments/staging.tfvars
# ─────────────────────────────────────────────────────────────────────────────

environment = "staging"
aws_region  = "ap-south-1"
domain_name = "staging.parilink.app"
alert_email = "dev-ops@parilink.app"

# ─── Cost-optimised settings for staging ─────────────────────────────────────
rds_instance_class    = "db.r7g.large"
rds_allocated_storage = 50
rds_max_storage       = 500

redis_node_type = "cache.t4g.medium"

eks_node_instance_types = ["t3.xlarge", "t3a.xlarge"]
eks_min_nodes           = 2
eks_desired_nodes       = 3
eks_max_nodes           = 6

# Single NAT gateway in staging to save ~$100/month
# (controlled by environment == "production" check in networking.tf)
