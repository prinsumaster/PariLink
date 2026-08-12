import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Client Demo Data...');

  await prisma.$transaction(async (tx) => {
    // Bypass RLS for the seed script
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;

    // 1. Create a Primary Company
    const primaryCompany = await tx.company.create({
      data: {
        name: 'PariLink Demo Logistics',
        taxId: 'US-987654321',
        address: '1000 Transport Way',
        city: 'Atlanta',
        state: 'GA',
        country: 'USA',
        postalCode: '30301',
        email: 'billing@parilink.com',
        phone: '+1-800-555-0199',
        website: 'www.parilink.com',
        tenantConfiguration: {
          create: {
            onboardingCompleted: true,
            timezone: 'UTC',
            currency: 'USD'
          }
        },
        status: 'ACTIVE',
      },
    });

    // 2. Create a Role
    const adminRole = await tx.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'Full system access',
        permissions: ['*'],
        companyId: primaryCompany.id,
      }
    });

    // 3. Create the Admin User
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await tx.user.create({
      data: {
        email: 'admin@parilink.com',
        password: hashedPassword,
        firstName: 'Demo',
        lastName: 'Administrator',
        roleId: adminRole.id,
        companyId: primaryCompany.id,
      },
    });

    console.log('✅ Created Core Org & Admin');

    // 4. Create Customers
    const customer1 = await tx.customer.create({
      data: { name: 'Acme Global Logistics', companyId: primaryCompany.id, email: 'billing@acmeglobal.com', phone: '+1234567890', status: 'ACTIVE' },
    });
    const customer2 = await tx.customer.create({
      data: { name: 'TechTrans Supply', companyId: primaryCompany.id, email: 'ap@techtrans.net', phone: '+1987654321', status: 'ACTIVE' },
    });
    const customer3 = await tx.customer.create({
      data: { name: 'Fresh Foods Dist', companyId: primaryCompany.id, email: 'finance@freshfoods.org', phone: '+1122334455', status: 'ACTIVE' },
    });
    console.log('✅ Created Customers');

    // 5. Create Drivers
    const driver1 = await tx.driver.create({
      data: { firstName: 'Sarah', lastName: 'Connor', licenseNumber: 'DL-987111', status: 'ON_TRIP', companyId: primaryCompany.id }
    });
    const driver2 = await tx.driver.create({
      data: { firstName: 'Michael', lastName: 'Chang', licenseNumber: 'DL-555222', status: 'AVAILABLE', companyId: primaryCompany.id }
    });
    const driver3 = await tx.driver.create({
      data: { firstName: 'David', lastName: 'Miller', licenseNumber: 'DL-444333', status: 'ON_REST', companyId: primaryCompany.id }
    });
    console.log('✅ Created Drivers');

    // 6. Create Vehicles
    const vehicle1 = await tx.vehicle.create({
      data: { make: 'Volvo', model: 'VNL', year: 2023, vin: '1ZV900000000001', licensePlate: 'TX-12345', status: 'IN_SERVICE', type: 'TRUCK', companyId: primaryCompany.id }
    });
    const vehicle2 = await tx.vehicle.create({
      data: { make: 'Freightliner', model: 'Cascadia', year: 2022, vin: '1ZV900000000002', licensePlate: 'CA-99887', status: 'AVAILABLE', type: 'TRUCK', companyId: primaryCompany.id }
    });
    const vehicle3 = await tx.vehicle.create({
      data: { make: 'Ford', model: 'Transit', year: 2024, vin: '1ZV900000000003', licensePlate: 'NY-44556', status: 'MAINTENANCE', type: 'VAN', companyId: primaryCompany.id }
    });
    console.log('✅ Created Vehicles');

    // 7. Create Trips & Loads
    const trip1 = await tx.trip.create({
      data: {
        tripNumber: 'TRP-1001',
        status: 'IN_TRANSIT',
        driverId: driver1.id,
        vehicleId: vehicle1.id,
        companyId: primaryCompany.id,
        startDate: new Date(),
      }
    });
    const load1 = await tx.load.create({
      data: {
        referenceNumber: 'LOD-1001',
        tripId: trip1.id,
        customerId: customer1.id,
        companyId: primaryCompany.id,
        originAddress: '100 Main St', originCity: 'Dallas', originState: 'TX',
        destinationAddress: '200 Oak St', destinationCity: 'Austin', destinationState: 'TX',
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000),
        rate: 850.50,
        status: 'IN_TRANSIT'
      }
    });

    const trip2 = await tx.trip.create({
      data: {
        tripNumber: 'TRP-1002',
        status: 'COMPLETED',
        driverId: driver2.id,
        vehicleId: vehicle2.id,
        companyId: primaryCompany.id,
        startDate: new Date(Date.now() - 172800000),
        endDate: new Date(Date.now() - 86400000),
      }
    });
    const load2 = await tx.load.create({
      data: {
        referenceNumber: 'LOD-1002',
        tripId: trip2.id,
        customerId: customer2.id,
        companyId: primaryCompany.id,
        originAddress: '300 Pine St', originCity: 'Chicago', originState: 'IL',
        destinationAddress: '400 Elm St', destinationCity: 'Detroit', destinationState: 'MI',
        pickupDate: new Date(Date.now() - 172800000),
        deliveryDate: new Date(Date.now() - 86400000),
        rate: 1250.00,
        status: 'DELIVERED'
      }
    });
    console.log('✅ Created Trips & Loads');

    // 8. Create Invoices
    await tx.invoice.create({
      data: {
        invoiceNumber: 'INV-1002',
        amount: 1250.00,
        status: 'ISSUED',
        dueDate: new Date(Date.now() + 15 * 86400000),
        loadId: load2.id,
        customerId: customer2.id,
        companyId: primaryCompany.id,
      }
    });

    await tx.invoice.create({
      data: {
        invoiceNumber: 'INV-1001',
        amount: 850.50,
        status: 'PAID',
        dueDate: new Date(Date.now() - 5 * 86400000),
        loadId: load1.id,
        customerId: customer1.id,
        companyId: primaryCompany.id,
      }
    });
    console.log('✅ Created Invoices');
  });

  console.log('🌱 Demo Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
