import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  datasourceUrl: process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL
});

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  
  // Create Company A
  const compA = await prisma.company.create({
    data: {
      name: 'Company A',
      email: 'admin_a@parilink.com',
      roles: {
        create: {
          name: 'SUPER_ADMIN',
          description: 'Full system access',
          permissions: ['*'],
        }
      }
    }
  });

  const roleA = await prisma.role.findFirst({ where: { companyId: compA.id } });
  
  await prisma.user.create({
    data: {
      email: 'admin_a@parilink.com',
      password: hash,
      firstName: 'Admin',
      lastName: 'A',
      companyId: compA.id,
      roleId: roleA?.id,
      status: 'ACTIVE'
    }
  });

  // Create Company B
  const compB = await prisma.company.create({
    data: {
      name: 'Company B',
      email: 'admin_b@parilink.com',
      roles: {
        create: {
          name: 'SUPER_ADMIN',
          description: 'Full system access',
          permissions: ['*'],
        }
      }
    }
  });

  const roleB = await prisma.role.findFirst({ where: { companyId: compB.id } });

  await prisma.user.create({
    data: {
      email: 'admin_b@parilink.com',
      password: hash,
      firstName: 'Admin',
      lastName: 'B',
      companyId: compB.id,
      roleId: roleB?.id,
      status: 'ACTIVE'
    }
  });

  // Create 1 of each entity for B
  const bCustomer = await prisma.customer.create({
    data: { name: 'B Cust', email: 'b@cust.com', companyId: compB.id, status: 'ACTIVE' }
  });
  const bVehicle = await prisma.vehicle.create({
    data: { make: 'B Veh', model: 'Truck', year: 2024, vin: 'VIN123B', licensePlate: 'B-123', status: 'AVAILABLE', type: 'TRUCK', companyId: compB.id }
  });
  const bDriver = await prisma.driver.create({
    data: { firstName: 'B', lastName: 'Driver', status: 'ACTIVE', companyId: compB.id }
  });
  await prisma.trip.create({
    data: { tripNumber: 'TRIP-B-1', vehicleId: bVehicle.id, driverId: bDriver.id, status: 'PLANNED', companyId: compB.id }
  });
  const bLoad = await prisma.load.create({
    data: { 
      referenceNumber: 'LOAD-B-1', customerId: bCustomer.id, 
      originAddress: '1 A St', originCity: 'A', originState: 'AA', 
      destinationAddress: '2 B St', destinationCity: 'B', destinationState: 'BB',
      pickupDate: new Date(), deliveryDate: new Date(), rate: 100,
      status: 'PENDING', companyId: compB.id 
    }
  });
  const bInvoice = await prisma.invoice.create({
    data: { invoiceNumber: 'INV-B-1', customerId: bCustomer.id, amount: 100, status: 'DRAFT', companyId: compB.id }
  });
  await prisma.payment.create({
    data: { invoiceId: bInvoice.id, amount: 100, method: 'CASH', paymentDate: new Date(), companyId: compB.id }
  });
  await prisma.document.create({
    data: { type: 'BOL', fileName: 'b.pdf', fileUrl: 'http://example.com/b', entityType: 'LOAD', entityId: bLoad.id, companyId: compB.id }
  });

  console.log('Seeded A & B');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
