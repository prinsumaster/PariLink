# ─────────────────────────────────────────────────────────────────────────────
# Terraform Module: EKS — Production-Grade
# Features: Managed node groups (system, app, spot, gpu), IRSA, cluster add-ons,
# Bottlerocket OS, cluster access logging, OIDC provider.
# ─────────────────────────────────────────────────────────────────────────────

variable "cluster_name"                { type = string }
variable "cluster_version"             { type = string }
variable "vpc_id"                      { type = string }
variable "private_subnets"             { type = list(string) }
variable "environment"                 { type = string }
variable "aws_region"                  { type = string }
variable "node_instance_types_general" { type = list(string) }
variable "node_min_size"               { type = number }
variable "node_max_size"               { type = number }
variable "node_desired_size"           { type = number }
variable "enable_gpu_node_group"       { type = bool; default = false }

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  cluster_endpoint_public_access       = true
  cluster_endpoint_private_access      = true
  cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]  # Restrict in strict enterprise

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnets

  # Control Plane Logging
  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  enable_irsa = true

  cluster_addons = {
    coredns = {
      most_recent = true
      configuration_values = jsonencode({
        replicaCount = 3
        resources = {
          limits   = { cpu = "200m", memory = "256Mi" }
          requests = { cpu = "100m", memory = "128Mi" }
        }
      })
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent    = true
      before_compute = true
      configuration_values = jsonencode({
        env = {
          ENABLE_PREFIX_DELEGATION = "true"
          WARM_PREFIX_TARGET       = "1"
        }
      })
    }
    aws-ebs-csi-driver = {
      most_recent              = true
      service_account_role_arn = module.ebs_csi_irsa_role.iam_role_arn
    }
  }

  eks_managed_node_group_defaults = {
    ami_type       = "BOTTLEROCKET_x86_64"
    platform       = "bottlerocket"
    iam_role_attach_cni_policy = true
  }

  eks_managed_node_groups = merge(
    {
      # System Node Group: CoreDNS, metrics-server, autoscaler, etc.
      system = {
        name            = "${var.cluster_name}-system"
        use_name_prefix = true
        instance_types  = ["t3.large", "t3.xlarge"]
        capacity_type   = "ON_DEMAND"
        min_size        = 2
        max_size        = 5
        desired_size    = 2
        labels = {
          role        = "system"
          environment = var.environment
        }
      }
      
      # Application Node Group: Main workload
      application = {
        name            = "${var.cluster_name}-application"
        use_name_prefix = true
        instance_types  = var.node_instance_types_general
        capacity_type   = "ON_DEMAND"
        min_size        = var.node_min_size
        max_size        = var.node_max_size
        desired_size    = var.node_desired_size
        labels = {
          role        = "application"
          environment = var.environment
        }
      }

      # Spot Node Group: For batch jobs / resilient workers
      spot = {
        name            = "${var.cluster_name}-spot"
        use_name_prefix = true
        instance_types  = ["m6i.xlarge", "m5.xlarge", "m6a.xlarge"]
        capacity_type   = "SPOT"
        min_size        = 0
        max_size        = 10
        desired_size    = 0
        labels = {
          role        = "spot-worker"
          environment = var.environment
          lifecycle   = "spot"
        }
        taints = [{
          key    = "spotInstance"
          value  = "true"
          effect = "PREFER_NO_SCHEDULE"
        }]
      }
    },
    var.enable_gpu_node_group ? {
      # GPU Node Group: For AI inference (optional)
      gpu = {
        name           = "${var.cluster_name}-gpu"
        ami_type       = "BOTTLEROCKET_x86_64_NVIDIA"
        instance_types = ["g4dn.xlarge"]
        capacity_type  = "ON_DEMAND"
        min_size       = 0
        max_size       = 2
        desired_size   = 0
        labels = {
          role        = "gpu-worker"
          environment = var.environment
        }
        taints = [{
          key    = "nvidia.com/gpu"
          value  = "true"
          effect = "NO_SCHEDULE"
        }]
      }
    } : {}
  )

  # Fargate Profile
  fargate_profiles = {}

  manage_aws_auth_configmap = true
  aws_auth_roles = []

  tags = {
    Environment = var.environment
  }
}

# ─── IRSA Roles for Core Components ───────────────────────────────────────────

module "ebs_csi_irsa_role" {
  source    = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version   = "~> 5.0"
  role_name             = "${var.cluster_name}-ebs-csi"
  attach_ebs_csi_policy = true
  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }
}

module "cluster_autoscaler_irsa" {
  source    = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version   = "~> 5.0"
  role_name                        = "${var.cluster_name}-cluster-autoscaler"
  attach_cluster_autoscaler_policy = true
  cluster_autoscaler_cluster_names = [module.eks.cluster_name]
  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:cluster-autoscaler"]
    }
  }
}

module "load_balancer_controller_irsa" {
  source    = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version   = "~> 5.0"
  role_name                              = "${var.cluster_name}-alb-controller"
  attach_load_balancer_controller_policy = true
  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }
}

module "external_dns_irsa" {
  source    = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version   = "~> 5.0"
  role_name                     = "${var.cluster_name}-external-dns"
  attach_external_dns_policy    = true
  external_dns_hosted_zone_arns = ["arn:aws:route53:::hostedzone/*"]
  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:external-dns"]
    }
  }
}

module "cert_manager_irsa" {
  source    = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version   = "~> 5.0"
  role_name                     = "${var.cluster_name}-cert-manager"
  attach_cert_manager_policy    = true
  cert_manager_hosted_zone_arns = ["arn:aws:route53:::hostedzone/*"]
  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["cert-manager:cert-manager"]
    }
  }
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "cluster_name"                { value = module.eks.cluster_name }
output "cluster_endpoint"            { value = module.eks.cluster_endpoint; sensitive = true }
output "cluster_certificate_authority_data" { value = module.eks.cluster_certificate_authority_data; sensitive = true }
output "cluster_oidc_issuer_url"    { value = module.eks.cluster_oidc_issuer_url }
output "oidc_provider_arn"          { value = module.eks.oidc_provider_arn }
output "node_security_group_id"     { value = module.eks.node_security_group_id }
output "cluster_autoscaler_role_arn" { value = module.cluster_autoscaler_irsa.iam_role_arn }
output "alb_controller_role_arn"    { value = module.load_balancer_controller_irsa.iam_role_arn }
output "external_dns_role_arn"      { value = module.external_dns_irsa.iam_role_arn }
output "cert_manager_role_arn"      { value = module.cert_manager_irsa.iam_role_arn }
