# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — s3.tf
# Wires the S3 module to global context. Adds missing:
#   - uploads bucket (separate from assets)
#   - logs bucket (for ALB/CloudFront access logs)
# ─────────────────────────────────────────────────────────────────────────────

module "s3" {
  source      = "./modules/s3"
  environment = var.environment
  aws_region  = var.aws_region
  account_id  = data.aws_caller_identity.current.account_id
}

# ─── Uploads Bucket (driver POD photos, signed POD docs) ─────────────────────
resource "aws_s3_bucket" "uploads" {
  bucket = "parilink-uploads-${var.environment}-${data.aws_caller_identity.current.account_id}"
  tags = {
    Name      = "parilink-uploads-${var.environment}"
    DataClass = "confidential"
  }
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = module.s3.kms_key_arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://*.${var.domain_name}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule {
    id     = "uploads-archive"
    status = "Enabled"
    transition {
      days          = 180
      storage_class = "STANDARD_IA"
    }
    transition {
      days          = 730
      storage_class = "GLACIER"
    }
  }
}

# ─── Access Logs Bucket (ALB + CloudFront logs) ───────────────────────────────
resource "aws_s3_bucket" "logs" {
  bucket = "parilink-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"
  tags   = { Name = "parilink-logs-${var.environment}" }
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule { object_ownership = "BucketOwnerPreferred" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"  # ALB requires AES256 for access logs
    }
  }
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket                  = aws_s3_bucket.logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    id     = "log-expiry"
    status = "Enabled"
    expiration { days = 90 }
  }
}

# Allow ALB to write access logs
resource "aws_s3_bucket_policy" "logs" {
  bucket = aws_s3_bucket.logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowALBLogs"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_elb_service_account.main.id}:root"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.logs.arn}/alb/*"
      },
      {
        Sid    = "AllowCloudFrontLogs"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.logs.arn}/cloudfront/*"
      }
    ]
  })
}

data "aws_elb_service_account" "main" {}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "uploads_bucket_id"  { value = aws_s3_bucket.uploads.id }
output "uploads_bucket_arn" { value = aws_s3_bucket.uploads.arn }
output "logs_bucket_id"     { value = aws_s3_bucket.logs.id }
output "logs_bucket_arn"    { value = aws_s3_bucket.logs.arn }
