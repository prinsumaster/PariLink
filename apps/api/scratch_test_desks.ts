import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find a trip and company
  const trip = await prisma.trip.findFirst({
    include: { company: true }
  });
  
  if (!trip) {
    console.log('No trip found to test.');
    return;
  }
  
  const companyId = trip.companyId;
  const tripId = trip.id;
  
  console.log(`Testing with Trip: ${tripId} (Company: ${companyId})`);
  
  // 1. Create desks if they don't exist (simulating trip creation)
  const desks = ['DISPATCH', 'DIESEL', 'FASTAG', 'WORKSHOP', 'DOCS'];
  for (const desk of desks) {
    await prisma.tripDesk.upsert({
      where: {
        id: `temp-${desk}`
      },
      update: { status: 'PENDING' },
      create: {
        companyId,
        tripId,
        desk,
        status: 'PENDING',
      }
    });
  }
  
  // 2. Fetch desks
  const currentDesks = await prisma.tripDesk.findMany({
    where: { tripId }
  });
  console.log(`Current Desks: ${currentDesks.length} PENDING`);
  
  // 3. Complete 4 desks
  for (let i = 0; i < 4; i++) {
    await prisma.tripDesk.update({
      where: { id: currentDesks[i].id },
      data: { status: 'DONE' }
    });
  }
  console.log(`Completed 4 desks.`);
  
  // 4. Try to close trip
  const existingTrip = await prisma.trip.findFirst({
    where: { id: tripId },
    include: { TripDesk: true }
  });
  
  const pendingDesks = existingTrip?.TripDesk?.filter(d => d.status === 'PENDING') || [];
  if (pendingDesks.length > 0) {
    console.log(`[422 EXPECTED] Cannot close trip. Pending desks: ${pendingDesks.map(d => d.desk).join(', ')}`);
  }
  
  // 5. Complete 5th desk
  await prisma.tripDesk.update({
    where: { id: currentDesks[4].id },
    data: { status: 'DONE' }
  });
  console.log(`Completed 5th desk.`);
  
  // 6. Try to close trip again
  const existingTrip2 = await prisma.trip.findFirst({
    where: { id: tripId },
    include: { TripDesk: true }
  });
  
  const pendingDesks2 = existingTrip2?.TripDesk?.filter(d => d.status === 'PENDING') || [];
  if (pendingDesks2.length === 0) {
    console.log(`[200 OK] Trip closed successfully.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
