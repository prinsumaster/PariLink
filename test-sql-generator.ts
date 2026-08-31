import { ForbiddenException } from '@nestjs/common';

// MOCK the service implementation to test validation
class MockSqlGeneratorService {
  private readonly ALLOWED_TABLES = ['Trip', 'Load', 'Invoice', 'Vehicle', 'Driver', 'Customer', 'Expense'];
  public validateSqlSafety(query: string, companyId: string): void {
    const upperQuery = query.toUpperCase();
    if (/(;|\-\-|\/\*|UNION)/i.test(query)) {
      throw new ForbiddenException('Invalid SQL syntax: UNION, comments, or multiple statements are not allowed.');
    }
    if (
      upperQuery.includes('UPDATE ') || upperQuery.includes('DELETE ') || upperQuery.includes('INSERT ') ||
      upperQuery.includes('DROP ') || upperQuery.includes('ALTER ') || upperQuery.includes('TRUNCATE ')
    ) {
      throw new ForbiddenException('Only SELECT queries are allowed.');
    }
    const tableRegex = /(?:FROM|JOIN)\s+"?([a-zA-Z0-9_]+)"?/ig;
    let match;
    const referencedTables = new Set<string>();
    while ((match = tableRegex.exec(query)) !== null) {
      referencedTables.add(match[1]);
    }
    for (const table of referencedTables) {
      if (!this.ALLOWED_TABLES.includes(table)) {
        throw new ForbiddenException(`Access to table ${table} is not allowed.`);
      }
    }
    const normalizedQuery = query.replace(/\s+/g, '');
    if (!normalizedQuery.includes('"companyId"=\'{{COMPANY_ID_PLACEHOLDER}}\'')) {
      throw new ForbiddenException('Tenant isolation validation failed: companyId predicate missing.');
    }
  }
}

const service = new MockSqlGeneratorService();
const queries = [
  `SELECT * FROM "User" WHERE '{{COMPANY_ID_PLACEHOLDER}}'='{{COMPANY_ID_PLACEHOLDER}}'`,
  `SELECT * FROM "Trip" WHERE 1=1 -- {{COMPANY_ID_PLACEHOLDER}}`,
  `SELECT * FROM "Trip" UNION SELECT * FROM "User" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`,
  `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`
];

for (const q of queries) {
  try {
    service.validateSqlSafety(q, 'co_123');
    console.log(`[PASS] ${q}`);
  } catch(e: any) {
    console.log(`[REJECTED] ${q}\n  -> ${e.message}`);
  }
}
