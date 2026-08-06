# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — eks.tf
# Wires the production EKS module and configures IRSA outputs.
# ─────────────────────────────────────────────────────────────────────────────

module "eks" {
  source      = "./modules/eks"
  environment = var.environment
  aws_region  = var.aws_region

  cluster_name    = "parilink-${var.environment}"
  cluster_version = var.eks_cluster_version

  vpc_id          = aws_vpc.main.id
  private_subnets = aws_subnet.private[*].id

  node_instance_types_general = var.eks_node_instance_types
  node_min_size               = var.eks_min_nodes
  node_max_size               = var.eks_max_nodes
  node_desired_size           = var.eks_desired_nodes

  enable_gpu_node_group = false # Disabled by default as requested
}

# ─── New Outputs for Helm Addons ──────────────────────────────────────────────
output "alb_controller_role_arn" {
  description = "IAM Role ARN for AWS Load Balancer Controller IRSA"
  value       = module.eks.alb_controller_role_arn
}

output "external_dns_role_arn" {
  description = "IAM Role ARN for ExternalDNS IRSA"
  value       = module.eks.external_dns_role_arn
}

output "cert_manager_role_arn" {
  description = "IAM Role ARN for cert-manager IRSA"
  value       = module.eks.cert_manager_role_arn
}

output "cluster_autoscaler_role_arn" {
  description = "IAM Role ARN for Cluster Autoscaler IRSA"
  value       = module.eks.cluster_autoscaler_role_arn
}
