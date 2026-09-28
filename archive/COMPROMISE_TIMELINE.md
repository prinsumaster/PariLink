# Compromise Timeline

- **Unknown Date**: Third-party or other developer cloned/copied the repository into `made by other devlopre /parilink/parilink/` and left an `.env` file containing `DATABASE_URL=postgresql://parilink_admin:parilink2026@localhost:5432/parilink_db`.
- **Pre-Audit**: Development proceeded with vulnerable architectural patterns including unrestricted webhooks (SSRF), raw SQL execution, and AI-driven raw SQL execution.
- **2026-08-05 (Current Audit)**:
  - Discovered 39 npm vulnerabilities (1 Critical, 9 High).
  - Uncovered SSRF in `webhook-platform.service.ts`.
  - Identified `$queryRawUnsafe` usage in multiple files.
  - Confirmed absence of OS-level persistence mechanisms (cron/LaunchAgents) related to the repository.

**Status**: Potential partial credential compromise via the suspicious backup folder. No active reverse shells or crypto miners found in the main source tree.
