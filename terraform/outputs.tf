# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — outputs.tf
# Centralized outputs consumed by:
#   - Kubernetes cluster config
#   - GitHub Actions CI/CD
#   - Application configuration
#   - Monitoring dashboards
# ─────────────────────────────────────────────────────────────────────────────

# ─── Network ──────────────────────────────────────────────────────────────────
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs (ALB placement)"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs (EKS nodes, ElastiCache)"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "Database subnet IDs (RDS only)"
  value       = aws_subnet.database[*].id
}

output "alb_security_group_id" {
  description = "Application Load Balancer Security Group ID"
  value       = aws_security_group.alb.id
}

output "eks_nodes_security_group_id" {
  description = "EKS Worker Nodes Security Group ID"
  value       = aws_security_group.eks_nodes.id
}

# ─── Database ─────────────────────────────────────────────────────────────────
output "rds_endpoint" {
  description = "RDS Primary endpoint (writer)"
  value       = module.postgres.db_endpoint
  sensitive   = true
}

output "rds_identifier" {
  description = "RDS instance identifier"
  value       = module.postgres.db_identifier
}

output "rds_replica_endpoints" {
  description = "RDS Read Replica endpoints"
  value       = module.postgres.replica_endpoints
  sensitive   = true
}

output "rds_secrets_arn" {
  description = "Secrets Manager ARN containing full DB connection string"
  value       = module.postgres.secrets_manager_arn
}

# ─── Redis ────────────────────────────────────────────────────────────────────
output "redis_primary_endpoint" {
  description = "ElastiCache Redis primary endpoint"
  value       = module.redis.redis_endpoint
  sensitive   = true
}

output "redis_reader_endpoint" {
  description = "ElastiCache Redis reader endpoint (read scale-out)"
  value       = module.redis.redis_reader_endpoint
  sensitive   = true
}

output "redis_auth_secret_arn" {
  description = "Secrets Manager ARN containing Redis AUTH token"
  value       = module.redis.redis_secret_arn
}

# ─── Storage ──────────────────────────────────────────────────────────────────
output "uploads_bucket_id" {
  description = "S3 bucket name for driver PODs and uploads"
  value       = aws_s3_bucket.uploads.id
}

output "backups_bucket_id" {
  description = "S3 bucket name for database backups"
  value       = module.s3.backups_bucket_id
}

output "logs_bucket_id" {
  description = "S3 bucket name for ALB/CloudFront access logs"
  value       = aws_s3_bucket.logs.id
}

# ─── Security ─────────────────────────────────────────────────────────────────
output "kms_cloudwatch_key_arn" {
  description = "KMS key ARN for CloudWatch log encryption"
  value       = aws_kms_key.cloudwatch.arn
}

output "kms_secrets_key_arn" {
  description = "KMS key ARN for Secrets Manager encryption"
  value       = aws_kms_key.secrets.arn
}

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions OIDC deployment"
  value       = aws_iam_role.github_actions_deploy.arn
}

output "api_irsa_role_arn" {
  description = "IAM Role ARN for Kubernetes API service account (IRSA)"
  value       = aws_iam_role.parilink_api.arn
}

# ─── Monitoring ───────────────────────────────────────────────────────────────
output "alerts_sns_topic_arn" {
  description = "SNS Topic ARN for standard alerts"
  value       = aws_sns_topic.alerts.arn
}

output "critical_alerts_sns_topic_arn" {
  description = "SNS Topic ARN for critical/paging alerts"
  value       = aws_sns_topic.critical_alerts.arn
}

output "cloudwatch_dashboard_url" {
  description = "Operations CloudWatch dashboard URL"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=PariLink-${var.environment}-Operations"
}

output "aws_backup_vault_arn" {
  description = "AWS Backup vault ARN for DR procedures"
  value       = aws_backup_vault.main.arn
}

# ─── All Secret ARNs (for ExternalSecrets operator) ──────────────────────────
output "all_secret_arns" {
  description = "Map of all Secrets Manager ARNs for External Secrets Operator"
  value       = module.secrets.secret_arns
  sensitive   = true
}
