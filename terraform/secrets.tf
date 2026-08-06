# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — secrets.tf
# Secrets Manager entries for all runtime credentials.
# Secrets are created as placeholders here; values are set by:
#   a) RDS/Redis module outputs (auto-wired)
#   b) GitHub Actions CI for third-party API keys
# ─────────────────────────────────────────────────────────────────────────────

# ─── OpenAI / LLM API Keys ────────────────────────────────────────────────────
resource "aws_secretsmanager_secret" "openai" {
  name        = "parilink/${var.environment}/openai"
  description = "PariLink AI Platform — OpenAI API Key"
  kms_key_id  = aws_kms_key.secrets.arn

  recovery_window_in_days = 30

  tags = { Environment = var.environment }
}

# ─── JWT Secret ───────────────────────────────────────────────────────────────
resource "aws_secretsmanager_secret" "jwt" {
  name        = "parilink/${var.environment}/jwt"
  description = "PariLink JWT signing secret"
  kms_key_id  = aws_kms_key.secrets.arn
}

resource "random_password" "jwt_secret" {
  length  = 64
  special = true
}

resource "aws_secretsmanager_secret_version" "jwt" {
  secret_id     = aws_secretsmanager_secret.jwt.id
  secret_string = jsonencode({ JWT_SECRET = random_password.jwt_secret.result })
}

# ─── Samsara ELD API Key ──────────────────────────────────────────────────────
resource "aws_secretsmanager_secret" "samsara" {
  name        = "parilink/${var.environment}/integrations/samsara"
  description = "Samsara Fleet Telematics API Key"
  kms_key_id  = aws_kms_key.secrets.arn
}

# ─── Stripe / Payment Keys ────────────────────────────────────────────────────
resource "aws_secretsmanager_secret" "stripe" {
  name        = "parilink/${var.environment}/payments/stripe"
  description = "Stripe Payment Gateway Keys"
  kms_key_id  = aws_kms_key.secrets.arn
}

# ─── SMTP / SendGrid ──────────────────────────────────────────────────────────
resource "aws_secretsmanager_secret" "smtp" {
  name        = "parilink/${var.environment}/notifications/smtp"
  description = "SMTP / SendGrid API credentials"
  kms_key_id  = aws_kms_key.secrets.arn
}

# ─── Secret Reference Map (for EKS ExternalSecrets operator) ─────────────────
# Applications pull secrets at runtime via the AWS External Secrets Operator.
# No secrets are embedded in Kubernetes manifests.

output "secret_arns" {
  description = "Map of all secret ARNs for ExternalSecrets operator configuration"
  value = {
    database = module.postgres.secrets_manager_arn
    redis    = module.redis.redis_secret_arn
    jwt      = aws_secretsmanager_secret.jwt.arn
    openai   = aws_secretsmanager_secret.openai.arn
    samsara  = aws_secretsmanager_secret.samsara.arn
    stripe   = aws_secretsmanager_secret.stripe.arn
    smtp     = aws_secretsmanager_secret.smtp.arn
  }
  sensitive = true
}
