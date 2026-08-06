# Incident Response Guide

## Initial Triage
When an alert fires or a user reports an incident:
1. **Acknowledge the alert** in PagerDuty to assign yourself as Incident Commander.
2. **Determine Severity:**
   - **SEV-1 (Critical):** API is down, Database is unreachable, or data loss is occurring. All hands on deck.
   - **SEV-2 (High):** A core feature (e.g., dispatch, invoicing) is broken for multiple customers.
   - **SEV-3 (Medium):** Degraded performance, single customer affected.
3. **Open an Incident Bridge** (Slack/Zoom) and invite necessary engineering responders.

## Investigation Flow
1. **Check Health Endpoints:** 
   Verify `/health/readiness` and `/health/liveness` to see if the API containers are healthy.
2. **Check Observability Dashboards:**
   Look at Datadog / Grafana for latency spikes or elevated 5xx error rates.
3. **Query Logs:**
   Filter structured JSON logs for `"level": "error"`. Check the `req.id` (correlation ID) to trace the request across microservices.

## Specific Scenarios
### API Pods Crashing (OOM)
- **Symptom:** Kubernetes shows `OOMKilled` on `parilink-api`.
- **Action:** Scale the deployment up, increase Memory Limits in the Helm chart, and analyze memory heap snapshots for leaks.

### Database Latency Spike
- **Symptom:** Query duration > 500ms, DB CPU at 90%+.
- **Action:** Check `pg_stat_activity` for long-running queries or locked transactions. Terminate the blocking PID if necessary.

### Redis Connectivity Failure
- **Symptom:** BullMQ workers failing, `Redis connection lost` logs.
- **Action:** Check Redis instance health. The API has a built-in retry backoff. If Redis restarted, wait for queues to re-bind.

## Post-Incident
1. Ensure the system is stable for at least 30 minutes.
2. Write a blameless RCA (Root Cause Analysis).
3. Create Jira tickets to address the underlying cause and improve automation.
