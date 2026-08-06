# Observability & Monitoring Guide (GA)

## 1. Metrics (Prometheus & Grafana)
The platform is heavily instrumented using Prometheus to scrape Node.js and NestJS specific metrics.
- **Node.js Metrics**: Event loop lag, memory heap utilization, garbage collection pauses.
- **HTTP Metrics**: Request rates, 95th and 99th percentile latencies, 4xx/5xx error rates by endpoint.
- **Database Metrics**: Prisma connection pool exhaustion events, slow query latency.

**Grafana Dashboards**:
- The "PariLink Core Service" dashboard should be imported to visualize golden signals (Latency, Traffic, Errors, Saturation).
- Set up Alertmanager rules for:
  - `APIHighErrorRate`: > 1% HTTP 5xx errors for 5m.
  - `HighLatency`: p95 > 2000ms for 5m.

## 2. Distributed Tracing (Tempo & OpenTelemetry)
- **Correlation IDs**: Every incoming request at the Ingress tier is assigned an `X-Request-ID`. This is propagated via the NestJS Execution Context to Prisma.
- **W3C Trace Contexts**: OpenTelemetry auto-instrumentation attaches `traceparent` headers to all internal microservice calls.
- Traces are pushed to Grafana Tempo, allowing developers to see the exact time spent in Middleware -> Controller -> Service -> Database.

## 3. Structured Logging (Loki)
- All services emit logs as JSON (`pino` format).
- Logs include `tenantId`, `userId`, and `traceId`.
- **Log Aggregation**: Promtail runs as a DaemonSet to collect standard output from all containers and ships them to Loki.
- **Querying**: Use LogQL in Grafana: `{app="parilink-api"} |= "error" | json | tenantId="tenant-xyz"`.

## 4. Health Checks
- `GET /api/v1/health` is the standard endpoint for Kubernetes Readiness and Liveness probes.
- It verifies Redis ping, Prisma database connection (`SELECT 1`), and memory constraints.
