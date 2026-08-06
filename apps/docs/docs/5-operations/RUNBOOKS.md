# Operations Runbooks (GA)

## 1. Incident Response (Sev-1)
1. **Acknowledge**: PagerDuty alerts the On-Call Engineer. Acknowledge within 5 minutes.
2. **Triage**: Check Grafana dashboards. Determine if it is a network, application, or database issue.
3. **Mitigate**: If it's a bad deployment, immediately trigger the CI/CD `rollback` job or run `kubectl rollout undo deployment/parilink-api`.
4. **Communicate**: Post updates to the internal `#incidents` Slack channel and update the public status page.

## 2. Manual Deployment & Upgrades
While deployments are automated via GitHub Actions, manual overrides can be performed:
```bash
# Force a deployment of a specific image tag
kubectl set image deployment/parilink-api api=ghcr.io/parilink/api:v1.0.1 -n parilink-production
# Watch the rollout
kubectl rollout status deployment/parilink-api
```

## 3. Database Troubleshooting
If CPU usage on the Postgres instance spikes to 100%:
1. SSH/Connect to the database using `psql`.
2. Run `SELECT * FROM pg_stat_activity WHERE state = 'active' ORDER BY query_start ASC;` to find hanging queries.
3. Terminate runaway queries using `SELECT pg_terminate_backend(pid);`.
4. Investigate the application logs to find the endpoint responsible for the query.

## 4. Scaling the Application
If the HPA is unable to keep up with sudden, massive traffic spikes:
```bash
# Manually scale the deployment ahead of traffic
kubectl scale deployment parilink-api --replicas=30 -n parilink-production
```
Remember to edit the HPA `maxReplicas` if permanent high capacity is needed.
