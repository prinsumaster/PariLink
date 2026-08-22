import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding VehicleLocation for REPLAY mode...');

  const vehicle = await prisma.vehicle.findFirst({
    where: { vin: '1ZV900000000001' }
  });

  if (!vehicle) {
    console.error('Vehicle not found!');
    return;
  }

  // Delete existing locations for this vehicle to make it repeatable
  await prisma.vehicleLocation.deleteMany({
    where: { vehicleId: vehicle.id }
  });

  const ROUTE_POINTS = [
    [-97.7431, 30.2672], // Austin
    [-97.6831, 30.3672],
    [-97.5831, 30.4672],
    [-97.3831, 30.6672],
    [-97.1831, 30.8672], // Towards Dallas
    [-96.7970, 32.7767]  // Dallas
  ];

  const locations = [];
  const TOTAL_POINTS = 100;
  const BASE_TIME = Date.now() - (TOTAL_POINTS * 60000); // 100 minutes ago
  
  let currentSegment = 0;
  for (let i = 0; i < TOTAL_POINTS; i++) {
    const progress = i / (TOTAL_POINTS - 1);
    
    // Calculate which segment we're in
    const totalSegments = ROUTE_POINTS.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const pInsideSegment = segmentProgress - segmentIndex;

    if (segmentIndex >= totalSegments) {
      locations.push({
        companyId: vehicle.companyId,
        provider: 'REPLAY_SEED',
        providerVehicleId: vehicle.vin!,
        vehicleId: vehicle.id,
        longitude: ROUTE_POINTS[totalSegments][0],
        latitude: ROUTE_POINTS[totalSegments][1],
        gpsTimestamp: new Date(BASE_TIME + (i * 60000)),
        speed: 65,
        heading: 45,
      });
      continue;
    }

    const p1 = ROUTE_POINTS[segmentIndex];
    const p2 = ROUTE_POINTS[segmentIndex + 1];
    
    const lng = p1[0] + (p2[0] - p1[0]) * pInsideSegment;
    const lat = p1[1] + (p2[1] - p1[1]) * pInsideSegment;

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const heading = Math.atan2(dx, dy) * (180 / Math.PI);

    locations.push({
      companyId: vehicle.companyId,
      provider: 'REPLAY_SEED',
      providerVehicleId: vehicle.vin!,
      vehicleId: vehicle.id,
      longitude: lng,
      latitude: lat,
      gpsTimestamp: new Date(BASE_TIME + (i * 60000)),
      speed: 65,
      heading,
    });
  }

  await prisma.vehicleLocation.createMany({
    data: locations
  });

  const count = await prisma.vehicleLocation.count({
    where: { vehicleId: vehicle.id }
  });

  console.log(`✅ Inserted ${count} VehicleLocation rows for Replay!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
