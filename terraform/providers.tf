# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — providers.tf
# AWS provider configuration with default tags applied to ALL resources.
# ─────────────────────────────────────────────────────────────────────────────

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "PariLink"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "platform-team"
      CostCenter  = "engineering"
      Repository  = "github.com/parilink/infra"
    }
  }
}

# Secondary provider for us-east-1 (required for ACM + CloudFront + WAF Global)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "PariLink"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "platform-team"
    }
  }
}

provider "random" {}
provider "tls" {}
