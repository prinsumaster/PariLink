# Monitoring Guide

## Key Metrics to Watch
1. **API Latency (p95 and p99):** Should remain under 200ms. Spikes indicate DB contention or CPU throttling.
2. **Error Rate (HTTP 5xx):** Should be < 0.1%. A sudden increase triggers a SEV-2 alert.
3. **Queue Depth (BullMQ):** Active + Waiting jobs. If the queue length grows consistently, add more worker instances.
4. **Database Connections:** Monitor `pg_stat_activity` to ensure we do not exhaust the max connection pool limit (default Prisma config).

## Correlation IDs
PariLink uses a middleware to attach an `x-request-id` to every incoming request. 
- In Pino structured logs, this is available as `req.id`.
- When troubleshooting a specific failure reported by a user, ask for the trace ID (often shown in the UI error toast) and filter your log aggregator (Datadog/ELK) by `req.id: <ID>`.

## Health Probes
Kubernetes uses the following probes configured on the API containers:
- **Liveness:** `GET /health/liveness` - Simple memory heap check. If it fails, K8s kills the pod.
- **Readiness:** `GET /health/readiness` - Performs a `SELECT 1` on the DB. If it fails, traffic is routed away from the pod.
