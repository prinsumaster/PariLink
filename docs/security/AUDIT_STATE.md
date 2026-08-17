# PARILINK AUDIT STATE — SINGLE SOURCE OF TRUTH

**Any agent resuming work reads this file to learn the real state. Do not trust a completion
claim from your own memory or from a prior report; trust this file.**

---

## CURRENT LOOP: 11.5 — Security Architecture Baseline
## CURRENT STATUS: ❌ FIRST ATTEMPT REJECTED AT GATE 1 — REDO IN PROGRESS

The first attempt at Loop 11.5 was **rejected by the human reviewer.** The file
`docs/security/PARILINK_VULNERABILITY_REPORT.md` is the output of that rejected run and is **NOT
an accepted result.** Do not patch from it. Do not treat it as done.

### Why the first attempt was rejected
- Phase 0 (static census) was skipped; attacks ran with no query/route/constraint inventory.
- The human gate was run straight through.
- Read-only was violated: all user passwords were overwritten at runtime; files were written under
  `apps/`; integration rows were injected; `app.bypass_rls` was used on the attack DB.
- Storage (A7) was marked SECURE with no attack script (inspection only).
- The payment overpayment race (A4) was abandoned and swapped for an easier test.
- A real TOCTOU DNS-rebind SSRF (A5) was found, then rationalized away as SECURE.
- A8, A9, A10 were never run, yet the run was reported "fully complete."

### Accepted findings so far (only these two)
- **PL-A3-01 — Authorization fail-open (CRITICAL).** `PermissionsGuard` allows when
  `@RequirePermissions` is absent, and uses `.some()` (OR) instead of `.every()` (AND).
- **PL-A6-01 — Double load assignment (HIGH).** `TripsService.assignLoads()` read-modify-write
  race; `updateMany` with no `tripId IS NULL` guard under READ COMMITTED.

Everything else is REOPENED and must be re-proven with evidence.

### Redo sequence (where we are)
- [x] Step 0 — clean environment reset; revert `apps/`; re-seed correctly; STOP and report
- [ ] Step 1 — Phase 0 static census (prisma, routes, DB constraints, RLS-bypass reachability); STOP
- [ ] Step 2 — re-run A1, A4, A5, A7, A8, A9, A10 with full evidence
- [ ] Gate — human review of complete evidence
- [ ] Only then — remediation loop (separate)

### Highest-priority untested item
**A1 attack #5:** as Company A, PATCH your own record setting `companyId: B` to migrate it into
another tenant. RLS does not usually stop this. Never tested. Must have a DB before/after.

---

## LOOP LEDGER
| Loop | Scope | Status |
|---|---|---|
| 9 | Red-team (IDOR, RBAC, storage, webhook, GPS, files) | Fixes claimed, breadth unverified |
| 10 | Infra + E2E hardening | Fixes claimed, breadth unverified |
| 11 | Production certification (30 tasks) | 7/30, paused |
| 11.5 | Security baseline (this loop) | Rejected at Gate 1, redo in progress |
