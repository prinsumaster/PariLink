import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.count();
  const user = await prisma.user.count();
  const vehicle = await prisma.vehicle.count();
  const driver = await prisma.driver.count();
  const customer = await prisma.customer.count();
  const load = await prisma.load.count();
  const trip = await prisma.trip.count();
  const invoice = await prisma.invoice.count();
  const vehicleLocation = await prisma.vehicleLocation.count();
  
  console.log(`Company: ${company}`);
  console.log(`User: ${user}`);
  console.log(`Vehicle: ${vehicle}`);
  console.log(`Driver: ${driver}`);
  console.log(`Customer: ${customer}`);
  console.log(`Load: ${load}`);
  console.log(`Trip: ${trip}`);
  console.log(`Invoice: ${invoice}`);
  console.log(`VehicleLocation: ${vehicleLocation}`);
  await prisma.$disconnect();
}
main().catch(console.error);
