# Security Policy

## Supported Versions

Only the current major release branch is supported with critical security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within PariLink, please send an e-mail to our dedicated Security Incident Response Team (SIRT) at `security@parilink.test`. 

All security vulnerabilities will be promptly addressed. Please **do not** open public GitHub issues or forum posts regarding the exploit. 

When reporting, please provide:
- A brief description of the vulnerability.
- Steps to reproduce.
- Any potential impact on cross-tenant isolation (IDOR).
- Proof of Concept (PoC) scripts if applicable.

We aim to acknowledge all vulnerability reports within 24 hours.

## Auditing and Compliance
PariLink v1.0 Enterprise forces strict multi-tenant Data Isolation (Row Level Security) at the database tier. All API requests are cryptographically validated via signed JWTs, and the application strictly enforces whitelist CORS origins. Third-party integrations must use rotated API keys or scoped OAuth2 tokens.

> **IMPORTANT**: In version 2.0.x, OAuth2 `client_credentials` tokens have migrated from signed JWTs to high-entropy opaque tokens. Any integration holding a token issued prior to this change will receive a 401 Unauthorized and must re-run the `client_credentials` exchange to obtain a valid opaque token.

## DB Password Rotation Runbook
- Correct method: ALTER USER parilink WITH PASSWORD '...'; then update .env, restart the API only.
- WARNING: never `docker volume rm` a data volume to change credentials. Postgres reads POSTGRES_PASSWORD only on first init.

## Test Fixture Cleanup Policy

**Rule: Every cleanup DELETE must carry a WHERE clause scoped to the fixture.**

An unfiltered `DELETE FROM "OAuthClient"` during Q3 testing permanently erased 4 test-fixture rows that could not be restored from seed. All future test fixture teardown scripts must:

1. Identify the specific IDs or key fields created at the start of the test.
2. Delete using a narrow `where` clause — for example:
   ```typescript
   // CORRECT — scoped delete
   await prisma.oAuthClient.deleteMany({
     where: { id: { in: [throwawayClientId] } },
   });

   // WRONG — never do this in a test script
   await prisma.oAuthClient.deleteMany({});
   ```
3. Print before/after counts around any delete block to make the blast radius visible.

The IoT webhook cleanup (`cleanup_iot.ts`) from this same session is the canonical correct example — it used `where: { vehicleId: 'V1' }`, `where: { companyId: 'SYSTEM', provider: 'IOT_PROVIDER' }`, etc., and printed before/after row counts.

## Architecture Decision Records

### ADR-SEC-001: Rate Limiting & Hard Lockout
**Status**: Accepted (v1.0), Scheduled for Migration (v1.1)

**Context:** The current authentication implementation uses a strict IP-based rate limiter that triggers a hard lockout on violations.
**Reality Check (Post-Deploy):** This implementation still reflects reality. It successfully mitigates brute-force attacks but introduces an accepted risk of DoS via IP spoofing or NAT overlap.
**Milestone:** This is an accepted risk for v1.0. In the v1.1 milestone, the hard lockout mechanism will be migrated to a progressive delay/CAPTCHA system or account-level scoped lockout to reduce DoS surface area.

---

### ADR-SEC-002: GUC Tenant Re-point via `set_config` — Finding, Fix, and Ongoing Risk
**Status**: Confirmed Finding → Fixed (2026-09-17)

**Finding:**
Raw `set_config('app.current_company_id', <tenantB>, true)` inside a Prisma transaction is sufficient to repoint RLS context mid-transaction, bypassing PostgreSQL Row-Level Security and allowing cross-tenant data access. This was confirmed exploitable at the raw database level via both `$executeRawUnsafe` **and** `$queryRawUnsafe`.

**Evidence (both vectors confirmed by `scripts/guc-attack.ts`):**
- `$executeRawUnsafe` repoint: `belonging to B` jumped from 0 → 1 inside the same transaction
- `$queryRawUnsafe` repoint: identical result — `SELECT set_config(...)` parameterized form also succeeded

**Root cause of gap:**
The `runAsTenant` Proxy interceptor in `apps/api/src/prisma/prisma.service.ts` originally only intercepted `$executeRaw` and `$executeRawUnsafe`. The `$queryRaw` and `$queryRawUnsafe` methods — used by `SqlGeneratorService` to execute LLM-generated SQL inside `runAsTenant` — were not guarded.

**Fix applied (2026-09-17):**
The Proxy interceptor was extended to uniformly cover all four raw-query methods: `$executeRaw`, `$executeRawUnsafe`, `$queryRaw`, `$queryRawUnsafe`. Any `set_config(` in the query string now throws `Forbidden raw query pattern: session configuration injection is blocked by security interceptor`.

Post-fix verification: `scripts/guc-attack-postfix.ts` confirmed `REPOINT CALL BLOCKED` and `belonging to B` stayed at 0.

**Ongoing risk:**
`CopilotService` is **live in the NestJS DI container** (registered in `AiModule` → imported by `AppModule`) and is injected into `AiCopilotChatService`. The only current protection is that `AiCopilotChatService` never calls `this._copilot.processRequest()`. If a developer wires `CopilotService` to an HTTP route, user-controlled input will flow through `SqlGeneratorService` → `$queryRawUnsafe`. The `runAsTenant` interceptor (this fix) is the structural backstop, backed by `sql-validator.ts` which bans `SET` and `SET_CONFIG` keywords. **Verify both are still in place before wiring any HTTP route to `CopilotService`.**
