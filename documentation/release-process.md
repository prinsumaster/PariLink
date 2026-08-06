# PariLink CI/CD — Release Process

## Overview

PariLink uses Semantic Versioning (SemVer). The release process is semi-automated via GitHub Actions.

## Steps to Release

1. **Trigger the Workflow:** 
   Navigate to the `Release Management` workflow in the GitHub Actions tab.

2. **Select Bump Type:**
   Click "Run workflow" and select the semantic version bump required:
   - `patch`: Bug fixes (e.g., 1.0.1 -> 1.0.2)
   - `minor`: New features, backwards compatible (e.g., 1.0.2 -> 1.1.0)
   - `major`: Breaking changes (e.g., 1.1.0 -> 2.0.0)

3. **What the Workflow Does:**
   - Runs `npm version <bump>` to update `package.json`.
   - Commits the version bump back to the `main` branch.
   - Pushes a Git Tag matching the version (e.g., `v1.1.0`).
   - Automatically generates a GitHub Release with a changelog compiled from merged PR titles.

4. **Triggering Deployment:**
   - The creation of the GitHub Release triggers the `Deploy to Production` workflow.
   - The deployment pauses for a manual approval gate.
   - An authorized operator must approve the deployment to proceed.
