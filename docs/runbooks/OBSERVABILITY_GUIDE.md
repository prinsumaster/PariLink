# PariLink Enterprise 1.0.0 — Observability Guide

This document defines the metrics, tracing, and logging protocols for PariLink Enterprise, equipping SRE teams to maintain strict SLA requirements.

## 1. Metrics (Prometheus / Grafana)
The platform natively exposes Prometheus-compatible metrics.
- **Endpoint:** `GET /api/v1/metrics`
- **Key Metrics (SLIs):**
  - `http_requests_total`: Throughput measurement by endpoint/method.
  - `http_request_duration_seconds`: API latency histograms (Target: 95th percentile < 200ms).
  - `db_query_duration_seconds`: Prisma query execution times.
  - `bullmq_queue_depth`: Number of pending async jobs (Invoicing, Notifications).
  - `memory_heap_used`: Node.js heap usage (Alert > 800MB).

## 2. Tracing (OpenTelemetry)
All API requests are instrumented using `@opentelemetry/sdk-node`.
- **Propagation:** B3 headers or W3C Trace Context automatically carry Trace IDs across the API, Queue workers, and Database.
- **Correlation IDs:** Every API response header includes `X-Correlation-ID`. Support agents can extract this ID from customer screenshots to instantly query traces in Jaeger/Datadog.

## 3. Structured Logging
PariLink outputs exclusively in structured JSON format via Pino.
- **Required Fields:** `timestamp`, `level`, `correlationId`, `tenantId`, `userId`, `context`.
- **PII Scrubbing:** Application logs are automatically scrubbed of sensitive fields (`password`, `credit_card`, `ssn`) at the logger serialization layer.

## 4. Alerts and Routing
The internal `AlertEngineService` integrates directly with PagerDuty / Slack Webhooks.
- **CRITICAL:** `System DOWN` or `5xx Error Rate > 5%`. Routes to Primary On-Call.
- **HIGH:** `Component DEGRADED` or `Queue Depth > 10,000`. Routes to Operations Slack Channel.
- **WARNING:** `Heap > 500MB` or `High Latency Spikes`. Logged to observability dashboards.

## 5. SLOs and SLIs
- **SLO (Availability):** 99.99% uptime for core API routing and Database reads.
- **SLO (Latency):** 95% of Fleet Dispatch actions complete within 200ms.
- **SLI Measurement:** Monitored via Prometheus aggregation over a rolling 30-day window. Failure to meet SLOs automatically triggers a Feature Freeze under the Error Budget policy.
