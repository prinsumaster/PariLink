/**
 * Isolation seed: creates one record of every core entity
 * in BOTH tenant-a and tenant-b so that cross-tenant
 * access tests have real rows to attack.
 *
 * Idempotent — run twice, row counts identical.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL
});

async function seedTenant(
  companyId: string,
  suffix: 'a' | 'b',
) {
  // Customer
  await prisma.customer.upsert({
    where: { id: `isol-cust-${suffix}` },
    update: {},
    create: {
      id: `isol-cust-${suffix}`,
      companyId,
      name: `Isolation Customer ${suffix.toUpperCase()}`,
      email: `cust-${suffix}@isolation.test`,
    },
  });

  // Vehicle
  await prisma.vehicle.upsert({
    where: { id: `isol-veh-${suffix}` },
    update: {},
    create: {
      id: `isol-veh-${suffix}`,
      companyId,
      licensePlate: `ISO-${suffix.toUpperCase()}-001`,
      type: 'TRUCK',
      status: 'IN_SERVICE',
    },
  });

  // Driver
  await prisma.driver.upsert({
    where: { id: `isol-drv-${suffix}` },
    update: {},
    create: {
      id: `isol-drv-${suffix}`,
      companyId,
      firstName: `Driver${suffix.toUpperCase()}`,
      lastName: 'Isolation',
      licenseNumber: `LIC-${suffix.toUpperCase()}-001`,
      status: 'AVAILABLE',
    },
  });

  // Trip (requires vehicle + driver)
  await prisma.trip.upsert({
    where: { id: `isol-trip-${suffix}` },
    update: {},
    create: {
      id: `isol-trip-${suffix}`,
      companyId,
      tripNumber: `ISOL-${suffix.toUpperCase()}-001`,
      vehicleId: `isol-veh-${suffix}`,
      driverId: `isol-drv-${suffix}`,
      status: 'PLANNED',
      startDate: new Date(),
    },
  });

  // Load (requires customer + trip)
  await prisma.load.upsert({
    where: { id: `isol-load-${suffix}` },
    update: {},
    create: {
      id: `isol-load-${suffix}`,
      companyId,
      customerId: `isol-cust-${suffix}`,
      tripId: `isol-trip-${suffix}`,
      referenceNumber: `LD-ISOL-${suffix.toUpperCase()}-001`,
      status: 'PENDING',
      rate: 5000,
      originCity: `OriginCity${suffix.toUpperCase()}`,
      originState: 'MH',
      originAddress: `1 Origin St, ${suffix.toUpperCase()}`,
      destinationCity: `DestCity${suffix.toUpperCase()}`,
      destinationState: 'DL',
      destinationAddress: `1 Dest St, ${suffix.toUpperCase()}`,
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 86400000),
      equipmentType: 'DRY_VAN',
    },
  });

  // Invoice (requires customer)
  await prisma.invoice.upsert({
    where: { id: `isol-inv-${suffix}` },
    update: {},
    create: {
      id: `isol-inv-${suffix}`,
      companyId,
      customerId: `isol-cust-${suffix}`,
      loadId: `isol-load-${suffix}`,
      invoiceNumber: `INV-ISOL-${suffix.toUpperCase()}-001`,
      amount: 5000,
      status: 'DRAFT',
    },
  });

  // Payment (requires invoice)
  await prisma.payment.upsert({
    where: { id: `isol-pay-${suffix}` },
    update: {},
    create: {
      id: `isol-pay-${suffix}`,
      companyId,
      invoiceId: `isol-inv-${suffix}`,
      amount: 5000,
      method: 'BANK_TRANSFER',
      paymentDate: new Date(),
    },
  });

  // Document
  await prisma.document.upsert({
    where: { id: `isol-doc-${suffix}` },
    update: {},
    create: {
      id: `isol-doc-${suffix}`,
      companyId,
      loadId: `isol-load-${suffix}`,
      type: 'POD',
      fileUrl: `https://storage.test/${companyId}/isol-doc-${suffix}.pdf`,
      fileName: `isol-doc-${suffix}.pdf`,
      mimeType: 'application/pdf',
      sizeBytes: 12345,
    },
  });

  console.log(`  Seeded all 8 entities for tenant-${suffix} (companyId=${companyId})`);
}

async function main() {
  console.log('Seeding isolation test data...');
  const a = await prisma.user.findUnique({ where: { email: 'admin_a@parilink.com' } });
  const b = await prisma.user.findUnique({ where: { email: 'admin_b@parilink.com' } });
  if (!a || !b) throw new Error('Run seed-test.ts first to create admin_a and admin_b');
  
  await seedTenant(a.companyId, 'a');
  await seedTenant(b.companyId, 'b');
  console.log('Done. Row counts should be identical on re-run (upsert).');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
