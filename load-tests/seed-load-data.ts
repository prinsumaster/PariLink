// @ts-nocheck
/**
 * load-tests/seed-load-data.ts
 * Run: npx ts-node -P apps/api/tsconfig.json load-tests/seed-load-data.ts
 *
 * Creates realistic multi-tenant load-test data:
 *  - 5 tenant companies
 *  - 50 vehicles per company (250 total)
 *  - 200 trips per company (1000 total)
 *  - 100 fuel logs per company (500 total)
 *  - 20 invoices per company (100 total)
 *
 * Idempotent: guarded by unique identifiers per company.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient({
  datasourceUrl: process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL,
});

const VEHICLE_TYPES = ['TRUCK', 'TRAILER', 'LCV', 'HCV', 'TANKER'];
const TRIP_STATUSES = ['COMPLETED', 'IN_TRANSIT', 'PLANNED'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDate(daysAgo: number) {
  return new Date(Date.now() - rand(0, daysAgo) * 86_400_000);
}

const TENANT_CONFIGS = [
  { name: 'Shree Ram Logistics', email: 'billing@shreeramlogistics.in', city: 'Mumbai' },
  { name: 'Bharat Freight Carriers', email: 'billing@bharatfreight.in', city: 'Delhi' },
  { name: 'South India Transporters', email: 'billing@sitr.in', city: 'Bangalore' },
  { name: 'Eastern Roads Express', email: 'billing@easternroads.in', city: 'Kolkata' },
  { name: 'Deccan Cargo Services', email: 'billing@deccancargo.in', city: 'Hyderabad' },
];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const results: Record<string, { companyId: string; vehicleIds: string[] }> = {};

  for (const config of TENANT_CONFIGS) {
    console.log(`\n🏢 Seeding tenant: ${config.name}`);

    // Create or find company
    let company = await prisma.company.findFirst({ where: { email: config.email } });
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: config.name,
          email: config.email,
          taxId: `LOAD${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          address: '123 Load Test Road',
          city: config.city,
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001',
          phone: '+91-9000000000',
          status: 'ACTIVE',
        },
      });
    }
    console.log(`  Company ID: ${company.id}`);

    // Ensure TenantConfiguration
    await prisma.tenantConfiguration.upsert({
      where: { companyId: company.id },
      update: {},
      create: {
        companyId: company.id,
        onboardingCompleted: true,
        timezone: 'Asia/Kolkata',
        currency: 'INR',
      },
    });

    // NOTE: Load test uses existing admin@parilink.com (already seeded by main seed.ts)
    // No per-tenant admin needed for the k6 script.

    // Seed vehicles (50 per tenant)
    const vehicleIds: string[] = [];
    const existingVehicles = await prisma.vehicle.findMany({ where: { companyId: company.id }, select: { id: true } });
    const needed = Math.max(0, 50 - existingVehicles.length);
    console.log(`  Existing vehicles: ${existingVehicles.length}, creating ${needed} more`);
    vehicleIds.push(...existingVehicles.map((v) => v.id));

    for (let i = 0; i < needed; i++) {
      const prefix = config.name.split(' ')[0].substring(0, 2).toUpperCase();
      const num = String(existingVehicles.length + i + 1).padStart(3, '0');
      const regNo = `MH${rand(10, 99)}-${prefix}-${num}`;
      const vehicle = await prisma.vehicle.create({
        data: {
          companyId: company.id,
          licensePlate: regNo,
          make: ['TATA', 'ASHOK LEYLAND', 'EICHER', 'MAHINDRA', 'VOLVO'][rand(0, 4)],
          model: `Model-${rand(100, 999)}`,
          year: rand(2015, 2024),
          type: VEHICLE_TYPES[rand(0, 4)],
          status: 'IN_SERVICE',
          capacityWeight: rand(5, 40),
        },
      });
      vehicleIds.push(vehicle.id);
    }
    console.log(`  Total vehicles: ${vehicleIds.length}`);

    // Seed drivers (5 per tenant, for trip assignments)
    const driverIds: string[] = [];
    const existingDrivers = await prisma.driver.findMany({ where: { companyId: company.id }, select: { id: true } });
    const driverNeeded = Math.max(0, 5 - existingDrivers.length);
    driverIds.push(...existingDrivers.map((d) => d.id));
    for (let i = 0; i < driverNeeded; i++) {
      const driver = await prisma.driver.create({
        data: {
          companyId: company.id,
          firstName: `Driver`,
          lastName: `${existingDrivers.length + i + 1}`,
          licenseNumber: `DL-LOAD-${company.id.substring(0, 6)}-${i + 1}`,
          phone: `+9190${rand(10000000, 99999999)}`,
          status: 'ACTIVE',
        },
      });
      driverIds.push(driver.id);
    }

    // Seed customers (5 per tenant, for trips)
    const customerIds: string[] = [];
    const existingCustomers = await prisma.customer.findMany({ where: { companyId: company.id }, select: { id: true } });
    const custNeeded = Math.max(0, 5 - existingCustomers.length);
    customerIds.push(...existingCustomers.map((c) => c.id));
    for (let i = 0; i < custNeeded; i++) {
      const cust = await prisma.customer.create({
        data: {
          companyId: company.id,
          name: `Load Customer ${existingCustomers.length + i + 1}`,
          email: `cust${i + 1}@loadtest-${company.id.substring(0, 6)}.com`,
          phone: `+9191${rand(10000000, 99999999)}`,
        },
      });
      customerIds.push(cust.id);
    }

    // Seed trips (200 per tenant)
    const existingTrips = await prisma.trip.findMany({ where: { companyId: company.id }, select: { id: true } });
    const tripsNeeded = Math.max(0, 200 - existingTrips.length);
    console.log(`  Existing trips: ${existingTrips.length}, creating ${tripsNeeded} more`);
    const tripIds: string[] = existingTrips.map((t) => t.id);

    for (let i = 0; i < tripsNeeded; i++) {
      const status = TRIP_STATUSES[rand(0, 2)];
      const origin = CITIES[rand(0, 9)];
      const destination = CITIES[rand(0, 9)];
      const startDate = randDate(90);
      const trip = await prisma.trip.create({
        data: {
          companyId: company.id,
          tripNumber: `LOAD-${company.id.substring(0, 4)}-${String(existingTrips.length + i + 1).padStart(5, '0')}`,
          status: status as any,
          vehicleId: vehicleIds[rand(0, vehicleIds.length - 1)],
          driverId: driverIds.length > 0 ? driverIds[rand(0, driverIds.length - 1)] : undefined,
          // Note: customerId does not exist on Trip - trips are linked via Load
          startDate,
          endDate: status === 'COMPLETED' ? new Date(startDate.getTime() + rand(1, 7) * 86_400_000) : undefined,
          rate: rand(5000, 50000),
          estimatedDistance: rand(100, 2000),
        },
      });
      tripIds.push(trip.id);
    }
    console.log(`  Total trips: ${tripIds.length}`);

    // FuelEntry requires tripId+driverId (non-nullable FKs) — seed via WorkshopJob instead
    // to generate realistic TCO cost data for the /vehicles/:id/tco endpoint.
    // This also populates the 'workshop' cost bucket tested by the TCO endpoint.
    const existingJobs = await prisma.maintenanceJob.count({ where: { companyId: company.id } });
    const jobsNeeded = Math.max(0, 100 - existingJobs);
    console.log(`  Existing maintenance jobs: ${existingJobs}, creating ${jobsNeeded} more`);
    for (let i = 0; i < jobsNeeded; i++) {
      await prisma.maintenanceJob.create({
        data: {
          companyId: company.id,
          vehicleId: vehicleIds[rand(0, vehicleIds.length - 1)],
          type: ['PREVENTIVE', 'BREAKDOWN'][rand(0, 1)],
          status: 'CLOSED',
          labourCost: rand(2000, 20000),
          openedAt: randDate(90),
          closedAt: randDate(60),
        },
      });
    }
    console.log(`  Maintenance jobs seeded`);

    // Seed invoices (20 per tenant)
    const existingInvoices = await prisma.invoice.count({ where: { companyId: company.id } });
    const invoicesNeeded = Math.max(0, 20 - existingInvoices);
    for (let i = 0; i < invoicesNeeded; i++) {
      const amount = rand(10000, 200000);
      const tax = amount * 0.18;
      if (customerIds.length === 0) break; // Invoice requires a customerId
      await prisma.invoice.create({
        data: {
          companyId: company.id,
          invoiceNumber: `INV-LOAD-${company.id.substring(0, 4)}-${String(existingInvoices + i + 1).padStart(4, '0')}`,
          customerId: customerIds[rand(0, customerIds.length - 1)],
          amount,
          subtotal: amount,
          tax,
          grandTotal: amount + tax,
          status: ['DRAFT', 'SENT', 'PAID'][rand(0, 2)] as any,
          dueDate: randDate(-30),
        },
      });
    }
    console.log(`  Invoices seeded`);

    results[config.name] = { companyId: company.id, vehicleIds };
  }

  console.log('\n\n✅ Seeding complete. Summary:');
  for (const [name, data] of Object.entries(results)) {
    console.log(`  ${name}: companyId=${data.companyId}, vehicles=${data.vehicleIds.length}`);
    console.log(`    First vehicleId for TCO test: ${data.vehicleIds[0]}`);
  }

  // Print final row counts
  const [vCount, tCount, mCount, iCount, cCount] = await Promise.all([
    prisma.vehicle.count(),
    prisma.trip.count(),
    prisma.maintenanceJob.count(),
    prisma.invoice.count(),
    prisma.company.count(),
  ]);
  console.log(`\n📊 FINAL DB ROW COUNTS:`);
  console.log(`  Companies:        ${cCount}`);
  console.log(`  Vehicles:         ${vCount}`);
  console.log(`  Trips:            ${tCount}`);
  console.log(`  MaintenanceJobs:  ${mCount}`);
  console.log(`  Invoices:         ${iCount}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
