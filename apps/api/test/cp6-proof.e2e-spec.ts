import { validateGeneratedSql } from '../src/ai/copilot/sql-validator';

/**
 * CP6 — SQL Validator: live attack-surface payloads.
 *
 * Context: app.bypass_rls was removed from all 219 policies in
 * 20260902000000_drop_bypass_rls. Payloads targeting it are inert and prove
 * nothing. The live attack surface — confirmed by the GUC re-point proof
 * (guc-attack-proof.mjs, 2026-09-13) — is:
 *
 *   set_config('app.current_company_id', '<other-tenant>', true)
 *
 * ...executed via $executeRawUnsafe inside a runAsTenant transaction.
 * That path does NOT go through this validator; the validator only covers
 * LLM-generated SQL routed through /ai/interact. But a prompt injection
 * that embeds one of these payloads in the LLM's output would pass through
 * the validator, so the validator must block them.
 *
 * This suite verifies at the unit level (validateGeneratedSql directly):
 * 1. Every set_config variant targeting app.current_company_id is rejected,
 *    each with a non-empty error reason.
 * 2. Rejections produce at least two distinct error messages (not one
 *    hardcoded string across all five payloads).
 * 3. SET ROLE parilink_sys (BYPASSRLS role escalation) is rejected.
 * 4. Legacy bypass_rls payloads remain rejected (belt-and-suspenders).
 * 5. A well-formed tenant-scoped SELECT is accepted.
 */
describe('CP6 SQL Validator — live attack-surface payloads', () => {
  const ALLOWED = ['Trip', 'Load', 'Invoice', 'Vehicle', 'Driver', 'Customer', 'Expense'];

  // --- GUC re-point payloads (the confirmed live attack vector) ---
  describe('GUC re-point: set_config targeting app.current_company_id', () => {
    const rejectCases: [string, string][] = [
      [
        'plain set_config repoint',
        `SELECT id FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config('app.current_company_id','other-tenant',true)='other-tenant'`,
      ],
      [
        'pg_catalog-qualified set_config repoint',
        `SELECT id FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_catalog.set_config('app.current_company_id','other-tenant',true)='other-tenant'`,
      ],
      [
        'case-shuffled SeT_CoNfIg repoint',
        `SELECT id FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND SeT_CoNfIg('app.current_company_id','other-tenant',true)='other-tenant'`,
      ],
      [
        'comment-injected set_config repoint',
        `SELECT id FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config /*x*/ ('app.current_company_id','other-tenant',true)='other-tenant'`,
      ],
      [
        'standalone set_config before SELECT via semicolon',
        `SELECT set_config('app.current_company_id','other-tenant',true); SELECT id FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`,
      ],
    ];

    it.each(rejectCases)('rejects: %s', (_label, sql) => {
      const result = validateGeneratedSql(sql, ALLOWED);
      expect(result.ok).toBe(false);
      expect(result.reason).toBeDefined();
      expect(result.reason!.length).toBeGreaterThan(0);
    });

    it('each rejection carries a distinct error message (not a single hardcoded string)', () => {
      const reasons = rejectCases.map(([, sql]) => {
        const r = validateGeneratedSql(sql, ALLOWED);
        return r.reason ?? '';
      });
      const uniqueReasons = new Set(reasons);
      expect(uniqueReasons.size).toBeGreaterThanOrEqual(2);
    });
  });

  // --- Role escalation ---
  describe('Role escalation', () => {
    it('rejects SET ROLE parilink_sys', () => {
      const sql = `SET ROLE parilink_sys; SELECT id FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`;
      const result = validateGeneratedSql(sql, ALLOWED);
      expect(result.ok).toBe(false);
      expect(result.reason).toBeDefined();
    });
  });

  // --- Old bypass_rls payloads (GUC is inert but validator must still reject) ---
  describe('Legacy bypass_rls payloads (belt-and-suspenders)', () => {
    const legacyCases: [string, string][] = [
      [
        'set_config bypass_rls with OR injection',
        `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config('app.bypass_rls','on',true)='on' OR 1=1`,
      ],
      [
        'pg_catalog.set_config bypass_rls',
        `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_catalog.set_config('app.bypass_rls','on',true)='on'`,
      ],
      [
        'pg_sleep timing attack',
        `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_sleep(1) IS NULL`,
      ],
    ];

    it.each(legacyCases)('rejects: %s', (_label, sql) => {
      const result = validateGeneratedSql(sql, ALLOWED);
      expect(result.ok).toBe(false);
    });
  });

  // --- A valid query must still pass ---
  describe('Valid query', () => {
    it('accepts a well-formed tenant-scoped SELECT', () => {
      const sql = `SELECT id, status FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND status='IN_TRANSIT' LIMIT 10`;
      const result = validateGeneratedSql(sql, ALLOWED);
      expect(result.ok).toBe(true);
    });
  });
});
