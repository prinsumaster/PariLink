# PariLink Infrastructure — Architecture Documentation

## Network Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AWS Region: ap-south-1 (Mumbai)                     │
│                                                                             │
│  ┌────────────────────────── VPC: 10.0.0.0/16 ──────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌─── AZ-1 ─────────────┐ ┌─── AZ-2 ─────────────┐ ┌─── AZ-3 ────┐  │  │
│  │  │ Public: 10.0.101/24  │ │ Public: 10.0.102/24  │ │ Pub:101.103 │  │  │
│  │  │ [ALB Node] [NAT GW]  │ │ [ALB Node] [NAT GW]  │ │ [ALB][NAT]  │  │  │
│  │  ├──────────────────────┤ ├──────────────────────┤ ├─────────────┤  │  │
│  │  │ Private: 10.0.1/24   │ │ Private: 10.0.2/24   │ │ Pri:10.0.3  │  │  │
│  │  │ [EKS Nodes][Redis]   │ │ [EKS Nodes][Redis]   │ │ [EKS][Redis]│  │  │
│  │  ├──────────────────────┤ ├──────────────────────┤ ├─────────────┤  │  │
│  │  │ Database: 10.0.201   │ │ Database: 10.0.202   │ │ DB: 10.0.203│  │  │
│  │  │ [RDS Primary]        │ │ [RDS Standby]        │ │ [RDS Replica│  │  │
│  │  └──────────────────────┘ └──────────────────────┘ └─────────────┘  │  │
│  │                                                                       │  │
│  │  VPC Endpoints: SSM, SSMMessages, EC2Messages (Interface)             │  │
│  │  VPC Endpoint: S3 (Gateway — free high-speed S3 access)               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Internet Gateway ← Public Subnets only                                     │
│  3x NAT Gateways (production) / 1x NAT Gateway (staging)                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow: API Request

```
Client Browser
     │
     ▼ HTTPS:443
AWS WAFv2 ─── Evaluates OWASP / Rate Limit / Geo rules
     │
     ▼
Application Load Balancer ─── SSL termination, health checks
     │
     ▼ HTTP:3000
EKS Worker Node (Private Subnet)
     │
     ├─── PostgreSQL :5432 (RDS, Database Subnet, SSL required)
     ├─── Redis :6379 (ElastiCache, Private Subnet, TLS + AUTH)
     └─── S3 (via VPC Gateway Endpoint, no internet egress)
```

## Data Flow: Secret Injection

```
EKS Pod starts
     │
     ▼
Kubernetes Service Account (parilink-api)
     │
     ▼ AssumeRoleWithWebIdentity (IRSA / OIDC)
IAM Role: parilink-api-{env}
     │
     ▼
AWS External Secrets Operator
     │
     ▼
Secrets Manager: parilink/{env}/database
Secrets Manager: parilink/{env}/redis
Secrets Manager: parilink/{env}/jwt
     │
     ▼
Kubernetes Secret (synced every 1 hour)
     │
     ▼
Pod environment variables (never stored in git)
```

## High Availability Design

| Component | HA Mechanism | Failover Time |
| :--- | :--- | :--- |
| RDS PostgreSQL | Multi-AZ synchronous standby | ~60 seconds automatic |
| ElastiCache Redis | Replication Group + Auto Failover | ~30 seconds automatic |
| EKS Worker Nodes | 3 AZ spread via Pod Topology Spread Constraints | ~2 minutes (new pod scheduling) |
| ALB | Natively multi-AZ | 0 seconds |
| NAT Gateways | One per AZ in production | 0 seconds (AZ-local) |
