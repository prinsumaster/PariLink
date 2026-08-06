# PariLink Version 2.0 — Security Certificate

**Date:** 2026-08-06  
**Certifier:** Principal Security Engineer  
**Status:** VALIDATED ✅

---

## 1. Authentication & Authorization

| Vector | Status | Validation Evidence |
|--------|--------|---------------------|
| **JWT** | ✅ PASS | Passport strategies active. Tokens require valid HS256/RS256 signatures and are subject to expiration (`exp`). |
| **RBAC** | ✅ PASS | NestJS `@Roles()` decorators map to database `Role` enums, blocking horizontal privilege escalation. |
| **Secrets** | ✅ PASS | No hardcoded credentials. All secrets injected via environment variables. |

## 2. Tenant Isolation (RLS)

| Vector | Status | Validation Evidence |
|--------|--------|---------------------|
| **Data Leakage** | ✅ PASS | Every query strictly funneled through `PrismaService.runAsTenant(companyId)`. |
| **Soft Deletes** | ✅ PASS | Removed manual soft-delete injections to allow the framework middleware to govern `deletedAt: null` securely. |

## 3. Application Security

| Vector | Status | Validation Evidence |
|--------|--------|---------------------|
| **SQL Injection** | ✅ PASS | No usage of `prisma.$queryRawUnsafe`. All inputs flow through parameterized ORM calls. |
| **DDoS / Brute Force**| ✅ PASS | `@Throttle()` guards applied to public auth routes and heavy dashboard analytical endpoints. |
| **Payload Tampering** | ✅ PASS | `ValidationPipe` globally strips non-whitelisted properties (`whitelist: true`) to prevent mass-assignment attacks on DTOs. |

## 4. Licensing Guardrails

| Vector | Status | Validation Evidence |
|--------|--------|---------------------|
| **Capacity Bypass** | ✅ PASS | Creation endpoints mathematically bound to subscription limits via `LicenseCapacityGuard`. |

---

**Conclusion:** The platform achieves a high-grade security posture, meeting standard compliance requirements for enterprise B2B SaaS deployments.
