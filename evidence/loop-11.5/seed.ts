import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const fixtures: any = { companies: {} };
  
  // Wipe existing companies and users for clean seeding (respecting FKs)
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.load.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.company.deleteMany({});
  
  for (const name of ['Company A', 'Company B']) {
    const prefix = name === 'Company A' ? 'A' : 'B';
    const emailSuffix = name.toLowerCase().replace(' ', '');
    
    const company = await prisma.company.create({
      data: { name }
    });
    
    fixtures.companies[company.id] = { name, code: prefix, users: {}, entities: {} };
    
    const roleNames = ['ADMIN', 'DISPATCHER', 'FINANCE', 'DRIVER'];
    const roleMap: any = {};
    for (const rName of roleNames) {
      const role = await prisma.role.create({
        data: {
          name: rName,
          companyId: company.id,
          permissions: ['*']
        }
      });
      roleMap[rName] = role.id;
    }
    
    for (const role of roleNames) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          email: `${role.toLowerCase()}@${emailSuffix}.com`,
          password: passwordHash,
          firstName: role,
          lastName: prefix,
          roleId: roleMap[role],
          companyId: company.id,
          status: 'ACTIVE'
        }
      });
      fixtures.companies[company.id].users[role] = { id: user.id, email: user.email };
    }
    
    const customer = await prisma.customer.create({
      data: {
        name: `Customer ${prefix}`,
        companyId: company.id,
        email: `contact@customer${prefix}.com`,
        phone: '1234567890',
        status: 'ACTIVE',
        billingAddress: 'Address'
      }
    });
    fixtures.companies[company.id].entities.customerId = customer.id;
    
    const driverUser = await prisma.user.findFirst({ where: { companyId: company.id, roleId: roleMap['DRIVER'] } });
    
    const driver = await prisma.driver.create({
      data: {
        firstName: 'Driver',
        lastName: prefix,
        licenseNumber: `LIC-${prefix}-123`,
        userId: driverUser!.id,
        companyId: company.id,
        phone: '1234567890',
        status: 'AVAILABLE'
      }
    });
    fixtures.companies[company.id].entities.driverId = driver.id;
    
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Volvo',
        model: 'FH16',
        year: 2023,
        vin: `VIN-${prefix}-${Date.now()}`,
        licensePlate: `REG-${prefix}-123`,
        companyId: company.id,
        status: 'AVAILABLE'
      }
    });
    fixtures.companies[company.id].entities.vehicleId = vehicle.id;
    
    const load = await prisma.load.create({
      data: {
        referenceNumber: `LOD-${prefix}-001`,
        customerId: customer.id,
        companyId: company.id,
        originAddress: `Pickup ${prefix}`,
        originCity: `City ${prefix}`,
        originState: `State ${prefix}`,
        destinationAddress: `Dropoff ${prefix}`,
        destinationCity: `DestCity ${prefix}`,
        destinationState: `DestState ${prefix}`,
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000),
        rate: 1000,
        status: 'PENDING'
      }
    });
    fixtures.companies[company.id].entities.loadId = load.id;
    
    const trip = await prisma.trip.create({
      data: {
        tripNumber: `TRP-${prefix}-001`,
        driverId: driver.id,
        vehicleId: vehicle.id,
        companyId: company.id,
        status: 'PLANNED',
        startDate: new Date()
      }
    });
    fixtures.companies[company.id].entities.tripId = trip.id;
    
    await prisma.load.update({
      where: { id: load.id },
      data: { tripId: trip.id, status: 'ASSIGNED' }
    });
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${prefix}-001`,
        customerId: customer.id,
        companyId: company.id,
        amount: 1000,
        status: 'DRAFT',
        dueDate: new Date(),
        loadId: load.id
      }
    });
    fixtures.companies[company.id].entities.invoiceId = invoice.id;
    
    const payment = await prisma.payment.create({
      data: {
        referenceNumber: `PAY-${prefix}-001`,
        invoiceId: invoice.id,
        companyId: company.id,
        amount: 500,
        method: 'BANK_TRANSFER',
        paymentDate: new Date()
      }
    });
    fixtures.companies[company.id].entities.paymentId = payment.id;
    
    const doc = await prisma.document.create({
      data: {
        fileName: `Doc-${prefix}.pdf`,
        fileUrl: `${company.id}/docs/Doc-${prefix}.pdf`,
        companyId: company.id,
        type: 'INVOICE',
        mimeType: 'application/pdf'
      }
    });
    fixtures.companies[company.id].entities.documentId = doc.id;
  }
  
  const evidenceDir = path.resolve(__dirname, '../../evidence/loop-11.5');
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'fixtures.json'), JSON.stringify(fixtures, null, 2));
  console.log("Seeded successfully");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
