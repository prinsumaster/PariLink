# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — iam.tf
# IAM Roles and Policies:
#   1. EKS IRSA: API Service Account (Secrets Manager + S3 + SSM)
#   2. EKS IRSA: Worker nodes base policy
#   3. CI/CD Deployment Role (GitHub Actions OIDC)
#   4. Backup Role (AWS Backup service)
# ─────────────────────────────────────────────────────────────────────────────

# ─── EKS Cluster IAM Role ─────────────────────────────────────────────────────
resource "aws_iam_role" "eks_cluster" {
  name = "parilink-eks-cluster-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  role       = aws_iam_role.eks_cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# ─── EKS Node Group IAM Role ──────────────────────────────────────────────────
resource "aws_iam_role" "eks_nodes" {
  name = "parilink-eks-nodes-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node" {
  role       = aws_iam_role.eks_nodes.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_cni" {
  role       = aws_iam_role.eks_nodes.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "eks_ecr_readonly" {
  role       = aws_iam_role.eks_nodes.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "eks_ssm" {
  role       = aws_iam_role.eks_nodes.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ─── IRSA: PariLink API Service Account ───────────────────────────────────────
# Grants the Kubernetes service account least-privilege access to AWS services.

resource "aws_iam_role" "parilink_api" {
  name = "parilink-api-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRoleWithWebIdentity"
      Principal = {
        Federated = var.cluster_oidc_provider_arn
      }
      Condition = {
        StringEquals = {
          "${var.cluster_oidc_issuer_url}:sub" = "system:serviceaccount:default:parilink-api"
          "${var.cluster_oidc_issuer_url}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })
}

# Secrets Manager: Read-only access to PariLink secrets only
resource "aws_iam_role_policy" "api_secrets" {
  name = "parilink-api-secrets-${var.environment}"
  role = aws_iam_role.parilink_api.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:parilink/${var.environment}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = [
          aws_kms_key.secrets.arn
        ]
      }
    ]
  })
}

# S3: Read/Write uploads bucket; Read-only backups
resource "aws_iam_role_policy" "api_s3" {
  name = "parilink-api-s3-${var.environment}"
  role = aws_iam_role.parilink_api.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObjectVersion"
        ]
        Resource = "${aws_s3_bucket.uploads.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = aws_s3_bucket.uploads.arn
      }
    ]
  })
}

# ─── CI/CD Deployment Role (GitHub Actions OIDC) ──────────────────────────────
resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

resource "aws_iam_role" "github_actions_deploy" {
  name = "parilink-github-actions-deploy-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRoleWithWebIdentity"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github_actions.arn
      }
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:prinsumaster/PariLink:*"
        }
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "github_actions_ecr" {
  name = "parilink-github-actions-ecr-${var.environment}"
  role = aws_iam_role.github_actions_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:UpdateClusterConfig"
        ]
        Resource = "arn:aws:eks:${var.aws_region}:${data.aws_caller_identity.current.account_id}:cluster/parilink-${var.environment}"
      }
    ]
  })
}

# ─── AWS Backup Role ──────────────────────────────────────────────────────────
resource "aws_iam_role" "backup" {
  name = "parilink-backup-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "backup.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "backup_restore" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}

# ─── Variables ────────────────────────────────────────────────────────────────
variable "cluster_oidc_provider_arn" {
  description = "OIDC provider ARN from EKS module"
  type        = string
  default     = ""  # Populated after EKS cluster creation
}

variable "cluster_oidc_issuer_url" {
  description = "OIDC issuer URL from EKS cluster"
  type        = string
  default     = ""
}

variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "api_role_arn"           { value = aws_iam_role.parilink_api.arn }
output "eks_cluster_role_arn"   { value = aws_iam_role.eks_cluster.arn }
output "eks_nodes_role_arn"     { value = aws_iam_role.eks_nodes.arn }
output "deploy_role_arn"        { value = aws_iam_role.github_actions_deploy.arn }
output "backup_role_arn"        { value = aws_iam_role.backup.arn }
output "github_oidc_arn"        { value = aws_iam_openid_connect_provider.github_actions.arn }
