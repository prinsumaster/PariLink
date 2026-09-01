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

  const trip = await prisma.trip.findFirst();
  if (!trip) throw new Error("No trip");



  // TripDesk for B
  await prisma.tripDesk.create({
    data: { id: 't2222222-2222-2222-2222-222222222222', companyId: companyB, tripId: trip.id, desk: 'Desk B' }
  });

  console.log("Seeded");
}

main().catch(console.error);
