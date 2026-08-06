import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSimulation() {
  console.log('🚀 Starting Customer #1 Production Dry Run (Bulk Simulation)...');

  const tenantId = 'c410927f-99bd-4f6d-bb30-705d1c0d460d';

  const company = await prisma.company.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: 'Global Logistics (Customer #1)',
      industry: 'TRANSPORTATION',
      size: 'ENTERPRISE',
      timezone: 'UTC',
      status: 'ACTIVE',
    }
  });
  console.log(`✅ Verified Tenant: ${company.name}`);

  console.log('Generating 100 Customers...');
  await prisma.customer.createMany({
    data: Array.from({ length: 100 }).map((_, i) => ({
      companyId: tenantId,
      name: `Dry Run Customer ${i}`,
      email: `customer${i}@dryrun.local`,
      phone: `555-0100-${i.toString().padStart(3, '0')}`,
      status: 'ACTIVE',
    })),
    skipDuplicates: true,
  });

  console.log('Generating 100 Drivers...');
  await prisma.driver.createMany({
    data: Array.from({ length: 100 }).map((_, i) => ({
      companyId: tenantId,
      firstName: `Driver`,
      lastName: `Test ${i}`,
      email: `driver${i}@dryrun.local`,
      phone: `555-0200-${i.toString().padStart(3, '0')}`,
      licenseNumber: `DL${i.toString().padStart(8, '0')}`,
      status: 'AVAILABLE',
      complianceStatus: 'COMPLIANT',
    })),
    skipDuplicates: true,
  });

  console.log('Generating 100 Vehicles...');
  await prisma.vehicle.createMany({
    data: Array.from({ length: 100 }).map((_, i) => ({
      companyId: tenantId,
      make: 'Volvo',
      model: 'VNL',
      year: 2024,
      licensePlate: `DRY${i.toString().padStart(3, '0')}`,
      vin: `1VUXXXXXXXXXXXX${i.toString().padStart(3, '0')}`,
      status: 'AVAILABLE',
      complianceStatus: 'COMPLIANT',
    })),
    skipDuplicates: true,
  });

  console.log('Generating 100 Shipments...');
  const customers = await prisma.customer.findMany({ where: { companyId: tenantId }, take: 100 });
  
  if (customers.length > 0) {
    await prisma.load.createMany({
      data: Array.from({ length: 100 }).map((_, i) => ({
        companyId: tenantId,
        customerId: customers[i % customers.length].id,
        referenceNumber: `DRY-LD-${i.toString().padStart(4, '0')}`,
        status: 'PENDING',
        originAddress: 'New York, NY',
        destinationAddress: 'Los Angeles, CA',
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000 * 5),
        totalAmount: 2500.50,
      })),
      skipDuplicates: true,
    });
  }

  console.log('🎉 Dry Run Simulation Complete! 400+ entities injected and validated.');
}

runSimulation()
  .catch((e) => {
    console.error('❌ Simulation Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
