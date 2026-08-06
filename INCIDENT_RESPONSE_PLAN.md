# Incident Response Plan

## Immediate Actions (0-24 Hours)
1. **Rotate Credentials**: Immediately rotate the PostgreSQL database password (`parilink_admin`) as it was exposed in an unencrypted `.env` file in the `made by other devlopre /parilink/parilink/` directory.
2. **Remediate SSRF**: Patch `apps/api/src/integration/webhook/webhook-platform.service.ts` to validate all outgoing webhook URLs and block access to internal IP ranges (127.0.0.1, 10.0.0.0/8, 169.254.169.254, etc.).
3. **Patch Dependencies**: Run `npm audit fix` and manually upgrade `@xmldom/xmldom` to resolve the CRITICAL XML injection vulnerability.
4. **Remove Unsafe AI Tool**: Disable or completely rewrite the `query_database_sql` tool in `apps/api/src/ai/copilot/tools.ts` to prevent AI-driven raw SQL execution.

## Short Term (1-7 Days)
1. **Fix SQL Injections**: Refactor `$queryRawUnsafe` in `data-quality-engine.service.ts` and `mdm-search.service.ts` to use `Prisma.sql` tagged template literals or native Prisma APIs.
2. **Secrets Management**: Remove the hardcoded `whsec_replay_secret` from `webhook-platform.service.ts` and move it to a secure environment variable.
3. **Clean Repository**: Delete the suspicious `made by other devlopre /parilink/parilink/` directory from the filesystem and ensure it is not tracked in Git.

## Long Term
1. **Security Automation**: Implement Trivy and TruffleHog as blocking steps in the CI pipeline (currently configured but need strict enforcement).
2. **Network Egress Filtering**: Configure the production EKS cluster to block unauthorized egress traffic from the API pods, mitigating future SSRF impacts.
