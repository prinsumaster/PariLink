import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.vehicleLocation.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.invoice.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.load.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.trip.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.vehicle.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.driver.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.customer.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.user.deleteMany({ where: { id: { startsWith: 'demo-' } } });
  await prisma.role.deleteMany({ where: { id: { startsWith: 'demo-' } } });
}
main().catch(console.error).finally(() => prisma.$disconnect());
