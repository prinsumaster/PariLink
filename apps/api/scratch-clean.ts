import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.vehicleLocation.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.invoice.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.load.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.trip.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.vehicle.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.driver.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.customer.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.user.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.role.deleteMany({ where: { companyId: 'demo-company-1' }});
  await prisma.company.deleteMany({ where: { id: 'demo-company-1' }});
  
  // Also delete existing demo- records in the parilink company just in case they clash
  await prisma.invoice.deleteMany({ where: { id: { startsWith: 'demo-' }}});
  await prisma.load.deleteMany({ where: { id: { startsWith: 'demo-' }}});
  await prisma.trip.deleteMany({ where: { id: { startsWith: 'demo-' }}});
  await prisma.vehicle.deleteMany({ where: { id: { startsWith: 'demo-' }}});
  await prisma.driver.deleteMany({ where: { id: { startsWith: 'demo-' }}});
  await prisma.customer.deleteMany({ where: { id: { startsWith: 'demo-' }}});
  
  console.log("Cleanup done");
}
main().finally(() => prisma.$disconnect());
