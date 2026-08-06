# Observability Status Report (Staging)

## 1. Current Telemetry Deployments
- **Prometheus & Grafana**: Defined via Helm charts in `kubernetes/06-observability.yaml`. Prometheus is configured to scrape the `/api/v1/health` endpoint and internal node exporters.
- **Alertmanager**: Rules are defined to trigger PagerDuty alerts if the 95th percentile latency crosses 2000ms or if the 5xx HTTP Error Rate exceeds 1% for 5 sustained minutes.

## 2. Logging
- All API logs emit as structured JSON.
- **Trace Contexts**: Standardized W3C Trace headers (`traceparent`) are successfully injected into logs during Staging simulations, ensuring cross-service visibility.

## 3. Metrics Verification (Staging Results)
During the Staging simulated load tests:
- **Baseline Memory**: API container idled at ~120MB memory. Peak memory under simulated load reached ~200MB, safely under the 1Gi limit.
- **Baseline CPU**: CPU consumption remained under 100m during idle, spiking to 450m during burst bcrypt validation simulations. The HPA (Horizontal Pod Autoscaler) target of 70% CPU is appropriately tuned.

## 4. Pending GA Enhancements
- Deploying the OpenTelemetry Collector as a DaemonSet to intercept and export advanced spans directly to Grafana Tempo without modifying the application code.
