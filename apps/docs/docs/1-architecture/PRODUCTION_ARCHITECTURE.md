# Production Architecture (GA)

## 1. System Overview
PariLink Enterprise is deployed as a cloud-native, microservices-oriented application running entirely on Kubernetes. 

## 2. Component Topology
- **Frontend (apps/web)**: Next.js SSR application deployed as a stateless Deployment behind an NGINX Ingress controller. Connected to the backend via standard HTTP/S.
- **Backend (apps/api)**: NestJS API Gateway deployed as a stateless Deployment. Handles all business logic, authorization, and multi-tenant routing.
- **Database Layer**: PostgreSQL 15 running with Persistent Volumes. Configured for multi-tenant isolation via Row Level Security (RLS) and Prisma Connection Pooling.
- **Caching & Message Queue**: Redis 7 for high-performance session management, rate limiting, and background job queuing.

## 3. High Availability (HA) & Scaling
- **Horizontal Scaling**: Managed via Horizontal Pod Autoscaler (HPA) targeting 70% CPU utilization. `apps/api` scales from 3 to 20 replicas. `apps/web` scales from 3 to 10 replicas.
- **Pod Distribution**: Pod Anti-Affinity rules ensure that replicas for the same service are not scheduled on the same underlying physical node to protect against VM failures.
- **Redundancy**: Minimum 3 replicas per component. Pod Disruption Budgets (PDB) ensure at least 2 replicas are always available during cluster upgrades.

## 4. Network Security & Routing
- **Ingress**: External traffic hits `app.parilink.com` and `api.parilink.com` via NGINX Ingress with strictly enforced TLS (Let's Encrypt certificates via cert-manager).
- **Network Policies**: Default deny-all strategies. Web can only reach Ingress and API. API can only reach Web, Postgres, and Redis. Database is completely isolated from external ingress.

## 5. Storage Architecture
- **Postgres Storage**: Standard Persistent Volume Claims (PVC) backed by cloud-provider SSD block storage (e.g., AWS EBS gp3, GCP pd-ssd).
- **Ephemeral Storage**: Containers run with read-only root filesystems where possible, using ephemeral emptyDir volumes for `/tmp` data.
