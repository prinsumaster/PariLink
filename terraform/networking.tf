# ─────────────────────────────────────────────────────────────────────────────
# PariLink Enterprise SaaS — networking.tf
# Complete VPC topology:
#   - 3 AZ spanning public / private / database subnets
#   - Internet Gateway
#   - NAT Gateways (one per AZ in production)
#   - Route Tables
#   - VPC Flow Logs → CloudWatch
#   - Network ACLs (defense-in-depth)
# ─────────────────────────────────────────────────────────────────────────────

# ─── Data Sources ─────────────────────────────────────────────────────────────
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# ─── VPC ──────────────────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "parilink-${var.environment}" }
}

# ─── Subnets ──────────────────────────────────────────────────────────────────
resource "aws_subnet" "public" {
  count = 3

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false # Explicit EIP assignment only

  tags = {
    Name                                                        = "parilink-public-${count.index + 1}-${var.environment}"
    "kubernetes.io/cluster/parilink-${var.environment}"         = "shared"
    "kubernetes.io/role/elb"                                    = "1"
  }
}

resource "aws_subnet" "private" {
  count = 3

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name                                                        = "parilink-private-${count.index + 1}-${var.environment}"
    "kubernetes.io/cluster/parilink-${var.environment}"         = "shared"
    "kubernetes.io/role/internal-elb"                           = "1"
  }
}

resource "aws_subnet" "database" {
  count = 3

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.database_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = { Name = "parilink-db-${count.index + 1}-${var.environment}" }
}

# ─── Internet Gateway ──────────────────────────────────────────────────────────
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "parilink-igw-${var.environment}" }
}

# ─── Elastic IPs for NAT Gateways ─────────────────────────────────────────────
# Production: one NAT per AZ. Staging: single NAT to reduce cost.
resource "aws_eip" "nat" {
  count  = var.environment == "production" ? 3 : 1
  domain = "vpc"

  tags = { Name = "parilink-nat-eip-${count.index + 1}-${var.environment}" }

  depends_on = [aws_internet_gateway.main]
}

# ─── NAT Gateways ─────────────────────────────────────────────────────────────
resource "aws_nat_gateway" "main" {
  count = var.environment == "production" ? 3 : 1

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = { Name = "parilink-nat-${count.index + 1}-${var.environment}" }

  depends_on = [aws_internet_gateway.main]
}

# ─── Route Tables ─────────────────────────────────────────────────────────────
# Public route table (→ Internet Gateway)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "parilink-public-rt-${var.environment}" }
}

resource "aws_route_table_association" "public" {
  count          = 3
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private route tables (one per AZ → NAT Gateway in same AZ)
resource "aws_route_table" "private" {
  count  = var.environment == "production" ? 3 : 1
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = { Name = "parilink-private-rt-${count.index + 1}-${var.environment}" }
}

resource "aws_route_table_association" "private" {
  count          = 3
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[var.environment == "production" ? count.index : 0].id
}

# Database subnets use private route table (no direct internet access)
resource "aws_route_table_association" "database" {
  count          = 3
  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.private[var.environment == "production" ? count.index : 0].id
}

# ─── Security Groups ──────────────────────────────────────────────────────────

# ALB: HTTPS inbound only
resource "aws_security_group" "alb" {
  name        = "parilink-alb-${var.environment}"
  description = "Application Load Balancer — HTTPS inbound"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS from internet"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP — redirect to HTTPS"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Unrestricted egress"
  }

  tags = { Name = "parilink-alb-sg-${var.environment}" }
}

# EKS Nodes: receive traffic from ALB only
resource "aws_security_group" "eks_nodes" {
  name        = "parilink-eks-nodes-${var.environment}"
  description = "EKS worker nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "From ALB"
  }

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
    description = "Node-to-node communication"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "parilink-eks-nodes-sg-${var.environment}" }
}

# ─── Network ACLs (defense-in-depth) ─────────────────────────────────────────

