# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — variables.tf (COMPLETE)
# All input variables with validation, descriptions, and sensible defaults.
# ─────────────────────────────────────────────────────────────────────────────

# ─── Global ───────────────────────────────────────────────────────────────────
variable "aws_region" {
  description = "AWS region. Default: ap-south-1 (Mumbai) for India-first deployment."
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment. Must be one of: staging, production, dr."
  type        = string

  validation {
    condition     = contains(["staging", "production", "dr"], var.environment)
    error_message = "environment must be one of: staging, production, dr."
  }
}

variable "domain_name" {
  description = "Base domain for PariLink (e.g. parilink.app)"
  type        = string
  default     = "parilink.app"
}

variable "route53_zone_id" {
  description = "Route53 Hosted Zone ID for the domain."
  type        = string
  sensitive   = true
  default     = ""
}

variable "alert_email" {
  description = "Operations team email address for CloudWatch alarm notifications."
  type        = string
  default     = "ops@parilink.app"
}

# ─── Networking ───────────────────────────────────────────────────────────────
variable "vpc_cidr" {
  description = "VPC CIDR block."
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "vpc_cidr must be a valid IPv4 CIDR block."
  }
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs (one per AZ — 3 required)."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  validation {
    condition     = length(var.public_subnet_cidrs) == 3
    error_message = "Exactly 3 public subnet CIDRs required."
  }
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs (one per AZ — 3 required)."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]

  validation {
    condition     = length(var.private_subnet_cidrs) == 3
    error_message = "Exactly 3 private subnet CIDRs required."
  }
}

variable "database_subnet_cidrs" {
  description = "Isolated database subnet CIDRs (one per AZ — 3 required)."
  type        = list(string)
  default     = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]

  validation {
    condition     = length(var.database_subnet_cidrs) == 3
    error_message = "Exactly 3 database subnet CIDRs required."
  }
}

variable "allowed_ip_ranges" {
  description = "Office/VPN IP CIDR ranges allowed for administrative access."
  type        = list(string)
  default     = []
}

variable "blocked_country_codes" {
  description = "ISO 3166-1 alpha-2 country codes to block at WAF level."
  type        = list(string)
  default     = []
}

# ─── EKS ──────────────────────────────────────────────────────────────────────
variable "eks_cluster_version" {
  description = "Kubernetes version for EKS cluster."
  type        = string
  default     = "1.31"
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for the general-purpose EKS node group."
  type        = list(string)
  default     = ["m6i.xlarge", "m6a.xlarge"]  # 4 vCPU, 16 GiB — cost-optimised + performance mix
}

variable "eks_min_nodes" {
  description = "Minimum number of EKS worker nodes."
  type        = number
  default     = 3

  validation {
    condition     = var.eks_min_nodes >= 2
    error_message = "Minimum 2 nodes required for HA."
  }
}

variable "eks_max_nodes" {
  description = "Maximum number of EKS worker nodes (autoscaler ceiling)."
  type        = number
  default     = 20
}

variable "eks_desired_nodes" {
  description = "Desired EKS worker node count at steady state."
  type        = number
  default     = 5
}

variable "cluster_oidc_provider_arn" {
  description = "OIDC Provider ARN created by EKS (needed for IRSA). Populated after first apply."
  type        = string
  default     = ""
}

variable "cluster_oidc_issuer_url" {
  description = "OIDC Issuer URL from EKS cluster. Populated after first apply."
  type        = string
  default     = ""
}

# ─── RDS ──────────────────────────────────────────────────────────────────────
variable "rds_instance_class" {
  description = "RDS instance class. Use db.r7g.large for staging, db.r7g.xlarge for production."
  type        = string
  default     = "db.r7g.xlarge"  # 4 vCPU, 32 GiB

  validation {
    condition     = startswith(var.rds_instance_class, "db.")
    error_message = "rds_instance_class must be a valid RDS instance class starting with 'db.'."
  }
}

variable "rds_allocated_storage" {
  description = "Initial allocated storage for RDS in GB."
  type        = number
  default     = 100

  validation {
    condition     = var.rds_allocated_storage >= 20
    error_message = "RDS storage must be at least 20 GB."
  }
}

variable "rds_max_storage" {
  description = "Maximum autoscale storage ceiling for RDS in GB."
  type        = number
  default     = 2000
}

# ─── Redis ────────────────────────────────────────────────────────────────────
variable "redis_node_type" {
  description = "ElastiCache node type. Use cache.t4g.small for staging, cache.r7g.large for production."
  type        = string
  default     = "cache.r7g.large"  # 2 vCPU, 13 GiB
}

# ─── Security ─────────────────────────────────────────────────────────────────
variable "enable_waf" {
  description = "Enable AWS WAFv2 Web ACL on the ALB."
  type        = bool
  default     = true
}

variable "enable_shield_advanced" {
  description = "Enable AWS Shield Advanced (DDoS protection). Costs $3,000/month."
  type        = bool
  default     = false  # Enable for production when revenue justifies
}
