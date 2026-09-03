import { PrismaClient } from '@prisma/client';

const url = process.env.TARGET_DATABASE_URL;
if (!url) { console.error('TARGET_DATABASE_URL must be set'); process.exit(1); }
const prisma = new PrismaClient({ datasourceUrl: url });
console.log('Target:', new URL(url).host + new URL(url).pathname);
const DEFAULT_TRIP_DESKS = ['DISPATCH', 'DIESEL', 'FASTAG', 'WORKSHOP', 'DOCS'];

async function main() {
  console.log('Fetching all trips...');
  const trips = await prisma.trip.findMany({
    include: {
      TripDesk: true,
    }
  });

  let createdCount = 0;

  for (const trip of trips) {
    const existingDesks = new Set(trip.TripDesk.map(td => td.desk));
    
    for (const desk of DEFAULT_TRIP_DESKS) {
      if (!existingDesks.has(desk)) {
        await prisma.tripDesk.create({
          data: {
            companyId: trip.companyId,
            tripId: trip.id,
            desk,
            status: 'PENDING'
          }
        });
        createdCount++;
      }
    }
  }

  console.log(`Backfill completed. Created ${createdCount} missing trip desks.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
