# General Availability (GA) Go-Live Checklist

## 1. Infrastructure Readiness
- [ ] Database instances deployed in High Availability (HA) clusters across multiple availability zones.
- [ ] Connection pooler (PgBouncer) deployed and tested under simulated load.
- [ ] Redis cluster configured for failover.
- [ ] Kubernetes minimum replica counts verified (API: 3, Web: 3).

## 2. Security & Compliance
- [ ] Let's Encrypt production certificates issued and bound to Ingress.
- [ ] Secrets migrated from Kubernetes Manifest templates to External Secret Managers (AWS Secrets Manager, Vault, etc.).
- [ ] CI/CD pipeline blocking builds on High/Critical vulnerabilities via Trivy and npm audit.
- [ ] CORS and CSP headers strictly enforcing `.parilink.com` domains.

## 3. Observability & Telemetry
- [ ] Prometheus metrics correctly scraping all pods.
- [ ] Grafana dashboards accessible to the operations team.
- [ ] PagerDuty / Opsgenie integrated with Alertmanager.
- [ ] Centralized logging (Loki) capturing all JSON formatted logs.

## 4. Operational Playbooks
- [ ] Incident Response Runbooks distributed to on-call engineers.
- [ ] Disaster Recovery RTO and RPO metrics documented and understood by stakeholders.
- [ ] Rollback procedures tested in the staging environment.

## 5. Deployment Execution (Zero Downtime)
- [ ] Announce deployment window to key stakeholders.
- [ ] Merge `main` into the `production` deployment branch to trigger the enterprise GitHub Actions pipeline.
- [ ] Monitor the Kubernetes rollout status.
- [ ] Execute post-deployment smoke tests in the production environment.
- [ ] Declare GA successfully launched.
