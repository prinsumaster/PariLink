# ─────────────────────────────────────────────────────────────────────────────
# Terraform Module: S3 Buckets
# ─────────────────────────────────────────────────────────────────────────────

variable "environment" { type = string }
variable "aws_region"  { type = string }
variable "account_id"  { type = string }

# ─── KMS Key for S3 Encryption ───────────────────────────────────────────────
resource "aws_kms_key" "s3" {
  description         = "PariLink S3 encryption key — ${var.environment}"
  enable_key_rotation = true
}

resource "aws_kms_alias" "s3" {
  name          = "alias/parilink-s3-${var.environment}"
  target_key_id = aws_kms_key.s3.key_id
}

# ─── Assets Bucket (POD, Documents, Receipts) ────────────────────────────────
resource "aws_s3_bucket" "assets" {
  bucket = "parilink-assets-${var.environment}-${var.account_id}"

  tags = {
    Name        = "parilink-assets-${var.environment}"
    Environment = var.environment
    DataClass   = "confidential"
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    id     = "transition-to-ia"
    status = "Enabled"
    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }
    transition {
      days          = 365
      storage_class = "GLACIER"
    }
    expiration {
      days = 2555  # 7 years for compliance
    }
  }
}

# ─── Backups Bucket ───────────────────────────────────────────────────────────
resource "aws_s3_bucket" "backups" {
  bucket = "parilink-backups-${var.environment}-${var.account_id}"
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket                  = aws_s3_bucket.backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_object_lock_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    default_retention {
      mode = "GOVERNANCE"
      days = 90
    }
  }
}

# ─── Terraform State Bucket ───────────────────────────────────────────────────
resource "aws_s3_bucket" "terraform_state" {
  bucket = "parilink-terraform-state-${var.environment}"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "parilink-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }

  point_in_time_recovery {
    enabled = true
  }
}

output "assets_bucket_id"              { value = aws_s3_bucket.assets.id }
output "assets_bucket_arn"             { value = aws_s3_bucket.assets.arn }
output "assets_bucket_regional_domain" { value = aws_s3_bucket.assets.bucket_regional_domain_name }
output "backups_bucket_id"             { value = aws_s3_bucket.backups.id }
output "kms_key_arn"                   { value = aws_kms_key.s3.arn }
