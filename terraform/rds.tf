# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — rds.tf
# Delegates to modules/postgres — references networking outputs directly
# rather than the old vpc module pattern.
# ─────────────────────────────────────────────────────────────────────────────

module "postgres" {
  source      = "./modules/postgres"
  environment = var.environment

  vpc_id           = aws_vpc.main.id
  database_subnets = aws_subnet.database[*].id

  instance_class    = var.rds_instance_class
  allocated_storage = var.rds_allocated_storage
  max_storage       = var.rds_max_storage

  multi_az              = var.environment == "production"
  read_replica_count    = var.environment == "production" ? 2 : 0
  backup_retention_days = var.environment == "production" ? 35 : 7
  performance_insights  = true
  deletion_protection   = var.environment == "production"

  allowed_security_groups = [aws_security_group.eks_nodes.id]
}
