import { PrismaClient } from '@prisma/client';
import { validateGeneratedSql } from '../../src/ai/copilot/sql-validator';

async function bootstrap() {
  const prisma = new PrismaClient();
  try {
    const ALLOWED_TABLES = [
      'Trip', 'Load', 'Invoice', 'Vehicle',
      'Driver', 'Customer', 'Expense'
    ];

    const companyA = '18f24eb8-0d1a-4ed1-8c96-3e3980e4ca5c';
    const companyB = '01041308-a695-45ac-bc25-7a6c23030f45';

    async function executeDirectly(companyId: string, sqlQuery: string, name: string) {
      console.log(`\n=== Executing for ${name} ===`);
      
      const validation = validateGeneratedSql(sqlQuery, ALLOWED_TABLES);
      if (!validation.ok) {
        console.log(`Validation failed: ${validation.reason}`);
        return;
      }
      
      const sanitizedQuery = sqlQuery.replace(/'\{\{COMPANY_ID_PLACEHOLDER\}\}'|\{\{COMPANY_ID_PLACEHOLDER\}\}/g, '$1');
      
      // We implement the EXACT logic from generateAndExecuteSafeSql Step 3
      // We don't have runAsTenant on PrismaClient here because PrismaClient is unextended, 
      // but runAsTenant basically sets the config and runs the function.
      
      try {
        await prisma.$executeRawUnsafe(`SELECT set_config('app.current_company_id', $1, false)`, companyId);
        
        await prisma.$executeRawUnsafe('SET LOCAL ROLE parilink_ai;');
        await prisma.$executeRawUnsafe('SET LOCAL transaction_read_only = on;');
        
        const result = await prisma.$queryRawUnsafe(sanitizedQuery, companyId);
        console.log('Result:', result);
      } catch (err: any) {
        console.log('Execution Failed:', err.message);
      } finally {
        await prisma.$executeRawUnsafe(`RESET ALL;`);
      }
    }

    const validQuery = `SELECT count(*) FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`;
    await executeDirectly(companyA, validQuery, 'Tenant A');
    await executeDirectly(companyB, validQuery, 'Tenant B');

    const invalidQuery = `SELECT count(*) FROM "User" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`;
    await executeDirectly(companyA, invalidQuery, 'Negative Test (User Table)');
    
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
