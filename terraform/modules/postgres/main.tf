# ─────────────────────────────────────────────────────────────────────────────
# Terraform Module: RDS PostgreSQL — Production
# Multi-AZ, read replicas, Enhanced Monitoring, Performance Insights,
# automated backups 35 days, PITR, encryption at rest, Secrets Manager rotation
# ─────────────────────────────────────────────────────────────────────────────

variable "vpc_id"                 { type = string }
variable "database_subnets"      { type = list(string) }
variable "environment"           { type = string }
variable "instance_class"        { type = string }
variable "allocated_storage"     { type = number }
variable "max_storage"           { type = number }
variable "multi_az"              { type = bool; default = true }
variable "read_replica_count"    { type = number; default = 2 }
variable "backup_retention_days" { type = number; default = 35 }
variable "performance_insights"  { type = bool; default = true }
variable "deletion_protection"   { type = bool; default = true }
variable "allowed_security_groups" { type = list(string) }

# ─── KMS Key for RDS Encryption ───────────────────────────────────────────────
resource "aws_kms_key" "rds" {
  description             = "PariLink RDS encryption key — ${var.environment}"
  enable_key_rotation     = true
  deletion_window_in_days = 30

  tags = { Name = "parilink-rds-${var.environment}" }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/parilink-rds-${var.environment}"
  target_key_id = aws_kms_key.rds.key_id
}

# ─── Security Group ───────────────────────────────────────────────────────────
resource "aws_security_group" "rds" {
  name        = "parilink-rds-${var.environment}"
  description = "PariLink RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_groups
    description     = "PostgreSQL from EKS worker nodes"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ─── DB Subnet Group ──────────────────────────────────────────────────────────
resource "aws_db_subnet_group" "postgres" {
  name       = "parilink-postgres-${var.environment}"
  subnet_ids = var.database_subnets

  tags = { Name = "parilink-postgres-${var.environment}" }
}

# ─── Parameter Group ─────────────────────────────────────────────────────────
resource "aws_db_parameter_group" "postgres" {
  name   = "parilink-postgres15-${var.environment}"
  family = "postgres15"

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,auto_explain"
  }
  parameter {
    name  = "log_statement"
    value = "ddl"
  }
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"  # Log queries > 1s
  }
  parameter {
    name  = "pg_stat_statements.track"
    value = "all"
  }
  parameter {
    name  = "auto_explain.log_min_duration"
    value = "5000"  # Auto explain queries > 5s
  }
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
  parameter {
    name  = "max_connections"
    value = "500"
  }
  parameter {
    name  = "work_mem"
    value = "16384"  # 16 MB per sort operation
  }
  parameter {
    name  = "maintenance_work_mem"
    value = "1048576"  # 1 GB for VACUUM, CREATE INDEX
  }
  parameter {
    name  = "effective_cache_size"
    value = "12288000"  # 12 GB effective cache (75% of instance RAM)
  }
  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }
  parameter {
    name  = "wal_buffers"
    value = "16384"  # 16 MB WAL buffer
  }
}

# ─── Primary Instance ─────────────────────────────────────────────────────────
resource "aws_db_instance" "postgres" {
  identifier = "parilink-${var.environment}"

  engine         = "postgres"
  engine_version = "15.7"
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn
  iops                  = 3000

  db_name  = "parilink"
  username = "parilink_admin"
  # Password managed by Secrets Manager — set to random initial value
  password = random_password.db_password.result

  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.postgres.name

  # HA / Reliability
  multi_az               = var.multi_az
  backup_retention_period = var.backup_retention_days
  backup_window          = "01:00-02:00"
  maintenance_window     = "sun:03:00-sun:04:00"
  copy_tags_to_snapshot  = true
  skip_final_snapshot    = false
  final_snapshot_identifier = "parilink-${var.environment}-final-${formatdate("YYYY-MM-DD", timestamp())}"

  # Security
  publicly_accessible    = false
  deletion_protection    = var.deletion_protection
  iam_database_authentication_enabled = true

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  monitoring_interval             = 60
  monitoring_role_arn             = aws_iam_role.rds_enhanced_monitoring.arn
  performance_insights_enabled    = var.performance_insights
  performance_insights_retention_period = 7
  performance_insights_kms_key_id = aws_kms_key.rds.arn

  # Automatic minor version upgrades
  auto_minor_version_upgrade = true

  tags = {
    Name        = "parilink-primary-${var.environment}"
    Environment = var.environment
    Backup      = "true"
    Compliance  = "pci-dss,soc2"
  }

  lifecycle {
    prevent_destroy       = true
    ignore_changes        = [password]  # Managed by Secrets Manager
  }
}

# ─── Read Replicas ────────────────────────────────────────────────────────────
resource "aws_db_instance" "replica" {
  count = var.read_replica_count

  identifier = "parilink-${var.environment}-replica-${count.index + 1}"

  replicate_source_db = aws_db_instance.postgres.identifier
  instance_class      = var.instance_class
  storage_encrypted   = true
  kms_key_id          = aws_kms_key.rds.arn

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn

  performance_insights_enabled          = var.performance_insights
  performance_insights_retention_period = 7

  publicly_accessible    = false
  auto_minor_version_upgrade = true

  tags = {
    Name        = "parilink-replica-${count.index + 1}-${var.environment}"
    Environment = var.environment
    Role        = "read-replica"
  }
}

# ─── Password Generation ──────────────────────────────────────────────────────
resource "random_password" "db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# ─── Secrets Manager — Store & Auto-Rotate Credentials ───────────────────────
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "parilink/${var.environment}/database"
  description = "PariLink PostgreSQL credentials"
  kms_key_id  = aws_kms_key.rds.arn

  rotation_rules {
    automatically_after_days = 30
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = aws_db_instance.postgres.username
    password = random_password.db_password.result
    host     = aws_db_instance.postgres.address
    port     = aws_db_instance.postgres.port
    dbname   = aws_db_instance.postgres.db_name
    url      = "postgresql://${aws_db_instance.postgres.username}:${random_password.db_password.result}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${aws_db_instance.postgres.db_name}"
  })
}

# ─── Enhanced Monitoring IAM Role ─────────────────────────────────────────────
resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "parilink-rds-monitoring-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "db_endpoint"           { value = aws_db_instance.postgres.address; sensitive = true }
output "db_identifier"         { value = aws_db_instance.postgres.id }
output "db_port"               { value = aws_db_instance.postgres.port }
output "replica_endpoints"     { value = aws_db_instance.replica[*].address; sensitive = true }
output "secrets_manager_arn"   { value = aws_secretsmanager_secret.db_credentials.arn }
output "security_group_id"     { value = aws_security_group.rds.id }
