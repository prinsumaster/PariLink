# Enterprise Capacity Planning Guide

## Production Target Profile
- **Active Tenants (Companies):** 500
- **Daily Active Drivers:** 25,000
- **Peak Concurrency:** 10,000 requests/minute
- **GPS Events:** 250M per year (High Write Throughput)

## Infrastructure Requirements (AWS / GCP)

### Database Layer (PostgreSQL)
- **Minimum Spec:** 8 vCPU, 32GB RAM (e.g., AWS `db.r6g.2xlarge`)
- **Storage:** 1 TB Provisioned IOPS SSD (io1/io2)
- **Connection Pooling:** PgBouncer is **MANDATORY** in front of PostgreSQL. Configure `pool_mode = transaction`.
- **Prisma Connection Limit:** Configure the `DATABASE_URL` with `?connection_limit=10` per Node instance. With 10 instances, this results in 100 connections.

### Application Layer (Node.js / NestJS)
- **Minimum Spec:** 2 vCPU, 4GB RAM per Pod.
- **Horizontal Pod Autoscaling (HPA):** 
  - Minimum Pods: 3
  - Maximum Pods: 20
  - Target CPU Utilization: 60%
  - Target Memory Utilization: 70%

### Caching Layer (Redis)
- **Minimum Spec:** 2 vCPU, 8GB RAM.
- **Usage:** Used for Throttler/Rate-limiting, Auth Session caching, and potentially query caching for Dashboards.

### Object Storage (Minio/S3)
- **Minimum Spec:** Standard S3 Buckets for PODs (Proof of Delivery).
- **CDN:** Strongly recommend placing CloudFront or Cloudflare in front of S3 for caching images globally.
