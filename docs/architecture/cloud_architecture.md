# PariLink Enterprise SaaS — Cloud Architecture Guide

## 1. Executive Summary
PariLink is deployed as a multi-tenant SaaS platform on AWS using a highly available, fault-tolerant, and secure architecture. The infrastructure is defined entirely as Code (IaC) using Terraform, and applications are orchestrated via Kubernetes (EKS).

## 2. Global Architecture
The platform is deployed in the `ap-south-1` (Mumbai) region to optimize for Indian logistics fleets, ensuring low latency and data residency compliance.

### 2.1 Edge & Content Delivery
* **Amazon CloudFront**: Caches static frontend assets and provides CDN capabilities.
* **AWS WAF**: Integrated with CloudFront and ALB to block OWASP Top 10 vulnerabilities, SQLi, and enforce IP rate limiting.
* **AWS Route53**: DNS routing with latency-based and failover routing policies.
* **AWS Certificate Manager (ACM)**: Manages TLS 1.3 certificates.

### 2.2 Network (VPC)
* **3 Availability Zones (AZs)** for high availability.
* **Public Subnets**: Application Load Balancers (ALB) and NAT Gateways.
* **Private Subnets**: EKS Worker Nodes (Application workloads).
* **Database Subnets**: Isolated subnets for RDS PostgreSQL and ElastiCache Redis, accessible only from the Private Subnets.

## 3. Compute (EKS)
* **Amazon EKS (1.31)**: Managed Kubernetes control plane.
* **Node Groups**:
  * `general`: `m6i.xlarge` (4 vCPU, 16GB RAM) for API and Web workloads.
  * `memory`: `r7g.2xlarge` (8 vCPU, 64GB RAM) for background workers and reporting.
* **Autoscaling**: Karpenter / Cluster Autoscaler combined with HPA/VPA for workloads.

## 4. Data Layer
* **Amazon RDS PostgreSQL (15.7)**:
  * Multi-AZ deployment for synchronous replication and automatic failover.
  * 2 Read Replicas to offload reporting queries.
  * 35-day automated backup retention with Point-in-Time Recovery (PITR).
  * Encrypted at rest using KMS.
* **Amazon ElastiCache Redis**:
  * 3-node cluster with automatic failover.
  * Used for caching, session management, and rate-limiting counters.
* **Amazon S3**:
  * `parilink-assets`: Encrypted bucket for PoD documents and receipts. Lifecycle policy transitions data to Standard-IA (90 days) and Glacier (365 days).
  * `parilink-backups`: Immutable backups with S3 Object Lock.

## 5. Security & Multi-Tenancy
* **Multi-Tenancy**: Logical isolation via PostgreSQL Row-Level Security (RLS) or tenant-id scoped queries in the application layer.
* **Secrets Management**: AWS Secrets Manager automatically rotates database credentials every 30 days. Kubernetes workloads access secrets via External Secrets Operator or IRSA.
* **IAM**: Least privilege enforced via IAM Roles for Service Accounts (IRSA).
* **Network Policies**: Calico network policies enforce zero-trust pod-to-pod communication within the cluster.

## 6. Observability
* **Prometheus & Grafana**: Collect and visualize cluster and application metrics.
* **Loki**: Centralized log aggregation.
* **Tempo/OpenTelemetry**: Distributed tracing across microservices.
* **Alertmanager**: Routes critical alerts (e.g., API Error Rate > 1%) to Slack and PagerDuty.
