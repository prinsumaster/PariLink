# PariLink CI/CD — Branching Strategy

PariLink follows **Trunk-Based Development**.

## Core Principles

1. **`main` is sacred:** The `main` branch must always be deployable.
2. **Short-lived branches:** Feature branches should last days, not weeks.
3. **No direct commits to `main`:** All changes must go through a Pull Request.
4. **CI passes required:** A PR cannot be merged unless all status checks (tests, linting, tf plan, trivy) pass.

## Branch Naming Convention

- `feat/ticket-id-short-desc` (e.g., `feat/PL-101-add-driver-auth`)
- `fix/ticket-id-short-desc` (e.g., `fix/PL-102-memory-leak`)
- `chore/ticket-id-short-desc` (e.g., `chore/PL-103-update-deps`)

## PR Workflow

1. Developer branches off `main`.
2. Developer commits code and pushes.
3. Developer opens a Pull Request against `main`.
4. GitHub Actions runs the `CI Pipeline` and `Security Pipeline`.
5. Code Review is conducted.
6. Upon approval and CI passing, the PR is Squash Merged into `main`.
7. The staging deployment automatically kicks off.
