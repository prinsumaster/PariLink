# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — redis.tf
# Wires the Redis module to the networking outputs.
# ─────────────────────────────────────────────────────────────────────────────

module "redis" {
  source      = "./modules/redis"
  environment = var.environment

  vpc_id          = aws_vpc.main.id
  private_subnets = aws_subnet.private[*].id

  node_type          = var.redis_node_type
  num_cache_nodes    = var.environment == "production" ? 3 : 1
  cluster_mode       = var.environment == "production"
  automatic_failover = var.environment == "production"
  kms_key_id         = aws_kms_key.secrets.arn

  allowed_security_groups = [aws_security_group.eks_nodes.id]
}
