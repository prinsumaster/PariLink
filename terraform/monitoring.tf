# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — monitoring.tf
# CloudWatch Alarms, Log Groups, SNS Topics, and AWS Backup Vaults.
# Covers: RDS, ElastiCache, EKS, ALB, WAF, and application-level metrics.
# ─────────────────────────────────────────────────────────────────────────────

# ─── SNS Alert Topic ──────────────────────────────────────────────────────────
resource "aws_sns_topic" "alerts" {
  name              = "parilink-${var.environment}-alerts"
  kms_master_key_id = aws_kms_key.cloudwatch.id

  tags = { Environment = var.environment }
}

resource "aws_sns_topic" "critical_alerts" {
  name              = "parilink-${var.environment}-critical"
  kms_master_key_id = aws_kms_key.cloudwatch.id

  tags = { Environment = var.environment }
}

resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ─── CloudWatch Log Groups ────────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "api" {
  name              = "/parilink/${var.environment}/api"
  retention_in_days = var.environment == "production" ? 365 : 30
  kms_key_id        = aws_kms_key.cloudwatch.arn
}

resource "aws_cloudwatch_log_group" "worker" {
  name              = "/parilink/${var.environment}/worker"
  retention_in_days = var.environment == "production" ? 365 : 30
  kms_key_id        = aws_kms_key.cloudwatch.arn
}

resource "aws_cloudwatch_log_group" "nginx" {
  name              = "/parilink/${var.environment}/nginx"
  retention_in_days = 90
  kms_key_id        = aws_kms_key.cloudwatch.arn
}

# ─── RDS Alarms ───────────────────────────────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "parilink-${var.environment}-rds-cpu-high"
  alarm_description   = "RDS CPU > 80% for 10 minutes"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = { DBInstanceIdentifier = module.postgres.db_identifier }
}

resource "aws_cloudwatch_metric_alarm" "rds_free_storage" {
  alarm_name          = "parilink-${var.environment}-rds-storage-low"
  alarm_description   = "RDS Free Storage < 10 GB"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 10737418240  # 10 GB in bytes
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = { DBInstanceIdentifier = module.postgres.db_identifier }
}

resource "aws_cloudwatch_metric_alarm" "rds_connections" {
  alarm_name          = "parilink-${var.environment}-rds-connections-high"
  alarm_description   = "RDS Connection count > 450 (limit 500)"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 60
  statistic           = "Average"
  threshold           = 450
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]

  dimensions = { DBInstanceIdentifier = module.postgres.db_identifier }
}

resource "aws_cloudwatch_metric_alarm" "rds_replication_lag" {
  alarm_name          = "parilink-${var.environment}-rds-replica-lag"
  alarm_description   = "RDS Replica Lag > 30 seconds"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ReplicaLag"
  namespace           = "AWS/RDS"
  period              = 60
  statistic           = "Average"
  threshold           = 30
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"
}

# ─── ElastiCache Alarms ───────────────────────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "redis_cpu" {
  alarm_name          = "parilink-${var.environment}-redis-cpu-high"
  alarm_description   = "Redis CPU > 70%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 70
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "redis_memory" {
  alarm_name          = "parilink-${var.environment}-redis-memory-high"
  alarm_description   = "Redis Database Memory Usage Percentage > 80%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseMemoryUsagePercentage"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]
  treat_missing_data  = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "redis_evictions" {
  alarm_name          = "parilink-${var.environment}-redis-evictions"
  alarm_description   = "Redis Evictions > 0 (memory pressure)"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Evictions"
  namespace           = "AWS/ElastiCache"
  period              = 60
  statistic           = "Sum"
  threshold           = 0
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"
}

# ─── Application-Level Alarms (custom metrics from API) ──────────────────────
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "parilink-${var.environment}-api-5xx-rate"
  alarm_description   = "API 5xx error rate > 1%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXErrorRate"
  namespace           = "PariLink/API"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]
  treat_missing_data  = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "api_p99_latency" {
  alarm_name          = "parilink-${var.environment}-api-p99-latency"
  alarm_description   = "API P99 latency > 2000ms"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "P99Latency"
  namespace           = "PariLink/API"
  period              = 60
  extended_statistic  = "p99"
  threshold           = 2000
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "bullmq_queue_depth" {
  alarm_name          = "parilink-${var.environment}-queue-depth"
  alarm_description   = "BullMQ job queue depth > 10,000"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "QueueDepth"
  namespace           = "PariLink/Workers"
  period              = 60
  statistic           = "Average"
  threshold           = 10000
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"
}

# ─── CloudWatch Dashboard ─────────────────────────────────────────────────────
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "PariLink-${var.environment}-Operations"

  dashboard_body = jsonencode({
    widgets = [
      {
        type       = "metric"
        properties = {
          title   = "RDS CPU Utilization"
          metrics = [["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", module.postgres.db_identifier]]
          period  = 300
          stat    = "Average"
        }
      },
      {
        type       = "metric"
        properties = {
          title   = "Redis Memory Usage %"
          metrics = [["AWS/ElastiCache", "DatabaseMemoryUsagePercentage"]]
          period  = 300
          stat    = "Average"
        }
      },
      {
        type       = "metric"
        properties = {
          title   = "API 5xx Errors"
          metrics = [["PariLink/API", "5XXErrorRate"]]
          period  = 60
          stat    = "Sum"
        }
      },
      {
        type       = "metric"
        properties = {
          title   = "BullMQ Queue Depth"
          metrics = [["PariLink/Workers", "QueueDepth"]]
          period  = 60
          stat    = "Average"
        }
      }
    ]
  })
}

# ─── AWS Backup Vault & Plan ───────────────────────────────────────────────────
resource "aws_backup_vault" "main" {
  name        = "parilink-${var.environment}"
  kms_key_arn = aws_kms_key.cloudwatch.arn
  tags        = { Environment = var.environment }
}

resource "aws_backup_plan" "rds_daily" {
  name = "parilink-rds-daily-${var.environment}"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 2 * * ? *)"  # 02:00 UTC daily

    lifecycle {
      cold_storage_after = 30
      delete_after       = 365
    }

    copy_action {
      destination_vault_arn = aws_backup_vault.main.arn
      lifecycle {
        delete_after = 365
      }
    }
  }

  rule {
    rule_name         = "weekly-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 3 ? * SUN *)"  # Sunday 03:00 UTC

    lifecycle {
      cold_storage_after = 90
      delete_after       = 2555  # 7 years
    }
  }
}

resource "aws_backup_selection" "rds" {
  name         = "parilink-rds-${var.environment}"
  plan_id      = aws_backup_plan.rds_daily.id
  iam_role_arn = aws_iam_role.backup.arn

  resources = [
    "arn:aws:rds:${var.aws_region}:${data.aws_caller_identity.current.account_id}:db:parilink-${var.environment}"
  ]
}

# ─── Variables ────────────────────────────────────────────────────────────────
variable "alert_email" {
  description = "Operations team email for CloudWatch alarm notifications"
  type        = string
  default     = "ops@parilink.app"
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "alerts_topic_arn"          { value = aws_sns_topic.alerts.arn }
output "critical_alerts_topic_arn" { value = aws_sns_topic.critical_alerts.arn }
output "api_log_group_name"        { value = aws_cloudwatch_log_group.api.name }
output "backup_vault_arn"          { value = aws_backup_vault.main.arn }
output "dashboard_url" {
  value = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=PariLink-${var.environment}-Operations"
}
