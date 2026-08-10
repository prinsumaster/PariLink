# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — Terraform Root Module
# AWS Production Infrastructure:
#   VPC + Multi-AZ subnets, EKS, RDS (Multi-AZ), ElastiCache, S3, CloudFront,
#   ACM, Route53, Secrets Manager, WAF, CloudWatch, IAM
# ─────────────────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "s3" {
    bucket         = "parilink-terraform-state-production"
    key            = "production/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "parilink-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "PariLink"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "platform-team"
      CostCenter  = "engineering"
    }
  }
}

# ─── Data Sources ─────────────────────────────────────────────────────────────
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# ─── 1. VPC ───────────────────────────────────────────────────────────────────
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.5"

  name = "parilink-${var.environment}"
  cidr = var.vpc_cidr

  azs = slice(data.aws_availability_zones.available.names, 0, 3)

  private_subnets  = var.private_subnet_cidrs
  public_subnets   = var.public_subnet_cidrs
  database_subnets = var.database_subnet_cidrs

  enable_nat_gateway     = true
  single_nat_gateway     = var.environment == "production" ? false : true
  one_nat_gateway_per_az = var.environment == "production"
  enable_dns_hostnames   = true
  enable_dns_support     = true

  # VPC Flow Logs for security audit
  enable_flow_log                      = true
  create_flow_log_cloudwatch_log_group = true
  create_flow_log_cloudwatch_iam_role  = true
  flow_log_max_aggregation_interval    = 60

  # Required tags for EKS
  private_subnet_tags = {
    "kubernetes.io/cluster/parilink-${var.environment}" = "shared"
    "kubernetes.io/role/internal-elb"                   = "1"
  }
  public_subnet_tags = {
    "kubernetes.io/cluster/parilink-${var.environment}" = "shared"
    "kubernetes.io/role/elb"                            = "1"
  }
}

# ─── 2. EKS Cluster ───────────────────────────────────────────────────────────
module "eks" {
  source      = "./modules/eks"
  environment = var.environment
  aws_region  = var.aws_region

  cluster_name    = "parilink-${var.environment}"
  cluster_version = var.eks_cluster_version

  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  node_instance_types_general = var.eks_node_instance_types
  node_min_size               = var.eks_min_nodes
  node_max_size               = var.eks_max_nodes
  node_desired_size           = var.eks_desired_nodes

  # High-memory node group for database-heavy workloads
  enable_memory_node_group = var.environment == "production"
}

# ─── 3. RDS PostgreSQL ────────────────────────────────────────────────────────
module "postgres" {
  source      = "./modules/postgres"
  environment = var.environment

  vpc_id           = module.vpc.vpc_id
  database_subnets = module.vpc.database_subnets

  instance_class    = var.rds_instance_class
  allocated_storage = var.rds_allocated_storage
  max_storage       = var.rds_max_storage

  multi_az                = var.environment == "production"
  read_replica_count      = var.environment == "production" ? 2 : 0
  backup_retention_days   = var.environment == "production" ? 35 : 7
  performance_insights    = true
  deletion_protection     = var.environment == "production"

  allowed_security_groups = [module.eks.node_security_group_id]
}

# ─── 4. ElastiCache Redis ─────────────────────────────────────────────────────
module "redis" {
  source      = "./modules/redis"
  environment = var.environment

  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  node_type        = var.redis_node_type
  num_cache_nodes  = var.environment == "production" ? 3 : 1
  cluster_mode     = var.environment == "production"
  automatic_failover = var.environment == "production"

  allowed_security_groups = [module.eks.node_security_group_id]
}

# ─── 5. S3 Buckets ───────────────────────────────────────────────────────────
module "s3" {
  source      = "./modules/s3"
  environment = var.environment
  aws_region  = var.aws_region
  account_id  = data.aws_caller_identity.current.account_id
}

# ─── 5b. ECR Repositories ────────────────────────────────────────────────────
resource "aws_ecr_repository" "api" {
  name                 = "parilink-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "parilink-api" }
}

resource "aws_ecr_repository" "web" {
  name                 = "parilink-web"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "parilink-web" }
}

resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 30 images"
      selection    = { tagStatus = "any", countType = "imageCountMoreThan", countNumber = 30 }
      action       = { type = "expire" }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "web" {
  repository = aws_ecr_repository.web.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 30 images"
      selection    = { tagStatus = "any", countType = "imageCountMoreThan", countNumber = 30 }
      action       = { type = "expire" }
    }]
  })
}

