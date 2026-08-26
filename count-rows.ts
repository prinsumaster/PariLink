import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log("User:", await prisma.user.count());
  console.log("Vehicle:", await prisma.vehicle.count({ where: { type: 'TRUCK' } }));
  console.log("Trailer:", await prisma.vehicle.count({ where: { type: 'TRAILER' } }));
  console.log("Driver:", await prisma.driver.count());
  console.log("Customer:", await prisma.customer.count());
  console.log("Load:", await prisma.load.count());
  console.log("Trip:", await prisma.trip.count());
  console.log("Invoice:", await prisma.invoice.count());
  console.log("VehicleLocation:", await prisma.vehicleLocation.count());
}
main().catch(console.error).finally(() => prisma.$disconnect());
