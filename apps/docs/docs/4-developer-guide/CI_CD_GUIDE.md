# Enterprise CI/CD Guide (GA)

## Overview
The CI/CD pipeline for PariLink is governed entirely by GitHub Actions (`.github/workflows/enterprise-pipeline.yml`). It enforces strict quality gates, security audits, and automated deployment sequences to Kubernetes.

## Pipeline Architecture

### 1. Quality Gate (`quality-gate`)
- **Linting & Formatting**: Checks `apps/api` and `apps/web` against ESLint and Prettier standards.
- **Type Checking**: Runs `tsc --noEmit` to validate strict TypeScript typings.
- **Unit Testing**: Executes Jest suites ensuring business logic integrity.

### 2. Security Audit (`security-audit`)
- **NPM Audit**: Fails the build on any High or Critical vulnerability in node_modules.
- **SBOM Generation**: Generates a Software Bill of Materials (SPDX format) using Anchore for compliance and auditing. Uploads as an artifact.

### 3. Automated Testing (`e2e-testing` & `performance-smoke`)
- **Playwright**: Provisions a local Docker container ecosystem, executes the Order-to-Cash End-to-End flow via Chromium, and validates UI regressions.
- **k6 Smoke**: Validates API performance targets (latency < 100ms, 0% error rate).

### 4. Container Build & Push (`build-and-push`)
- Builds optimized multi-stage Docker images (`api` and `web`).
- Pushes directly to GitHub Container Registry (GHCR) using repository-scoped OIDC tokens.

### 5. Vulnerability Scanning (`container-scan`)
- Uses Trivy to scan the built `api` and `web` containers for OS and library vulnerabilities before they hit the cluster.

### 6. Deployment (`deploy` & `rollback`)
- Connects to the Kubernetes cluster using `KUBECONFIG` secrets.
- Applies standard YAML manifests in order.
- Waits for `kubectl rollout status` to guarantee success. If it fails, the `rollback` job automatically triggers a `kubectl rollout undo` to prevent downtime.
