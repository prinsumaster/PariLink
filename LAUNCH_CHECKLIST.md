# PariLink 2.0 — Final Launch Checklist

**Date:** 2026-08-06  

This checklist must be executed sequentially by the DevOps and Operations teams during the final production cutover.

## 1. Cloud Infrastructure Provisioning
- [ ] Deploy Kubernetes Cluster (EKS/GKE).
- [ ] Provision Managed PostgreSQL (RDS/Cloud SQL).
- [ ] Provision Managed Redis (ElastiCache/MemoryStore).
- [ ] Configure S3 Buckets for Document Storage.
- [ ] Configure Load Balancer and terminate SSL Certificates.

## 2. Environment Configuration
- [ ] Inject all production secrets via Secret Manager (Database URIs, JWT Secrets, OpenAI Keys, Razorpay Keys).
- [ ] Verify outbound network rules for Webhooks and SMS Gateway integrations.

## 3. Deployment Pipeline
- [ ] Execute `npx prisma migrate deploy` against the Production Database.
- [ ] Deploy the NestJS API Image.
- [ ] Deploy the Next.js Web Image.
- [ ] Verify Liveness/Readiness probes return HTTP 200 on `/health`.

## 4. Post-Deployment Smoke Test
- [ ] Register "PariLink Internal Test Co" via the Web UI.
- [ ] Complete the 10-Step Onboarding Wizard.
- [ ] Run a complete Trip lifecycle (Draft -> Dispatch -> In Transit -> Delivered).
- [ ] Generate one Invoice.
- [ ] Verify Audit Logs recorded the actions.

## 5. Cutover
- [ ] Update DNS records to point `app.parilink.com` to the Production Load Balancer.
- [ ] Send Go-Live announcement to early access customers.
- [ ] Operations Team assumes monitoring posture on Datadog/Grafana.
