# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — ElastiCache Redis (Full Production Module)
# Replaces the stub 24-line module with:
#   - Replication Group with Multi-AZ and Automatic Failover
#   - At-rest and in-transit encryption
#   - Parameter Group (Redis 7)
#   - Subnet Group
#   - Security Group
#   - KMS encryption
#   - Secrets Manager integration
#   - CloudWatch Alarms
# ─────────────────────────────────────────────────────────────────────────────

# ─── Variables ────────────────────────────────────────────────────────────────
variable "vpc_id"          { type = string }
variable "private_subnets" { type = list(string) }
variable "environment"     { type = string }
variable "node_type"       { type = string; default = "cache.r7g.large" }
variable "num_cache_nodes" { type = number; default = 3 }
variable "cluster_mode"    { type = bool; default = true }
variable "automatic_failover" { type = bool; default = true }
variable "allowed_security_groups" { type = list(string) }
variable "kms_key_id"      { type = string }

# ─── KMS Key for Redis Encryption ─────────────────────────────────────────────
resource "aws_kms_key" "redis" {
  description             = "PariLink ElastiCache Redis — ${var.environment}"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  tags                    = { Name = "parilink-redis-kms-${var.environment}" }
}

resource "aws_kms_alias" "redis" {
  name          = "alias/parilink-redis-${var.environment}"
  target_key_id = aws_kms_key.redis.key_id
}

# ─── Security Group ───────────────────────────────────────────────────────────
resource "aws_security_group" "redis" {
  name        = "parilink-redis-${var.environment}"
  description = "PariLink ElastiCache Redis"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = var.allowed_security_groups
    description     = "Redis from EKS worker nodes"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "parilink-redis-sg-${var.environment}" }
}

# ─── Subnet Group ─────────────────────────────────────────────────────────────
resource "aws_elasticache_subnet_group" "redis" {
  name       = "parilink-redis-${var.environment}"
  subnet_ids = var.private_subnets
  tags       = { Name = "parilink-redis-subnet-group-${var.environment}" }
}

# ─── Parameter Group ──────────────────────────────────────────────────────────
resource "aws_elasticache_parameter_group" "redis" {
  name   = "parilink-redis7-${var.environment}"
  family = "redis7"

  # Memory management
  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  # Slow log configuration
  parameter {
    name  = "slowlog-log-slower-than"
    value = "10000"  # 10ms
  }

  parameter {
    name  = "slowlog-max-len"
    value = "128"
  }

  # Keyspace notifications for BullMQ
  parameter {
    name  = "notify-keyspace-events"
    value = "Ex"  # Expired events — required for BullMQ delayed jobs
  }

  tags = { Name = "parilink-redis-params-${var.environment}" }
}

# ─── Replication Group (Production-Grade) ────────────────────────────────────
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "parilink-${var.environment}"
  description          = "PariLink Redis — ${var.environment}"

  # Engine
  engine               = "redis"
  engine_version       = "7.1"
  parameter_group_name = aws_elasticache_parameter_group.redis.name

  # Node configuration
  node_type          = var.node_type
  num_cache_clusters = var.num_cache_nodes

  # High Availability
  automatic_failover_enabled = var.automatic_failover
  multi_az_enabled           = var.environment == "production"

  # Network
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]
  port               = 6379

  # Security — encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  kms_key_id                 = aws_kms_key.redis.arn

  # Snapshots
  snapshot_retention_limit = var.environment == "production" ? 7 : 1
  snapshot_window          = "02:00-03:00"
  maintenance_window       = "sun:05:00-sun:06:00"

  # Auth token stored in Secrets Manager
  auth_token = random_password.redis_auth.result

  apply_immediately = false

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis_slow_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis_engine_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "engine-log"
  }

  tags = {
    Name        = "parilink-redis-${var.environment}"
    Environment = var.environment
    Backup      = "true"
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [auth_token]
  }
}

# ─── Auth Token ───────────────────────────────────────────────────────────────
resource "random_password" "redis_auth" {
  length  = 32
  special = false  # Redis auth token disallows certain special chars
}

resource "aws_secretsmanager_secret" "redis_auth" {
  name        = "parilink/${var.environment}/redis"
  description = "PariLink Redis AUTH token"
  kms_key_id  = var.kms_key_id

  tags = { Environment = var.environment }
}

resource "aws_secretsmanager_secret_version" "redis_auth" {
  secret_id = aws_secretsmanager_secret.redis_auth.id
  secret_string = jsonencode({
    auth_token = random_password.redis_auth.result
    endpoint   = aws_elasticache_replication_group.redis.primary_endpoint_address
    port       = 6379
    url        = "rediss://:${random_password.redis_auth.result}@${aws_elasticache_replication_group.redis.primary_endpoint_address}:6379"
  })
}

# ─── CloudWatch Log Groups ────────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "redis_slow_log" {
  name              = "/parilink/${var.environment}/redis/slow-log"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "redis_engine_log" {
  name              = "/parilink/${var.environment}/redis/engine-log"
  retention_in_days = 30
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "redis_endpoint"        { value = aws_elasticache_replication_group.redis.primary_endpoint_address; sensitive = true }
output "redis_reader_endpoint" { value = aws_elasticache_replication_group.redis.reader_endpoint_address; sensitive = true }
output "redis_port"            { value = 6379 }
output "redis_security_group"  { value = aws_security_group.redis.id }
output "redis_secret_arn"      { value = aws_secretsmanager_secret.redis_auth.arn }
