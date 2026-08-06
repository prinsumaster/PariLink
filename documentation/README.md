# PariLink CI/CD Platform

## Overview
This directory contains the GitHub Actions workflows, custom composite actions, deployment scripts, and operational documentation that form the PariLink continuous integration and continuous deployment platform.

## Architecture

The CI/CD pipeline is designed for high security and fully automated delivery to AWS EKS:

- **Auth:** OIDC (No long-lived AWS IAM User access keys)
- **Scanning:** CodeQL (SAST), Trivy (Container), TruffleHog (Secrets)
- **Image Build:** Docker Buildx (multi-arch), Cosign (keyless signing)
- **Delivery:** Helm/Kubectl scripts targeting specific environments
- **Dependency Management:** Renovate and Dependabot

## Directory Structure

```
├── .github/
│   ├── workflows/        # GitHub Actions definitions
│   │   ├── ci.yml              # Code quality, Terraform fmt/validate
│   │   ├── security.yml        # SAST, Secrets, Container Scans
│   │   ├── docker.yml          # Build, Sign, Push to ECR
│   │   ├── deploy-staging.yml  # Automated deployment to staging
│   │   ├── deploy-production.yml # Manual/Release deployment to production
│   │   └── release.yml         # Semantic version bumping
│   ├── actions/          # Reusable composite actions
│   │   ├── setup/
│   │   ├── terraform/
│   │   └── helm/
│   ├── dependabot.yml    # Auto-updates for actions/tf/docker
│   └── renovate.json     # Auto-updates for Node/Helm/K8s
├── scripts/              # Bash scripts used by workflows
│   ├── deploy.sh
│   ├── rollback.sh
│   ├── health-check.sh
│   └── smoke-tests.sh
└── documentation/        # CI/CD Ops Documentation
    ├── branch-strategy.md
    ├── deployment.md
    ├── release-process.md
    └── rollback.md
```

## Security Posture
- High/Critical vulnerabilities found by Trivy will **fail the pipeline**.
- Any secrets detected by TruffleHog will **fail the pipeline**.
- Production deployments require manual approval via GitHub Environments.
