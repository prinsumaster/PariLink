import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:8080/api/v1';

async function main() {
  console.log('--- STEP 2.5 CHECKS ---\n');

  // 1. Create Tenant A and Tenant B users for auth
  const tenantA = await prisma.company.findFirst();
  if (!tenantA) throw new Error('No Tenant A found');

  // Find or create Tenant B
  let tenantB = await prisma.company.findFirst({ where: { id: { not: tenantA.id } } });
  if (!tenantB) {
    tenantB = await prisma.company.create({
      data: {
        name: 'Tenant B Logistics',
        plan: 'ENTERPRISE',
      }
    });
  }

  // Create users for both tenants
  const emailA = 'adminA@parilink.in';
  const emailB = 'adminB@parilink.in';
  
  await prisma.user.upsert({
    where: { email: emailA },
    update: { companyId: tenantA.id },
    create: { email: emailA, passwordHash: 'hash', role: 'ADMIN', companyId: tenantA.id, name: 'Admin A' }
  });
  
  await prisma.user.upsert({
    where: { email: emailB },
    update: { companyId: tenantB.id },
    create: { email: emailB, passwordHash: 'hash', role: 'ADMIN', companyId: tenantB.id, name: 'Admin B' }
  });

  // Get tokens (assuming local dev auth bypass or we can mint a JWT, wait, PariLink might use JWT. Let's check auth strategy).
  // Actually, we can just use the DB to create the data, and we need to know how the API authenticates.
  // The verify_all.py script used Bearer tokens? Let's check verify_all.py to see how it authenticates.
}

main().catch(console.error).finally(() => prisma.$disconnect());
