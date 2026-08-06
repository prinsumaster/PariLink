# Security Audit & Validation Report (Staging)

## 1. Container Scanning (Trivy)
The CI/CD pipeline executes Trivy container scans on `api:latest` and `web:latest`.
- **Base Images**: Both images use `node:18-alpine`, verified to contain zero CRITICAL or HIGH vulnerabilities as of the latest pipeline run.
- **Root Privileges**: Verified that both containers execute natively as UID 1001 (non-root `nestjs` / `nextjs` users).

## 2. Dependency Auditing (`npm audit`)
- **Execution**: `npm audit --audit-level=high` was executed against the monorepo workspace.
- **Results**: **PASS**. Zero High or Critical severity vulnerabilities detected.
- **Note**: A single moderate vulnerability exists in an indirect dependency (`postcss`), which is scheduled for remediation in PariLink v1.1 via a minor framework bump, but poses no operational threat to the production backend.

## 3. SBOM Generation
- The Software Bill of Materials has been successfully generated via the Anchore Action as an SPDX-JSON artifact and attached to the Release Candidate deployment bundle for compliance tracking.

## 4. API Security & Headers
- **TLS Validation**: The NGINX Ingress Controller is enforcing strict `https://` redirection.
- **Helmet Headers**: Staging API endpoints confirmed to return `Strict-Transport-Security`, `X-Frame-Options: DENY`, and `Content-Security-Policy`.
- **CORS Policies**: Successfully rejecting requests from non-whitelisted origins (origins other than `app.parilink.com`).
