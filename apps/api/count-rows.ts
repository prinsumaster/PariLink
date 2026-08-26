import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@parilink.com' },
    include: { company: true }
  });
  const cId = existingAdmin?.companyId;
  console.log("For Vanguard Company:");
  console.log("User:", await prisma.user.count({ where: { companyId: cId } }));
  console.log("Vehicle:", await prisma.vehicle.count({ where: { companyId: cId, type: 'TRUCK' } }));
  console.log("Trailer:", await prisma.vehicle.count({ where: { companyId: cId, type: 'TRAILER' } }));
  console.log("Driver:", await prisma.driver.count({ where: { companyId: cId } }));
  console.log("Customer:", await prisma.customer.count({ where: { companyId: cId } }));
  console.log("Load:", await prisma.load.count({ where: { companyId: cId } }));
  console.log("Trip:", await prisma.trip.count({ where: { companyId: cId } }));
  console.log("Invoice:", await prisma.invoice.count({ where: { companyId: cId } }));
  console.log("VehicleLocation:", await prisma.vehicleLocation.count({ where: { companyId: cId } }));
}
main().catch(console.error).finally(() => prisma.$disconnect());
