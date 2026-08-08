import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATES = ['MH', 'GJ', 'DL', 'KA', 'TN', 'UP', 'HR', 'RJ', 'TS', 'WB'];
const CITIES = ['Mumbai', 'Ahmedabad', 'New Delhi', 'Bengaluru', 'Chennai', 'Lucknow', 'Gurugram', 'Jaipur', 'Hyderabad', 'Kolkata'];
const COMPANIES = ['Shree Ganesh', 'Mahadev', 'Kutch Freight', 'Om Sai', 'Bharat', 'National', 'TCI', 'VRL', 'Gati', 'SafeExpress'];
const SUFFIXES = ['Roadlines', 'Logistics', 'Transport', 'Freight Movers', 'Cargo', 'Carriers', 'Supply Chain'];
const FIRST_NAMES = ['Rahul', 'Amit', 'Vikram', 'Sanjay', 'Rajesh', 'Anil', 'Suresh', 'Prakash', 'Mahesh', 'Ramesh', 'Raju', 'Pappu'];
const LAST_NAMES = ['Patel', 'Singh', 'Sharma', 'Yadav', 'Gupta', 'Kumar', 'Desai', 'Chauhan', 'Rajput', 'Jain'];
const TRUCK_MAKES = ['Tata', 'Ashok Leyland', 'Mahindra', 'BharatBenz', 'Eicher', 'Volvo', 'Scania'];
const TRUCK_MODELS = ['Signa 4923.S', 'Prima 4018.S', 'U-3518', 'Blazo X 49', 'Pro 8049', 'FH16', 'P410'];
const EQUIPMENT = ['OPEN_BODY', 'CONTAINER', 'REEFER', 'FLATBED', 'TANKER'];
const LOAD_STATUS = ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
const INDUSTRIES = ['FMCG', 'Pharmaceuticals', 'Automotive', 'Textiles', 'E-commerce', 'Agriculture', 'Steel', 'Cement'];

const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => +(Math.random() * (max - min) + min).toFixed(2);
const phone = () => `+91${randInt(7000000000, 9999999999)}`;
const email = (name: string) => `${name.toLowerCase().replace(/\s+/g,'')}${randInt(100,999)}@example.com`;