# ─── 6. CloudFront CDN ────────────────────────────────────────────────────────
module "cdn" {
  source      = "./modules/cdn"
  environment = var.environment
  domain_name = var.domain_name

  s3_bucket_id                 = module.s3.assets_bucket_id
  s3_bucket_regional_domain    = module.s3.assets_bucket_regional_domain
  alb_dns_name                 = module.alb.alb_dns_name
  acm_certificate_arn          = module.acm.certificate_arn
}

# ─── 7. ALB (Application Load Balancer) ──────────────────────────────────────
module "alb" {
  source      = "./modules/alb"
  environment = var.environment

  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnets
  domain_name    = var.domain_name
  certificate_arn = module.acm.certificate_arn
}

# ─── 8. ACM TLS Certificate ───────────────────────────────────────────────────
module "acm" {
  source      = "./modules/acm"
  domain_name = var.domain_name
  zone_id     = var.route53_zone_id
}

# ─── 9. Secrets Manager ───────────────────────────────────────────────────────
module "secrets" {
  source      = "./modules/secrets"
  environment = var.environment

  db_endpoint    = module.postgres.db_endpoint
  redis_endpoint = module.redis.redis_endpoint
}

# ─── 10. IAM Roles ───────────────────────────────────────────────────────────
module "iam" {
  source      = "./modules/iam"
  environment = var.environment
  account_id  = data.aws_caller_identity.current.account_id

  cluster_oidc_issuer_url = module.eks.cluster_oidc_issuer_url
  s3_bucket_arn           = module.s3.assets_bucket_arn
}

# ─── 11. WAF Web ACL ─────────────────────────────────────────────────────────
resource "aws_wafv2_web_acl" "parilink" {
  name        = "parilink-${var.environment}-waf"
  description = "PariLink WAF — OWASP Top 10 + Rate Limiting"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # Rule 1: AWS Managed OWASP Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 10
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "owasp-core"
      sampled_requests_enabled   = true
    }
  }

  # Rule 2: Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 20
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "known-bad-inputs"
      sampled_requests_enabled   = true
    }
  }

  # Rule 3: SQL Injection protection
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 30
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "sqli-protection"
      sampled_requests_enabled   = true
    }
  }

  # Rule 4: Rate limiting per IP (1000 req/5min)
  rule {
    name     = "RateLimitPerIP"
    priority = 40
    action { block {} }
    statement {
      rate_based_statement {
        limit              = 1000
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "rate-limit-per-ip"
      sampled_requests_enabled   = true
    }
  }

  # Rule 5: Block IPs from high-risk countries (configurable)
  rule {
    name     = "GeoRestriction"
    priority = 50
    action { count {} }  # Set to block {} for production geo-restriction
    statement {
      geo_match_statement {
        country_codes = var.blocked_country_codes
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "geo-restriction"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "parilink-waf"
    sampled_requests_enabled   = true
  }

  tags = {
    Name = "parilink-${var.environment}-waf"
  }
}

# Associate WAF with ALB
resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = module.alb.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.parilink.arn
}

# ─── 12. CloudWatch Alarms & SNS ─────────────────────────────────────────────
resource "aws_sns_topic" "alerts" {
  name              = "parilink-${var.environment}-alerts"
  kms_master_key_id = "alias/aws/sns"
}

resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "parilink-${var.environment}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS CPU utilization > 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = module.postgres.db_identifier
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_storage" {
  alarm_name          = "parilink-${var.environment}-rds-low-storage"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 10000000000  # 10 GB in bytes
  alarm_description   = "RDS free storage < 10GB"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = module.postgres.db_identifier
  }
}

resource "aws_cloudwatch_metric_alarm" "elasticache_cpu" {
  alarm_name          = "parilink-${var.environment}-redis-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 70
  alarm_description   = "Redis CPU utilization > 70%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "cluster_name" {
  value = module.eks.cluster_name
}
output "cluster_endpoint" {
  value     = module.eks.cluster_endpoint
  sensitive = true
}
output "vpc_id" {
  value = module.vpc.vpc_id
}
output "rds_endpoint" {
  value     = module.postgres.db_endpoint
  sensitive = true
}
output "redis_endpoint" {
  value     = module.redis.redis_endpoint
  sensitive = true
}
output "cloudfront_domain" {
  value = module.cdn.cloudfront_domain_name
}
output "waf_arn" {
  value = aws_wafv2_web_acl.parilink.arn
}
output "alert_topic_arn" {
  value = aws_sns_topic.alerts.arn
}
