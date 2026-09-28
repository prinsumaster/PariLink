# OMEGA PRODUCTION GO-LIVE CHECKLIST

Use this checklist during the designated maintenance window to safely launch PariLink Enterprise v1.0.0.

## 1. Infrastructure & Networking
- [ ] Verify Kubernetes node pools have scaled to support minimum required resource footprints (Node limits > 1GB RAM per pod).
- [ ] Verify production SSL/TLS certificates are active and successfully bound to the Ingress Controller.
- [ ] Verify DNS A/CNAME records correctly route `api.parilink.com` and `app.parilink.com`.
- [ ] Ensure internal Network Policies restrict database access exclusively to API and Worker pods.

## 2. Databases & Redis
- [ ] Connect to Production PostgreSQL. Verify schema is empty and aligned (`npx prisma migrate status`).
- [ ] Verify PostgreSQL connection pooling parameters (`pgbouncer` or native Prisma connection limits).
- [ ] Verify Redis cluster is active in production mode (`redis-cli ping`).
- [ ] Verify persistent volumes for PostgreSQL and Redis are bound to `Retain` reclaim policies.

## 3. Environment Variables & Security
- [ ] Rotate and securely inject `MASTER_ENCRYPTION_KEY_V1` (32-byte hex).
- [ ] Rotate and securely inject `JWT_SECRET` and `COOKIE_SECRET`.
- [ ] Verify external API credentials (Stripe, Twilio, OpenAI/Anthropic) are properly sourced from the secure vault.
- [ ] Confirm no development flags (e.g., `DEBUG=*`) are exposed in the runtime environment.

## 4. Background Workers & Queues
- [ ] Deploy the Background Jobs workers (BullMQ).
- [ ] Verify queue discovery and connectivity with the Redis instance.
- [ ] Validate that dead-letter queues (DLQ) are configured and actively monitored.

## 5. Operations & Monitoring
- [ ] Verify Prometheus scrapers are actively collecting metrics from `/api/v1/metrics`.
- [ ] Validate OpenTelemetry spans are successfully exporting to the centralized tracing sink.
- [ ] Verify `OperationsScheduler` cron jobs (Health Pulse) are running successfully in the API Gateway logs.
- [ ] Confirm Log Aggregation (Datadog/ELK) is accurately parsing structured JSON logs.

## 6. Alerts & Incident Response
- [ ] Confirm PagerDuty (or equivalent) Webhooks are bound to critical Slack channels.
- [ ] Trigger a test alert to ensure end-to-end incident routing is functional.
- [ ] Verify the On-Call roster is active and acknowledged.

## 7. Authentication & Authorization
- [ ] Test a live Admin SSO login sequence against the production URL.
- [ ] Ensure JWT token exchange works and cookies are successfully flagged `Secure` and `HttpOnly`.

## 8. AI Services & Notifications
- [ ] Validate that requests to the AI Agent dispatcher endpoint successfully authenticate with the LLM provider.
- [ ] Confirm that Webhook Jitter algorithms and email/SMS triggers send correctly.

## 9. Backups & Rollback
- [ ] Trigger an initial full manual backup of the PostgreSQL database immediately before traffic is enabled.
- [ ] Document the Snapshot ID for immediate rollback capability.
- [ ] Review Rollback Playbook (Downgrading Docker image tag to previous stable, restoring DB).

## 10. Post-Launch Verification
- [ ] Execute End-to-End Workflow test script (synthetic traffic) over production URLs.
- [ ] Verify real-time Live Fleet maps are rendering without CORS violations.
- [ ] Monitor global error rates and 500 exceptions for the first 60 minutes continuously.
