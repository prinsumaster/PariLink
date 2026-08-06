# PariLink Kubernetes Platform — Security Guide

## IAM Roles for Service Accounts (IRSA)

We strictly use IRSA to grant AWS permissions to Kubernetes workloads. **No AWS access keys are ever stored in Kubernetes Secrets.**

| Service Account | Role | AWS Permissions |
| :--- | :--- | :--- |
| `kube-system:aws-load-balancer-controller` | `parilink-{env}-alb-controller` | Manage ALBs, Target Groups, ACM |
| `kube-system:external-dns` | `parilink-{env}-external-dns` | Manage Route53 Records |
| `cert-manager:cert-manager` | `parilink-{env}-cert-manager` | Manage Route53 DNS01 Challenges |
| `kube-system:cluster-autoscaler` | `parilink-{env}-cluster-autoscaler` | Describe & Update EC2 ASGs |
| `kube-system:ebs-csi-controller-sa` | `parilink-{env}-ebs-csi` | Create & Attach EBS Volumes |
| `default:parilink-api` | `parilink-api-{env}` | Read Secrets Manager, S3 Uploads |

## Pod Security Standards (PSS)

The `default` namespace enforces the **Restricted** Pod Security Standard.

Applications must adhere to:
- `securityContext.runAsNonRoot: true`
- `securityContext.allowPrivilegeEscalation: false`
- `securityContext.seccompProfile.type: RuntimeDefault`
- `securityContext.capabilities.drop: ["ALL"]`

## Network Policies

1. **Default Deny**: By default, all ingress and egress traffic in the `default` namespace is blocked.
2. **DNS Egress**: Allowed to port 53 (TCP/UDP) in `kube-system`.
3. **Ingress NGINX**: Ingress traffic is only allowed from pods labeled with `app.kubernetes.io/name: ingress-nginx`.
4. **App-to-App**: Explicit NetworkPolicies must be created for microservices to communicate with each other.

## Secrets Management

1. Application secrets are stored in **AWS Secrets Manager**.
2. **External Secrets Operator (ESO)** reads from AWS via IRSA.
3. ESO creates native Kubernetes `Secret` resources in memory.
4. Kubernetes Secrets are encrypted at rest in etcd using a customer-managed AWS KMS Key.
