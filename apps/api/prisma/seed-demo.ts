import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1 Company
  const company = await prisma.company.upsert({
    where: { id: 'demo-company-1' },
    update: {},
    create: {
      id: 'demo-company-1',
      name: 'Vanguard Freight Lines',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      status: 'ACTIVE'
    }
  });

  // Roles
  const roles = [
    { id: 'demo-role-admin', name: 'Admin', code: 'ADMIN' },
    { id: 'demo-role-dispatch', name: 'Dispatcher', code: 'DISPATCH' },
    { id: 'demo-role-finance', name: 'Finance', code: 'FINANCE' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        companyId: company.id,
        name: r.name,
      }
    });
  }

  // 4 Users
  const users = [
    { id: 'demo-user-1', email: 'admin@vanguard.com', first: 'Sarah', last: 'Connor', role: 'demo-role-admin' },
    { id: 'demo-user-2', email: 'dispatch@vanguard.com', first: 'Marcus', last: 'Wright', role: 'demo-role-dispatch' },
    { id: 'demo-user-3', email: 'finance@vanguard.com', first: 'Miles', last: 'Dyson', role: 'demo-role-finance' },
    { id: 'demo-user-4', email: 'ops@vanguard.com', first: 'Kyle', last: 'Reese', role: 'demo-role-dispatch' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashedPassword },
      create: {
        id: u.id,
        companyId: company.id,
        email: u.email,
        password: hashedPassword, // Demo placeholder
        firstName: u.first,
        lastName: u.last,
        roleId: u.role,
        status: 'ACTIVE'
      }
    });
  }

  // 6 Drivers
  const driverNames = [
    { f: 'Raj', l: 'Patel' }, { f: 'John', l: 'Smith' }, { f: 'David', l: 'Miller' },
    { f: 'Miguel', l: 'Rodriguez' }, { f: 'James', l: 'Wilson' }, { f: 'Amit', l: 'Kumar' }
  ];
  
  const createdDrivers = [];
  for (let i=0; i<driverNames.length; i++) {
    const d = await prisma.driver.upsert({
      where: { id: `demo-driver-${i}` },
      update: {},
      create: {
        id: `demo-driver-${i}`,
        companyId: company.id,
        firstName: driverNames[i].f,
        lastName: driverNames[i].l,
        status: i % 3 === 0 ? 'ON_TRIP' : 'AVAILABLE'
      }
    });
    createdDrivers.push(d);
  }

  // 8 Vehicles
  const vehiclePlates = ['IL-VG100', 'IL-VG101', 'IL-VG102', 'IL-VG103', 'IN-VG200', 'IN-VG201', 'WI-VG300', 'WI-VG301'];
  const createdVehicles = [];
  for (let i=0; i<vehiclePlates.length; i++) {
    const v = await prisma.vehicle.upsert({
      where: { id: `demo-vehicle-${i}` },
      update: {},
      create: {
        id: `demo-vehicle-${i}`,
        companyId: company.id,
        make: i < 4 ? 'Freightliner' : 'Volvo',
        model: 'Cascadia',
        licensePlate: vehiclePlates[i],
        type: 'TRUCK',
        status: 'IN_SERVICE'
      }
    });
    createdVehicles.push(v);
  }

  // 3 Trailers
  const trailerPlates = ['TR-900', 'TR-901', 'TR-902'];
  const createdTrailers = [];
  for (let i=0; i<trailerPlates.length; i++) {
    const t = await prisma.vehicle.upsert({
      where: { id: `demo-trailer-${i}` },
      update: {},
      create: {
        id: `demo-trailer-${i}`,
        companyId: company.id,
        make: 'Wabash',
        model: 'Dry Van 53',
        licensePlate: trailerPlates[i],
        type: 'TRAILER',
        status: 'IN_SERVICE'
      }
    });
    createdTrailers.push(t);
  }

  // 12 Customers
  const customerNames = [
    'Acme Corp', 'Global Logistics', 'Midwest Manufacturing', 'Northern Foods',
    'TechSupply Inc', 'Builders FirstSource', 'Target Distribution', 'Amazon Fulfillment',
    'Walmart Supply', 'Home Depot Logistics', 'Kraft Heinz', 'Procter & Gamble'
  ];
  const createdCustomers = [];
  for (let i=0; i<customerNames.length; i++) {
    const c = await prisma.customer.upsert({
      where: { id: `demo-cust-${i}` },
      update: {},
      create: {
        id: `demo-cust-${i}`,
        companyId: company.id,
        name: customerNames[i],
        status: 'ACTIVE'
      }
    });
    createdCustomers.push(c);
  }

  // 20 Loads
  const createdLoads = [];
  const statuses = ['PENDING', 'PLANNED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
  for (let i=0; i<20; i++) {
    const l = await prisma.load.upsert({
      where: { id: `demo-load-${i}` },
      update: {},
      create: {
        id: `demo-load-${i}`,
        companyId: company.id,
        customerId: createdCustomers[i % 12].id,
        referenceNumber: `LD-2026-${1000 + i}`,
        originAddress: '100 Main St',
        originCity: i % 2 === 0 ? 'Chicago' : 'Detroit',
        originState: i % 2 === 0 ? 'IL' : 'MI',
        destinationAddress: '200 Oak St',
        destinationCity: i % 3 === 0 ? 'Indianapolis' : 'Columbus',
        destinationState: i % 3 === 0 ? 'IN' : 'OH',
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000 * 2),
        rate: 1500 + (i * 100),
        status: statuses[i % 5]
      }
    });
    createdLoads.push(l);
  }

  // 10 Trips
  const createdTrips = [];
  const tripStatuses = ['PLANNED', 'DISPATCHED', 'IN_TRANSIT', 'COMPLETED'];
  for (let i=0; i<10; i++) {
    const t = await prisma.trip.upsert({
      where: { tripNumber: `TRP-2026-${1000 + i}` },
      update: {},
      create: {
        id: `demo-trip-${i}`,
        companyId: company.id,
        tripNumber: `TRP-2026-${1000 + i}`,
        driverId: createdDrivers[i % 6].id,
        vehicleId: createdVehicles[i % 8].id,
        trailerId: createdTrailers[i % 3].id,
        status: tripStatuses[i % 4],
        startDate: new Date(),
      }
    });
    createdTrips.push(t);

    // Link trip to load if possible
    await prisma.load.update({
      where: { id: createdLoads[i].id },
      data: { tripId: t.id }
    });
  }

  // 15 Invoices
  const invStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE'];
  for (let i=0; i<15; i++) {
    const invDate = new Date();
    if (invStatuses[i % 4] === 'OVERDUE') invDate.setDate(invDate.getDate() - 30);
    
    await prisma.invoice.upsert({
      where: { companyId_invoiceNumber: { companyId: company.id, invoiceNumber: `INV-2026-${1000 + i}` } },
      update: {},
      create: {
        id: `demo-inv-${i}`,
        companyId: company.id,
        customerId: createdCustomers[i % 12].id,
        loadId: createdLoads[i].id,
        invoiceNumber: `INV-2026-${1000 + i}`,
        amount: 1500 + (i * 100),
        status: invStatuses[i % 4],
        dueDate: invDate
      }
    });
  }

  // VehicleLocation history for 3 vehicles
  const baseLat = 41.8781; // Chicago
  const baseLng = -87.6298;
  for (let v=0; v<3; v++) {
    for (let p=0; p<10; p++) {
      // Avoid unique constraint issues by deleting old first or just using createMany
      // We will create using a generated ID to avoid conflicts if we run multiple times, 
      // but let's just clear old demo location history first
      await prisma.vehicleLocation.deleteMany({
        where: { companyId: company.id, vehicleId: createdVehicles[v].id }
      });
    }
    
    for (let p=0; p<10; p++) {
      await prisma.vehicleLocation.create({
        data: {
          id: `demo-loc-${v}-${p}-${Date.now()}`,
          companyId: company.id,
          vehicleId: createdVehicles[v].id,
          provider: 'DEMO',
          providerVehicleId: `EXT-${createdVehicles[v].id}`,
          latitude: baseLat + (v * 0.1) + (p * 0.05),
          longitude: baseLng - (v * 0.1) - (p * 0.05),
          speed: 55,
          heading: 90,
          gpsTimestamp: new Date(Date.now() - (10 - p) * 60000)
        }
      });
    }
  }

  console.log('Demo data seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
