import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const COMPANY_ID = '42821801-eb35-410d-adf5-4f86d0f901e2'; // Same as seed-telemetry

async function main() {
  const plates = ['MH-04-AB-1234', 'DL-1L-BC-9876', 'GJ-01-AB-5678', 'RJ-14-CD-2233', 'TN-22-EF-9900', 'KA-01-GH-7711'];
  
  for (const plate of plates) {
    const v = await prisma.vehicle.findFirst({ where: { licensePlate: plate, companyId: COMPANY_ID } });
    if (v) {
      // Find or create a trip for this vehicle
      let trip = await prisma.trip.findFirst({ where: { vehicleId: v.id, companyId: COMPANY_ID } });
      if (!trip) {
        trip = await prisma.trip.create({
          data: {
            companyId: COMPANY_ID,
            vehicleId: v.id,
            status: 'IN_PROGRESS',
            startDate: new Date(),
            tripNumber: `TRP-${plate}`
          }
        });
        console.log(`Created IN_PROGRESS trip for ${plate}`);
      } else {
        await prisma.trip.update({
          where: { id: trip.id },
          data: { status: 'IN_PROGRESS' }
        });
        console.log(`Updated trip for ${plate} to IN_PROGRESS`);
      }
    }
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
