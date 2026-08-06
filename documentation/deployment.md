# PariLink CI/CD — Deployment Strategy

## Staging Deployment

The staging deployment is **fully automated**. 

1. A PR is merged into `main`.
2. The `Docker Build & Push` workflow triggers, building the image, signing it via Cosign, and pushing it to Amazon ECR.
3. Upon success of the Docker build, the `Deploy to Staging` workflow automatically triggers.
4. It assumes the staging IAM role via OIDC.
5. It runs `./scripts/deploy.sh staging <commit-sha>`.
6. It performs a rollout status wait, a health check, and a smoke test.
7. If any step fails, `./scripts/rollback.sh staging` runs automatically.

## Production Deployment

The production deployment is **gated and manual**.

It can be triggered in two ways:
1. **Automated Release Gated:** When a new GitHub Release is created, the workflow runs but pauses at the `production` environment approval gate.
2. **Manual Dispatch:** A developer can manually trigger the workflow and input a specific image tag.

### Blue/Green & Canary
Currently, the pipeline uses native Kubernetes rolling updates which achieves a basic canary rollout. As pods become healthy, the old pods are terminated.

If the new pods fail their readiness probes, the rollout halts, and the deployment script times out after 300 seconds, triggering an automated rollback.
