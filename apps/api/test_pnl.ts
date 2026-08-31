import { PrismaClient } from '@prisma/client';
import { ProfitabilityService } from './src/profitability/profitability.service';
import { PrismaService } from './src/prisma/prisma.service';

async function run() {
  const prisma = new PrismaClient();
  const prismaService = new PrismaService();
  const profitabilityService = new ProfitabilityService(prismaService);

  const company = await prisma.company.findFirst();
  if (!company) throw new Error('No company found');

  console.log('--- Triggering Nightly Aggregation ---');
  const aggRes = await profitabilityService.aggregateVehicles(company.id);
  console.log('Aggregation result:', aggRes);

  console.log('\n--- Fetching Per-Truck P&L ---');
  const pnlRes = await profitabilityService.listVehiclePnl(company.id);
  console.log(JSON.stringify(pnlRes, null, 2));
}

run().catch(console.error);


