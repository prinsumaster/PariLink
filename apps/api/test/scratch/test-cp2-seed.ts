import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: { db: { url: "postgresql://postgres:postgres@localhost:5434/postgres" } }
  });

  const companyA = '5f302208-e523-439a-9698-178e8924a7fc';
  const companyB = '01041308-a695-45ac-bc25-7a6c23030f45';

  await prisma.company.upsert({
    where: { id: companyB },
    update: {},
    create: { id: companyB, name: 'Company B' }
  });

  const driver = await prisma.driver.create({
    data: { id: 'd2222222-2222-2222-2222-222222222222', companyId: companyB, firstName: 'Driver', lastName: 'B' }
  });

  const vehicle = await prisma.vehicle.create({
    data: { id: 'v2222222-2222-2222-2222-222222222222', companyId: companyB, licensePlate: 'BB-1234' }
  });

  const tripB = await prisma.trip.create({
    data: { id: 'tr222222-2222-2222-2222-222222222222', companyId: companyB, tripNumber: 'TRIP-B', driverId: driver.id, vehicleId: vehicle.id }
  });

  // TripDesk for B
  await prisma.tripDesk.create({
    data: { id: 't2222222-2222-2222-2222-222222222222', companyId: companyB, tripId: tripB.id, desk: 'Desk B' }
  });

  // User for B
  await prisma.user.create({
    data: { id: 'u2222222-2222-2222-2222-222222222222', companyId: companyB, email: 'userb@b.com', password: 'password', firstName: 'User', lastName: 'B' }
  });

  console.log("Seeded");
}

main().catch(console.error);
