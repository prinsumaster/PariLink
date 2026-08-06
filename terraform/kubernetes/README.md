# PariLink Kubernetes Platform (EKS) — Architecture & Overview

## Architecture Diagram

```
AWS Cloud
 └── VPC (Private Networking Only)
      └── EKS Cluster (v1.31)
           ├── System Node Group (CoreDNS, Autoscaler, Ingress, Monitoring)
           ├── Application Node Group (PariLink API, Workers)
           ├── Spot Node Group (Batch Processing, Ephemeral Workers)
           └── GPU Node Group (Optional AI Inference)
```

## Core Components

| Component | Purpose | Deployment |
| :--- | :--- | :--- |
| **Bottlerocket OS** | Immutable, security-focused host OS | EKS Managed Node Groups |
| **NGINX Ingress** | L7 Routing, TLS termination | Helm (`ingress-nginx`) |
| **AWS ALB Controller** | Provisions Network Load Balancer for NGINX | Helm (`aws-load-balancer-controller`) |
| **Cert-Manager** | Automated TLS certs (Let's Encrypt) | Helm (`cert-manager`) |
| **ExternalDNS** | Automated Route53 DNS records | Helm (`external-dns`) |
| **External Secrets** | Syncs AWS Secrets Manager to K8s Secrets | Helm (`external-secrets`) |
| **Metrics Server** | HPA and VPA CPU/Memory metrics | Helm (`metrics-server`) |
| **Cluster Autoscaler** | Scales EC2 nodes based on pending pods | Helm (`cluster-autoscaler`) |
| **Prometheus/Grafana**| Metrics scraping and dashboards | Helm (`kube-prometheus-stack`) |
| **Loki/Promtail** | Centralized log aggregation to S3 | Helm (`loki-stack`) |
| **Tempo** | Distributed tracing to S3 | Helm (`tempo`) |
| **Velero** | Disaster Recovery / Volume Snapshots | Helm (`velero`) |

## Node Group Strategy

1. **System Node Group**: Dedicated to critical cluster add-ons. Labeled `role=system`. Tainted to prevent application pods from consuming resources.
2. **Application Node Group**: Primary compute for PariLink microservices. Labeled `role=application`. Scales based on HPA.
3. **Spot Node Group**: Uses AWS Spot instances. Tainted `spotInstance=true`. Used for async background workers (BullMQ) that can handle interruptions.
4. **GPU Node Group**: Scaled to 0 by default. Labeled `role=gpu-worker`. Tainted `nvidia.com/gpu=true`. Used specifically for AI model inference.

## Security Profile

- **Pod Security Standards (PSS)**: Enforced `restricted` mode at the namespace level.
- **Network Policies**: Default deny-all. Explicit allow for DNS and Ingress.
- **Root Filesystem**: Pods must run with `readOnlyRootFilesystem: true`.
- **Privilege Escalation**: `allowPrivilegeEscalation: false` enforced.
- **Run As Non-Root**: `runAsNonRoot: true` enforced.
