import { validateGeneratedSql } from './sql-validator';

describe('sql-validator', () => {
  const allowedTables = ['Trip', 'Load', 'Invoice'];

  it('allows valid queries', () => {
    const query = "SELECT * FROM Trip WHERE companyId = '{{COMPANY_ID_PLACEHOLDER}}'";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(true);
  });

  // 0  WHERE "companyId"='{{…}}' OR 1=1                                  → REJECTED
  it('0  WHERE "companyId"=\'{{…}}\' OR 1=1 -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' OR 1=1";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false);
  });

  // 1  WHERE "companyId"='{{…}}' OR true                                 → REJECTED
  it('1  WHERE "companyId"=\'{{…}}\' OR true -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' OR true";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false);
  });

  // 2  WHERE "companyId"='{{…}}' AND set_config(…)                       → REJECTED
  it('2  WHERE "companyId"=\'{{…}}\' AND set_config(…) -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config('x', 'y')";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false);
  });

  // 3  WHERE "companyId"='{{…}}' AND pg_catalog.set_config(…)            → REJECTED
  it('3  WHERE "companyId"=\'{{…}}\' AND pg_catalog.set_config(…) -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_catalog.set_config('x', 'y')";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false);
  });

  // 4  WHERE "companyId"='{{…}}' AND SeT_CoNfIg(…)                       → REJECTED
  it('4  WHERE "companyId"=\'{{…}}\' AND SeT_CoNfIg(…) -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND SeT_CoNfIg('x', 'y')";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false);
  });

  // 5  WHERE "companyId"='{{…}}' AND set_config /*x*/ (…)                → REJECTED
  it('5  WHERE "companyId"=\'{{…}}\' AND set_config /*x*/ (…) -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config /*x*/ ('x', 'y')";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false); // Should be rejected because of comments
  });

  // 6  WHERE "companyId"='{{…}}' AND pg_sleep(1) IS NULL                 → REJECTED
  it('6  WHERE "companyId"=\'{{…}}\' AND pg_sleep(1) IS NULL -> REJECTED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_sleep(1) IS NULL";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(false);
  });

  // 7  WHERE "companyId"='{{…}}' LIMIT 10                                → ALLOWED
  it('7  WHERE "companyId"=\'{{…}}\' LIMIT 10 -> ALLOWED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' LIMIT 10";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(true);
  });

  // 8  WHERE "companyId"='{{…}}' AND (status='A' OR status='B')          → ALLOWED
  it('8  WHERE "companyId"=\'{{…}}\' AND (status=\'A\' OR status=\'B\') -> ALLOWED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND (status='A' OR status='B')";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(true);
  });

  // 9  WHERE "companyId"='{{…}}' AND "createdAt" > now() - interval '7 days'  → ALLOWED
  it('9  WHERE "companyId"=\'{{…}}\' AND "createdAt" > now() - interval \'7 days\' -> ALLOWED', () => {
    const query = "SELECT * FROM Trip WHERE \"companyId\"='{{COMPANY_ID_PLACEHOLDER}}' AND \"createdAt\" > now() - interval '7 days'";
    const res = validateGeneratedSql(query, allowedTables);
    expect(res.ok).toBe(true);
  });
});
