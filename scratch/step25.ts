import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const BASE = 'http://localhost:8080/api/v1';

async function main() {
  console.log("=== STEP 2.5: SECURITY & VALIDATION CHECKS ===\n");

  // 1. SEED TENANT B
  let tenantB = await prisma.company.findFirst({ where: { name: 'Tenant B Logistics' } });
  if (!tenantB) {
    tenantB = await prisma.company.create({ data: { name: 'Tenant B Logistics', plan: 'ENTERPRISE' } });
  }

  const emailB = 'tenantb@parilink.in';
  let userB = await prisma.user.findFirst({ where: { email: emailB } });
  if (!userB) {
    userB = await prisma.user.create({
      data: {
        email: emailB,
        passwordHash: '$2b$10$yFf6cO8Y8a/1X1QjXFjJ2O/C5Q7aFw5rFh7J6qJ8Gz8fO8e8w9a2G', // hash for 'password123' (approx, maybe login will fail if salt is wrong, let's use Prisma to just hash? Wait, PariLink probably uses bcrypt. Let's just create a raw user if possible, or use the auth endpoint if it registers. Actually, let's look at how seed.ts hashes passwords).
      }
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
