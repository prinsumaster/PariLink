# PariLink CI/CD — Rollback Procedures

## Automated Rollbacks

If a deployment fails during the CI pipeline (e.g., the pod fails to start, the health check fails, or the smoke tests fail), the workflow will automatically execute `./scripts/rollback.sh`.

This script runs:
`kubectl rollout undo deployment/parilink-api -n default`

It reverts the deployment to the previous known-good ReplicaSet and waits for the rollout to complete.

## Manual Rollbacks

If an issue is detected in production *after* a successful deployment pipeline completes (e.g., increased 5xx errors via CloudWatch alarms), a manual rollback is required.

### Option 1: Via GitHub Actions
1. Navigate to the `Deploy to Production` workflow in the Actions tab.
2. Click `Run workflow`.
3. Enter the specific image tag/version you wish to revert to (e.g., `v1.2.4`).
4. Approve the deployment.

### Option 2: Via kubectl (Emergency)
If GitHub Actions is down, Ops can perform the rollback manually assuming they have the appropriate IAM access:

```bash
aws eks update-kubeconfig --name parilink-production --region ap-south-1 --profile parilink-ops

# View history
kubectl rollout history deployment/parilink-api -n default

# Rollback to previous
kubectl rollout undo deployment/parilink-api -n default

# Verify
kubectl rollout status deployment/parilink-api -n default
```
