import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Find the existing demo admin to use its company
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@parilink.com' },
    include: { company: true }
  });

  if (!existingAdmin) {
    throw new Error('admin@parilink.com not found. Ensure initial seed is run first.');
  }

  const company = existingAdmin.company;

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
    { id: 'demo-user-1', email: 'admin@vanguard.com', first: 'Rajiv', last: 'Sharma', role: 'demo-role-admin' },
    { id: 'demo-user-2', email: 'dispatch@vanguard.com', first: 'Anil', last: 'Verma', role: 'demo-role-dispatch' },
    { id: 'demo-user-3', email: 'finance@vanguard.com', first: 'Sunita', last: 'Desai', role: 'demo-role-finance' },
    { id: 'demo-user-4', email: 'ops@vanguard.com', first: 'Vikram', last: 'Singh', role: 'demo-role-dispatch' },
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

  // 8 Drivers (Indian)
  const driverNames = [
    { f: 'Ramesh', l: 'Patel' }, { f: 'Suresh', l: 'Kumar' }, { f: 'Amit', l: 'Singh' },
    { f: 'Rajesh', l: 'Sharma' }, { f: 'Vikram', l: 'Yadav' }, { f: 'Prakash', l: 'Mishra' },
    { f: 'Sunil', l: 'Deshmukh' }, { f: 'Vijay', l: 'Chauhan' }
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

  // 15 Vehicles (Indian RTO Plates)
  const vehiclePlates = [
    'MH-12-CD-5678', 'MH-14-AB-1234', 'GJ-01-EF-9012', 'GJ-05-XY-3456', 'KA-05-MN-7890',
    'KA-01-PQ-2345', 'DL-01-ZA-1111', 'DL-09-BC-2222', 'UP-16-RS-3333', 'HR-26-TU-4444',
    'TN-09-VW-5555', 'TS-07-XY-6666', 'WB-02-ZA-7777', 'MP-09-BC-8888', 'RJ-14-EF-9999'
  ];
  const createdVehicles = [];
  for (let i=0; i<vehiclePlates.length; i++) {
    const v = await prisma.vehicle.upsert({
      where: { id: `demo-vehicle-${i}` },
      update: {},
      create: {
        id: `demo-vehicle-${i}`,
        companyId: company.id,
        make: i % 2 === 0 ? 'Tata Motors' : 'Ashok Leyland',
        model: i % 2 === 0 ? 'Prima 4028.S' : 'Blaze 4220',
        licensePlate: vehiclePlates[i],
        type: 'TRUCK',
        status: 'IN_SERVICE'
      }
    });
    createdVehicles.push(v);
  }

  // 8 Customers (Indian Freight)
  const customerNames = [
    'Bhonsle Transport', 'Gupta Roadways', 'Krishna Logistics', 'Verma Transport',
    'Real Cargo', 'Balaji Logistics', 'Maharaja Freight', 'Tirupati Carriers'
  ];
  const createdCustomers = [];
  for (let i=0; i<customerNames.length; i++) {
    const gstin = `27AAAAA000${i}A1Z5`;
    const c = await prisma.customer.upsert({
      where: { id: `demo-cust-${i}` },
      update: { name: customerNames[i], taxId: gstin },
      create: {
        id: `demo-cust-${i}`,
        companyId: company.id,
        name: customerNames[i],
        taxId: gstin,
        status: 'ACTIVE'
      }
    });
    createdCustomers.push(c);
  }

  // Accounts (Financial Integrity)
  const bankAcc = await prisma.account.upsert({
    where: { companyId_code: { companyId: company.id, code: 'BANK-01' } },
    update: {},
    create: { id: 'demo-acc-bank', companyId: company.id, name: 'HDFC Current Account', code: 'BANK-01', type: 'ASSET' }
  });
  const arAcc = await prisma.account.upsert({
    where: { companyId_code: { companyId: company.id, code: 'AR-01' } },
    update: {},
    create: { id: 'demo-acc-ar', companyId: company.id, name: 'Accounts Receivable', code: 'AR-01', type: 'ASSET' }
  });

  // 25 Loads (Indian Corridors)
  const createdLoads = [];
  const statuses = ['PENDING', 'PLANNED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
  const routes = [
    { o: 'Mumbai, MH', d: 'Delhi, DL' },
    { o: 'Pune, MH', d: 'Nagpur, MH' },
    { o: 'Ahmedabad, GJ', d: 'Surat, GJ' },
    { o: 'Delhi, DL', d: 'Jaipur, RJ' },
    { o: 'Bengaluru, KA', d: 'Chennai, TN' }
  ];
  for (let i=0; i<25; i++) {
    const route = routes[i % 5];
    const [oCity, oState] = route.o.split(', ');
    const [dCity, dState] = route.d.split(', ');
    const rate = 15000 + (i * 4000); // 15k to 1.1L
    
    const l = await prisma.load.upsert({
      where: { id: `demo-load-${i}` },
      update: {
        originCity: oCity,
        originState: oState,
        destinationCity: dCity,
        destinationState: dState,
        rate: rate,
      },
      create: {
        id: `demo-load-${i}`,
        companyId: company.id,
        customerId: createdCustomers[i % 8].id,
        referenceNumber: `LD-2026-${1000 + i}`,
        originAddress: 'MIDC Industrial Area',
        originCity: oCity,
        originState: oState,
        destinationAddress: 'Transport Nagar',
        destinationCity: dCity,
        destinationState: dState,
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000 * 3),
        rate: rate,
        weight: 15000 + (i * 100),
        status: statuses[i % 5]
      }
    });
    createdLoads.push(l);
  }

  // 15 Trips
  const createdTrips = [];
  const tripStatuses = ['PLANNED', 'DISPATCHED', 'IN_TRANSIT', 'COMPLETED'];
  for (let i=0; i<15; i++) {
    const t = await prisma.trip.upsert({
      where: { tripNumber: `TRP-2026-${1000 + i}` },
      update: {},
      create: {
        id: `demo-trip-${i}`,
        companyId: company.id,
        tripNumber: `TRP-2026-${1000 + i}`,
        driverId: createdDrivers[i % 8].id,
        vehicleId: createdVehicles[i % 15].id,
        status: tripStatuses[i % 4],
        startDate: new Date(),
      }
    });
    createdTrips.push(t);

    // Link trip to load
    await prisma.load.update({
      where: { id: createdLoads[i].id },
      data: { tripId: t.id }
    });
  }

  // Sequence for LR
  const year = '25-26';
  await prisma.lrSequence.upsert({
    where: { companyId_financialYear: { companyId: company.id, financialYear: year } },
    update: {},
    create: {
      companyId: company.id,
      financialYear: year,
      lastNumber: 25
    }
  });

  // Lorry Receipts for first 20 loads
  for (let i=0; i<20; i++) {
    const load = createdLoads[i];
    const lrNumber = `PL/${year}/${String(i+1).padStart(5,'0')}`;
    const cust = createdCustomers[i % 8];

    await prisma.lorryReceipt.upsert({
      where: { companyId_lrNumber: { companyId: company.id, lrNumber } },
      update: {},
      create: {
        id: `demo-lr-${i}`,
        companyId: company.id,
        loadId: load.id,
        lrNumber,
        consignorName: cust.name,
        consignorGstin: cust.taxId,
        consigneeName: 'Reliance Retail',
        consigneeGstin: '27AAAAA0009A1Z5',
        fromStation: load.originCity,
        toStation: load.destinationCity,
        vehicleId: createdVehicles[i % 15].id,
        vehicleNumber: createdVehicles[i % 15].licensePlate,
        goodsDescription: 'FMCG Goods',
        packagesCount: 150,
        packingType: 'Cartons',
        actualWeightKg: load.weight,
        chargedWeightKg: load.weight,
        freightAmount: load.rate,
        hamaliCharges: 0,
        otherCharges: 0,
        gstAmount: 0,
        totalAmount: load.rate,
        paymentType: 'TOPAY',
        status: load.status === 'DELIVERED' ? 'DELIVERED' : 'ISSUED'
      }
    });
  }

  // 20 Invoices
  const invStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'PAID']; // skew towards paid
  for (let i=0; i<20; i++) {
    const load = createdLoads[i];
    const invDate = new Date();
    const st = invStatuses[i % 5];
    if (st === 'OVERDUE') invDate.setDate(invDate.getDate() - 30);
    
    const inv = await prisma.invoice.upsert({
      where: { companyId_invoiceNumber: { companyId: company.id, invoiceNumber: `INV-2026-${1000 + i}` } },
      update: { amount: load.rate, balanceDue: st === 'PAID' ? 0 : load.rate, status: st },
      create: {
        id: `demo-inv-${i}`,
        companyId: company.id,
        customerId: load.customerId,
        loadId: load.id,
        invoiceNumber: `INV-2026-${1000 + i}`,
        amount: load.rate,
        balanceDue: st === 'PAID' ? 0 : load.rate,
        amountPaid: st === 'PAID' ? load.rate : 0,
        status: st,
        dueDate: invDate
      }
    });

    if (st === 'PAID') {
      const p = await prisma.payment.upsert({
        where: { id: `demo-pay-${i}` },
        update: { amount: load.rate },
        create: {
          id: `demo-pay-${i}`,
          companyId: company.id,
          invoiceId: inv.id,
          amount: load.rate,
          method: 'NEFT',
          paymentDate: new Date(),
          referenceNumber: `UTR-${100000+i}`
        }
      });

      // Journal Entry
      const je = await prisma.journalEntry.upsert({
        where: { id: `demo-je-${i}` },
        update: {},
        create: {
          id: `demo-je-${i}`,
          companyId: company.id,
          referenceType: 'PAYMENT',
          referenceId: p.id,
          description: `Payment received for ${inv.invoiceNumber}`,
          status: 'POSTED'
        }
      });

      await prisma.journalLine.upsert({
        where: { id: `demo-jl-dr-${i}` },
        update: { debit: load.rate },
        create: {
          id: `demo-jl-dr-${i}`,
          companyId: company.id,
          entryId: je.id,
          accountId: bankAcc.id,
          debit: load.rate,
          credit: 0
        }
      });

      await prisma.journalLine.upsert({
        where: { id: `demo-jl-cr-${i}` },
        update: { credit: load.rate },
        create: {
          id: `demo-jl-cr-${i}`,
          companyId: company.id,
          entryId: je.id,
          accountId: arAcc.id,
          debit: 0,
          credit: load.rate
        }
      });
    }
  }

  // VehicleLocation history (Mumbai, Pune approx)
  const baseLat = 19.0760; // Mumbai
  const baseLng = 72.8777;
  for (let v=0; v<3; v++) {
    for (let p=0; p<10; p++) {
      const locId = `demo-loc-${v}-${p}`;
      const ts = new Date(Date.now() - (10 - p) * 60000);
      await prisma.vehicleLocation.upsert({
        where: { id_gpsTimestamp: { id: locId, gpsTimestamp: ts } },
        update: {
          latitude: baseLat + (v * 0.1) + (p * 0.01),
          longitude: baseLng + (v * 0.1) + (p * 0.01),
          gpsTimestamp: ts
        },
        create: {
          id: locId,
          companyId: company.id,
          vehicleId: createdVehicles[v].id,
          provider: 'DEMO',
          providerVehicleId: `EXT-${createdVehicles[v].id}`,
          latitude: baseLat + (v * 0.1) + (p * 0.01),
          longitude: baseLng + (v * 0.1) + (p * 0.01),
          speed: 45,
          heading: 90,
          gpsTimestamp: ts
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