# Public subnet NACL
resource "aws_network_acl" "public" {
  vpc_id     = aws_vpc.main.id
  subnet_ids = aws_subnet.public[*].id

  # Allow HTTPS inbound
  ingress {
    rule_no    = 100
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "0.0.0.0/0"
    from_port  = 443
    to_port    = 443
  }

  # Allow HTTP inbound (for redirect)
  ingress {
    rule_no    = 110
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "0.0.0.0/0"
    from_port  = 80
    to_port    = 80
  }

  # Allow ephemeral return traffic
  ingress {
    rule_no    = 200
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
  }

  egress {
    rule_no    = 100
    action     = "allow"
    protocol   = "-1"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = { Name = "parilink-public-nacl-${var.environment}" }
}

# Private subnet NACL — blocks direct internet inbound
resource "aws_network_acl" "private" {
  vpc_id     = aws_vpc.main.id
  subnet_ids = aws_subnet.private[*].id

  ingress {
    rule_no    = 100
    action     = "allow"
    protocol   = "-1"
    cidr_block = var.vpc_cidr
    from_port  = 0
    to_port    = 0
  }

  ingress {
    rule_no    = 200
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
  }

  egress {
    rule_no    = 100
    action     = "allow"
    protocol   = "-1"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = { Name = "parilink-private-nacl-${var.environment}" }
}

# Database subnet NACL — PostgreSQL from private subnets only
resource "aws_network_acl" "database" {
  vpc_id     = aws_vpc.main.id
  subnet_ids = aws_subnet.database[*].id

  ingress {
    rule_no    = 100
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "10.0.1.0/24"
    from_port  = 5432
    to_port    = 5432
  }
  ingress {
    rule_no    = 101
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "10.0.2.0/24"
    from_port  = 5432
    to_port    = 5432
  }
  ingress {
    rule_no    = 102
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "10.0.3.0/24"
    from_port  = 5432
    to_port    = 5432
  }

  egress {
    rule_no    = 100
    action     = "allow"
    protocol   = "tcp"
    cidr_block = var.vpc_cidr
    from_port  = 1024
    to_port    = 65535
  }

  tags = { Name = "parilink-db-nacl-${var.environment}" }
}

# ─── VPC Flow Logs ────────────────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/parilink/${var.environment}/vpc/flow-logs"
  retention_in_days = 90
  kms_key_id        = aws_kms_key.cloudwatch.arn
}

resource "aws_iam_role" "vpc_flow_logs" {
  name = "parilink-vpc-flow-logs-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "vpc-flow-logs.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "vpc_flow_logs" {
  name = "parilink-vpc-flow-logs-${var.environment}"
  role = aws_iam_role.vpc_flow_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ]
      Resource = "*"
    }]
  })
}

resource "aws_flow_log" "main" {
  iam_role_arn    = aws_iam_role.vpc_flow_logs.arn
  log_destination = aws_cloudwatch_log_group.vpc_flow_logs.arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.main.id

  tags = { Name = "parilink-vpc-flow-logs-${var.environment}" }
}

# ─── SSM VPC Endpoints (Bastion-free access) ─────────────────────────────────
resource "aws_vpc_endpoint" "ssm" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ssm"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.eks_nodes.id]
  private_dns_enabled = true
  tags                = { Name = "parilink-ssm-endpoint-${var.environment}" }
}

resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ssmmessages"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.eks_nodes.id]
  private_dns_enabled = true
  tags                = { Name = "parilink-ssmmessages-endpoint-${var.environment}" }
}

resource "aws_vpc_endpoint" "ec2messages" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ec2messages"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.eks_nodes.id]
  private_dns_enabled = true
  tags                = { Name = "parilink-ec2messages-endpoint-${var.environment}" }
}

# S3 Gateway endpoint (free, high-speed S3 access from private subnets)
resource "aws_vpc_endpoint" "s3" {
  vpc_id          = aws_vpc.main.id
  service_name    = "com.amazonaws.${var.aws_region}.s3"
  route_table_ids = aws_route_table.private[*].id
  tags            = { Name = "parilink-s3-gateway-endpoint-${var.environment}" }
}

# ─── Outputs ──────────────────────────────────────────────────────────────────
output "vpc_id"              { value = aws_vpc.main.id }
output "public_subnet_ids"   { value = aws_subnet.public[*].id }
output "private_subnet_ids"  { value = aws_subnet.private[*].id }
output "database_subnet_ids" { value = aws_subnet.database[*].id }
output "alb_sg_id"           { value = aws_security_group.alb.id }
output "eks_nodes_sg_id"     { value = aws_security_group.eks_nodes.id }
