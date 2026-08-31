require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const company = await prisma.company.findFirst();
  const trip = await prisma.trip.findFirst({
    include: { vehicle: true, driver: true }
  });

  if (!trip) {
    console.log('No trips found');
    return;
  }

  for (let i = 0; i < 3; i++) {
    await prisma.fuelEntry.create({
      data: {
        companyId: company.id,
        tripId: trip.id,
        vehicleId: trip.vehicleId,
        driverId: trip.driverId,
        litres: 100,
        amount: 9000,
        pump: 'IOCL',
        slipNo: `SLIP-NORM-${i}`,
        expectedLitres: 100,
        variancePct: 2.5,
        filledAt: new Date()
      }
    });
  }

  await prisma.fuelEntry.create({
    data: {
      companyId: company.id,
      tripId: trip.id,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      litres: 200,
      amount: 18000,
      pump: 'IOCL',
      slipNo: `SLIP-SPIKE-1`,
      expectedLitres: 100,
      variancePct: 100, 
      filledAt: new Date()
    }
  });
  
  const driver2 = await prisma.driver.findFirst({ where: { id: { not: trip.driverId } }});
  const truck2 = await prisma.vehicle.findFirst({ where: { id: { not: trip.vehicleId } }});
  
  if (driver2 && truck2) {
    for (let i = 0; i < 3; i++) {
      await prisma.fuelEntry.create({
        data: {
          companyId: company.id,
          tripId: trip.id,
          vehicleId: truck2.id, 
          driverId: driver2.id,
          litres: 150,
          amount: 13500,
          pump: 'BPCL',
          slipNo: `SLIP-PILF-${i}`,
          expectedLitres: 100,
          variancePct: 50,
          filledAt: new Date()
        }
      });
      await prisma.fuelEntry.create({
        data: {
          companyId: company.id,
          tripId: trip.id,
          vehicleId: trip.vehicleId, 
          driverId: driver2.id,
          litres: 150,
          amount: 13500,
          pump: 'BPCL',
          slipNo: `SLIP-PILF2-${i}`,
          expectedLitres: 100,
          variancePct: 40,
          filledAt: new Date()
        }
      });
    }
  }

  if (driver2 && truck2) {
    for (let i = 0; i < 3; i++) {
      await prisma.fuelEntry.create({
        data: {
          companyId: company.id,
          tripId: trip.id,
          vehicleId: truck2.id, 
          driverId: trip.driverId, 
          litres: 140,
          amount: 12600,
          pump: 'HP',
          slipNo: `SLIP-MECH1-${i}`,
          expectedLitres: 100,
          variancePct: 40,
          filledAt: new Date()
        }
      });
      await prisma.fuelEntry.create({
        data: {
          companyId: company.id,
          tripId: trip.id,
          vehicleId: truck2.id, 
          driverId: driver2.id, 
          litres: 140,
          amount: 12600,
          pump: 'HP',
          slipNo: `SLIP-MECH2-${i}`,
          expectedLitres: 100,
          variancePct: 40,
          filledAt: new Date()
        }
      });
    }
  }

  console.log('Anomalies seeded');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
