# PariLink 2.0 — Production Deployment Runbook

## 1. Domain & SSL
- **DNS:** Map `app.parilink.com` (Web App), `api.parilink.com` (Backend), and `parilink.com` (Marketing) to the production load balancers.
- **SSL:** Ensure Let's Encrypt certificates are provisioned via Ingress/Cert-Manager.

## 2. Infrastructure Validations
- **PostgreSQL:** Validate RDS Multi-AZ deployment. Ensure `pg_stat_statements` is enabled for query monitoring.
- **Redis:** Validate ElastiCache cluster with Multi-AZ failover.
- **Object Storage:** Validate S3 bucket policies for public/private asset separation.

## 3. External Integrations
- **Email:** Validate SendGrid domain authentication (DKIM/SPF) to prevent emails from landing in spam.
- **WhatsApp:** Ensure Twilio Business API is approved and webhooks are correctly pointing to `api.parilink.com/webhooks/whatsapp`.

## 4. Disaster Recovery & Backups
- **Database Backups:** Automated snapshots every 6 hours with a 30-day retention policy.
- **Disaster Recovery:** Point-In-Time Recovery (PITR) verified. RTO (Recovery Time Objective) target is < 2 hours. RPO (Recovery Point Objective) is < 5 minutes.

## 5. Monitoring & Logging
- Ensure Datadog / OpenTelemetry agents are correctly reporting traces from the NestJS backend and Next.js frontend.
- Configure alerting for HTTP 5xx errors > 1% and Database CPU > 80%.

## 6. Staging vs Production
- Ensure `NODE_ENV=production` is strictly enforced.
- Run `npm run typecheck` and `npm run build` on the deployment pipeline before swapping the blue-green containers.
