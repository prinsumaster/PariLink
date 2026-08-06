# PariLink Kubernetes Platform — Deployment Guide

## Prerequisites
- AWS CLI configured with EKS access
- `kubectl` v1.31
- `helm` v3.14+
- Terraform output `cluster_name`

## 1. Connect to Cluster
```bash
aws eks update-kubeconfig --name parilink-production --region ap-south-1
```

## 2. Install Foundational Add-ons
Install these via Helm *before* deploying application workloads.

```bash
# NGINX Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  -f ../helm/nginx-ingress-values.yaml -n ingress-nginx --create-namespace

# AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -f ../helm/alb-controller-values.yaml -n kube-system

# Cluster Autoscaler
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm upgrade --install cluster-autoscaler autoscaler/cluster-autoscaler \
  -f ../helm/cluster-autoscaler-values.yaml -n kube-system

# Metrics Server
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm upgrade --install metrics-server metrics-server/metrics-server \
  -f ../helm/metrics-server-values.yaml -n kube-system
```

## 3. Install Security & DNS Add-ons

```bash
# Cert-Manager
helm repo add jetstack https://charts.jetstack.io
helm upgrade --install cert-manager jetstack/cert-manager \
  -f ../helm/cert-manager-values.yaml -n cert-manager --create-namespace

# ExternalDNS
helm repo add bitnami https://charts.bitnami.com/bitnami
helm upgrade --install external-dns bitnami/external-dns \
  -f ../helm/external-dns-values.yaml -n kube-system

# External Secrets Operator
helm repo add external-secrets https://charts.external-secrets.io
helm upgrade --install external-secrets external-secrets/external-secrets \
  -f ../helm/external-secrets-values.yaml -n external-secrets --create-namespace
```

## 4. Install Observability Stack

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -f ../helm/prometheus-values.yaml -n monitoring --create-namespace

helm upgrade --install loki grafana/loki \
  -f ../helm/loki-values.yaml -n monitoring

helm upgrade --install tempo grafana/tempo \
  -f ../helm/tempo-values.yaml -n monitoring
```

## 5. Apply Security & Scheduling Policies

```bash
kubectl apply -f scheduling.yaml
kubectl apply -f security-policies.yaml
```
