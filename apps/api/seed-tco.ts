import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const company = await prisma.company.findFirst();
  if (!company) throw new Error('No company found');

  let vehicle = await prisma.vehicle.findFirst({ where: { companyId: company.id } });
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: { companyId: company.id, make: 'Tata', model: 'Prima', licensePlate: 'MH12XX9999', type: 'TRUCK', status: 'IN_SERVICE' }
    });
  }

  // Workshop
  let workshop = await prisma.workshop.findFirst({ where: { companyId: company.id } });
  if (!workshop) {
    workshop = await prisma.workshop.create({
      data: { id: 'tco-workshop-2', companyId: company.id, name: 'TCO Workshop', type: 'INTERNAL', location: 'Pune' }
    });
  }

  let driver = await prisma.driver.findFirst({ where: { companyId: company.id } });
  if (!driver) {
    driver = await prisma.driver.create({
      data: { companyId: company.id, firstName: 'TCO', lastName: 'Driver', status: 'ACTIVE' }
    });
  }

  let trip = await prisma.trip.findFirst({ where: { companyId: company.id } });
  if (!trip) {
    trip = await prisma.trip.create({
      data: { companyId: company.id, tripNumber: 'TCO-TRP-2', status: 'IN_PROGRESS', route: {} }
    });
  }

  // clear existing cost logs for this vehicle just in case to get precise TCO
  await prisma.fuelEntry.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.jobCard.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.insuranceLog.deleteMany({ where: { vehicleId: vehicle.id } });

  // Fuel costs
  await prisma.fuelEntry.create({
    data: { companyId: company.id, vehicleId: vehicle.id, tripId: trip.id, driverId: driver.id, amount: 2500, litres: 25, status: 'FILLED', filledAt: new Date('2026-09-01T10:00:00Z') }
  });
  await prisma.fuelEntry.create({
    data: { companyId: company.id, vehicleId: vehicle.id, tripId: trip.id, driverId: driver.id, amount: 3500, litres: 35, status: 'FILLED', filledAt: new Date('2026-09-05T10:00:00Z') }
  });

  // Workshop costs
  await prisma.jobCard.create({
    data: { companyId: company.id, vehicleId: vehicle.id, workshopId: workshop.id, issueReported: 'Brake pad change', totalCost: 6500, status: 'CLOSED', openedAt: new Date('2026-09-02T10:00:00Z') }
  });

  // Insurance costs
  await prisma.insuranceLog.create({
    data: { companyId: company.id, vehicleId: vehicle.id, provider: 'HDFC Ergo', policyNumber: 'POL-999', coverageType: 'COMPREHENSIVE', premiumAmount: 22000, issueDate: new Date('2026-09-01T10:00:00Z'), expiryDate: new Date('2027-09-01T10:00:00Z') }
  });

  console.log(`TCO Seeded for Vehicle: ${vehicle.id}`);
}

main().catch(console.error);
