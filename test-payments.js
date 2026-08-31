import { PrismaClient } from './apps/api/node_modules/@prisma/client/index.js';
const p = new PrismaClient();
async function run() {
  const admin = await p.user.findFirst({ where: { email: 'admin@parilink.com' }});
  if (!admin) return console.log('no admin');
  const payments = await p.payment.findMany({ where: { companyId: admin.companyId } });
  console.log('PAYMENTS COUNT:', payments.length);
  console.log('PAYMENTS:', payments);
}
run().finally(() => p.$disconnect());
