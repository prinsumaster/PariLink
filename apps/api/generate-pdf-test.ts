import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ include: { role: true } });
  if (!admin) throw new Error('No admin found');
  
  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role?.name || 'ADMIN', companyId: admin.companyId },
    process.env.JWT_SECRET || 'fallback-secret-key-for-development-only-12345!', 
    { expiresIn: '1h' }
  );

  const invoice = await prisma.invoice.findFirst();
  const lr = await prisma.lorryReceipt.findFirst();

  console.log(`export JWT_TOKEN="${token}"`);
  console.log(`export INVOICE_ID="${invoice?.id}"`);
  console.log(`export LR_ID="${lr?.id}"`);
}

main().catch(console.error);