async function main() {
  // Get the primary company
  const company = await prisma.company.findFirst({ where: { name: 'PariLink Logistics LLC' } });
  if (!company) { console.error('Primary company not found! Run the main seed first.'); process.exit(1); }
  const companyId = company.id;

  console.log(`Seeding bulk data for company: ${companyId}`);
  const startTime = Date.now();

  // ─── Customers ────────────────────────────────────────────────────────────
  console.log('Creating 500 customers...');
  const existingCustomers = await prisma.customer.count({ where: { companyId } });
  const customersNeeded = Math.max(0, 500 - existingCustomers);
  if (customersNeeded > 0) {
    const customers = Array.from({ length: customersNeeded }, (_, i) => {
      const bizName = `${rand(COMPANIES)} ${rand(SUFFIXES)} ${i + 1}`;
      return {
        companyId,
        name: bizName,
        email: email(bizName),
        phone: phone(),
        status: Math.random() > 0.1 ? 'ACTIVE' : 'INACTIVE',

      };
    });
    await prisma.customer.createMany({ data: customers, skipDuplicates: true });
    console.log(`  ✓ Created ${customersNeeded} customers`);
  } else {
    console.log(`  ↩ Skipped (already have ${existingCustomers})`);
  }

  // ─── Vendors ──────────────────────────────────────────────────────────────
  console.log('Creating 300 vendors...');
  const existingVendors = await prisma.vendor.count({ where: { companyId } });
  const vendorsNeeded = Math.max(0, 300 - existingVendors);
  if (vendorsNeeded > 0) {
    const vendors = Array.from({ length: vendorsNeeded }, (_, i) => {
      const bizName = `${rand(COMPANIES)} Vendor ${i + 1}`;
      return {
        companyId,
        name: bizName,
        email: email(bizName),
        phone: phone(),
        type: rand(['CARRIER', 'MAINTENANCE', 'FUEL', 'INSURANCE', 'OTHER']),
        paymentTerms: rand(['NET_30', 'NET_60', 'NET_15', 'PREPAID']),
        status: Math.random() > 0.1 ? 'ACTIVE' : 'INACTIVE',
      };
    });
    await prisma.vendor.createMany({ data: vendors, skipDuplicates: true });
    console.log(`  ✓ Created ${vendorsNeeded} vendors`);
  } else {
    console.log(`  ↩ Skipped (already have ${existingVendors})`);
  }

  // ─── Drivers ──────────────────────────────────────────────────────────────
  console.log('Creating 300 drivers...');
  const existingDrivers = await prisma.driver.count({ where: { companyId } });
  const driversNeeded = Math.max(0, 300 - existingDrivers);
  if (driversNeeded > 0) {
    const drivers = Array.from({ length: driversNeeded }, (_, i) => {
      const fn = rand(FIRST_NAMES);
      const ln = rand(LAST_NAMES);
      return {
        companyId,
        firstName: fn,
        lastName: ln,
        email: email(`${fn}${ln}`),
        phone: phone(),
        licenseNumber: `DL-${randInt(10, 99)}${randInt(1000000, 9999999)}`,
        licenseState: rand(STATES),
        status: rand(['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'ON_TRIP', 'OFF_DUTY']),
      };
    });
    await prisma.driver.createMany({ data: drivers, skipDuplicates: true });
    console.log(`  ✓ Created ${driversNeeded} drivers`);
  } else {
    console.log(`  ↩ Skipped (already have ${existingDrivers})`);
  }

  // ─── Vehicles ─────────────────────────────────────────────────────────────
  console.log('Creating 500 vehicles...');
  const existingVehicles = await prisma.vehicle.count({ where: { companyId } });
  const vehiclesNeeded = Math.max(0, 500 - existingVehicles);
  if (vehiclesNeeded > 0) {
    const vehicles = Array.from({ length: vehiclesNeeded }, (_, i) => ({
      companyId,
      make: rand(TRUCK_MAKES),
      model: rand(TRUCK_MODELS),
      year: randInt(2015, 2026),
      vin: `VIN${randInt(10000000000, 99999999999)}`,
      licensePlate: `${rand(STATES)}-${randInt(10000, 99999)}`,
      type: rand(['TRUCK', 'VAN', 'TRAILER']),
      status: rand(['IN_SERVICE', 'IN_SERVICE', 'IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE']),
      capacityWeight: randInt(20000, 48000),
    }));
    await prisma.vehicle.createMany({ data: vehicles, skipDuplicates: true });
    console.log(`  ✓ Created ${vehiclesNeeded} vehicles`);
  } else {
    console.log(`  ↩ Skipped (already have ${existingVehicles})`);
  }

  // ─── Branches ─────────────────────────────────────────────────────────────
  console.log('Creating 20 branches...');
  const existingBranches = await prisma.branch.count({ where: { companyId } });
  if (existingBranches === 0) {
    const branches = CITIES.map((city, i) => ({
      companyId,
      name: `${city} Terminal`,
      code: `${STATES[i]}-TRM-${String(i+1).padStart(2,'0')}`,
      city,
      state: STATES[i],
      country: 'USA',
      phone: phone(),
      status: 'ACTIVE',
    }));
    await prisma.branch.createMany({ data: branches });
    console.log(`  ✓ Created ${branches.length} branches`);
  } else {
    console.log(`  ↩ Skipped (already have ${existingBranches})`);
  }

  // ─── Loads ────────────────────────────────────────────────────────────────
  console.log('Creating 10,000 loads...');
  const existingLoads = await prisma.load.count({ where: { companyId } });
  const loadsNeeded = Math.max(0, 10000 - existingLoads);
  
  if (loadsNeeded > 0) {
    const customers = await prisma.customer.findMany({ where: { companyId }, select: { id: true }, take: 200 });
    const drivers = await prisma.driver.findMany({ where: { companyId }, select: { id: true }, take: 200 });
    const vehicles = await prisma.vehicle.findMany({ where: { companyId }, select: { id: true }, take: 200 });

    console.log(`  Creating loads in batches of 500 (${loadsNeeded} needed)...`);

    let created = 0;
    const batchSize = 500;
    
    while (created < loadsNeeded) {
      const batchCount = Math.min(batchSize, loadsNeeded - created);
      const loads = Array.from({ length: batchCount }, (_, i) => {
        const totalIdx = existingLoads + created + i;
        const pickupDate = new Date(Date.now() - randInt(0, 180) * 24 * 60 * 60 * 1000);
        const deliveryDate = new Date(pickupDate.getTime() + randInt(1, 14) * 24 * 60 * 60 * 1000);
        const status = rand(LOAD_STATUS);
        const origIdx = randInt(0, 9);
        const destIdx = (origIdx + randInt(1, 9)) % 10;
        const customerId = customers[randInt(0, customers.length - 1)]?.id;
        const driverId = status !== 'PENDING' ? drivers[randInt(0, drivers.length - 1)]?.id : undefined;
        const vehicleId = status !== 'PENDING' ? vehicles[randInt(0, vehicles.length - 1)]?.id : undefined;

        return {
          companyId,
          referenceNumber: `LD-${String(totalIdx + 1).padStart(6, '0')}`,
          customerId: customerId ?? undefined,
          originAddress: `${randInt(1, 999)} ${rand(['Industrial', 'Commerce', 'Warehouse', 'Freight'])} Blvd`,
          originCity: CITIES[origIdx],
          originState: STATES[origIdx],
          destinationAddress: `${randInt(1, 999)} ${rand(['Distribution', 'Port', 'Terminal', 'Dock'])} Way`,
          destinationCity: CITIES[destIdx],
          destinationState: STATES[destIdx],
          pickupDate,
          deliveryDate,
          status,
          equipmentType: rand(EQUIPMENT),
          rate: randFloat(800, 8500),
          weight: randInt(1000, 48000),
          notes: Math.random() > 0.7 ? 'Handle with care' : null,
        };
      });

      await prisma.load.createMany({ data: loads, skipDuplicates: true });
      created += batchCount;
      if (created % 2000 === 0 || created >= loadsNeeded) {
        console.log(`  Progress: ${created}/${loadsNeeded} loads created...`);
      }
    }
    console.log(`  ✓ Created ${loadsNeeded} loads`);
  } else {
    console.log(`  ↩ Skipped (already have ${existingLoads})`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🌱 Bulk seeding complete in ${elapsed}s`);
  
  // Final summary
  const [custCount, vendCount, drvCount, vehCount, loadCount, branchCount] = await Promise.all([
    prisma.customer.count({ where: { companyId } }),
    prisma.vendor.count({ where: { companyId } }),
    prisma.driver.count({ where: { companyId } }),
    prisma.vehicle.count({ where: { companyId } }),
    prisma.load.count({ where: { companyId } }),
    prisma.branch.count({ where: { companyId } }),
  ]);
  
  console.log('\n📊 Database Summary:');
  console.log(`  Customers: ${custCount}`);
  console.log(`  Vendors: ${vendCount}`);
  console.log(`  Drivers: ${drvCount}`);
  console.log(`  Vehicles: ${vehCount}`);
  console.log(`  Loads: ${loadCount}`);
  console.log(`  Branches: ${branchCount}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
