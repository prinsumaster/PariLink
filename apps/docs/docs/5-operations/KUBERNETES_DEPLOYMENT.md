# Kubernetes Deployment Guide (GA)

## Prerequisites
- A functional Kubernetes Cluster (v1.26+)
- `kubectl` configured with cluster admin rights
- NGINX Ingress Controller installed in the cluster
- Cert-Manager installed for automatic TLS

## Initial Cluster Bootstrapping

1. **Apply Namespaces and Base Configs**:
   ```bash
   kubectl apply -f kubernetes/01-base.yaml
   ```

2. **Secrets Management**:
   The `01-base.yaml` includes a template secret `parilink-secrets-template`.
   **CRITICAL**: Do not use this template directly in production. Integrate with a secret manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) using the External Secrets Operator.

3. **Stateful Services (Database & Cache)**:
   ```bash
   kubectl apply -f kubernetes/02-database.yaml
   ```
   *Wait for the PVCs to bind and the pods to enter the `Running` state before proceeding.*

4. **Deploy Application Tiers**:
   ```bash
   kubectl apply -f kubernetes/03-api.yaml
   kubectl apply -f kubernetes/04-web.yaml
   ```
   This provisions Deployments, Services, HPAs, PDBs, and Network Policies.

5. **Expose Services via Ingress**:
   ```bash
   kubectl apply -f kubernetes/05-ingress.yaml
   ```

## Managing Deployments
To manually trigger a rolling restart of the application tier:
```bash
kubectl rollout restart deployment/parilink-api -n parilink-production
kubectl rollout restart deployment/parilink-web -n parilink-production
```

## Scaling Verification
Verify that the Horizontal Pod Autoscalers (HPA) are properly tracking CPU targets:
```bash
kubectl get hpa -n parilink-production
```
