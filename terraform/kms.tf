# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — kms.tf
# Customer-managed KMS keys for every service requiring encryption at rest.
# Key rotation is enforced. Deletion window = 30 days.
# ─────────────────────────────────────────────────────────────────────────────

data "aws_iam_policy_document" "kms_default" {
  statement {
    sid    = "Enable IAM User Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions   = ["kms:*"]
    resources = ["*"]
  }
}

# ─── CloudWatch KMS Key ───────────────────────────────────────────────────────
resource "aws_kms_key" "cloudwatch" {
  description             = "PariLink CloudWatch Logs — ${var.environment}"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy                  = data.aws_iam_policy_document.kms_cloudwatch.json
}

data "aws_iam_policy_document" "kms_cloudwatch" {
  statement {
    sid    = "Enable Root Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions   = ["kms:*"]
    resources = ["*"]
  }

  statement {
    sid    = "Allow CloudWatch Logs"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["logs.${var.aws_region}.amazonaws.com"]
    }
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey"
    ]
    resources = ["*"]
    condition {
      test     = "ArnLike"
      variable = "kms:EncryptionContext:aws:logs:arn"
      values   = ["arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"]
    }
  }
}

resource "aws_kms_alias" "cloudwatch" {
  name          = "alias/parilink-cloudwatch-${var.environment}"
  target_key_id = aws_kms_key.cloudwatch.key_id
}

# ─── Secrets Manager KMS Key ──────────────────────────────────────────────────
resource "aws_kms_key" "secrets" {
  description             = "PariLink Secrets Manager — ${var.environment}"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy                  = data.aws_iam_policy_document.kms_default.json
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/parilink-secrets-${var.environment}"
  target_key_id = aws_kms_key.secrets.key_id
}

# ─── EKS KMS Key (Secret Envelope Encryption) ─────────────────────────────────
resource "aws_kms_key" "eks" {
  description             = "PariLink EKS Kubernetes Secrets — ${var.environment}"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy                  = data.aws_iam_policy_document.kms_default.json
}

resource "aws_kms_alias" "eks" {
  name          = "alias/parilink-eks-${var.environment}"
  target_key_id = aws_kms_key.eks.key_id
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "kms_cloudwatch_arn" { value = aws_kms_key.cloudwatch.arn }
output "kms_secrets_arn"    { value = aws_kms_key.secrets.arn }
output "kms_eks_arn"        { value = aws_kms_key.eks.arn }
