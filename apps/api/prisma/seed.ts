import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create a Primary Company
  const primaryCompany = await prisma.company.create({
    data: {
      name: 'PariLink Logistics LLC',
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
  const adminRole = await prisma.role.create({
    data: {
      name: 'SUPER_ADMIN',
      description: 'Full system access',
      permissions: ['*'],
      companyId: primaryCompany.id,
    }
  });

  // 3. Create the Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@parilink.com' },
    update: {},
    create: {
      email: 'admin@parilink.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      roleId: adminRole.id,
      companyId: primaryCompany.id,
    },
  });

  // 4. Create mock companies for pagination testing
  const mockCompanies = [];
  for (let i = 1; i <= 25; i++) {
    mockCompanies.push({
      name: `Mock Transport Corp ${i}`,
      taxId: `TAX-${Math.floor(Math.random() * 100000)}`,
      city: ['Dallas', 'Chicago', 'Miami', 'Seattle', 'Houston'][i % 5],
      state: ['TX', 'IL', 'FL', 'WA', 'TX'][i % 5],
      country: 'USA',
      status: i % 4 === 0 ? 'INACTIVE' : 'ACTIVE',
    });
  }

  await prisma.company.createMany({
    data: mockCompanies,
  });

  const customer = await prisma.customer.create({
    data: {
      name: 'Acme Logistics',
      companyId: primaryCompany.id,
      email: 'logistics@acme.com',
      phone: '+1234567890',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created Customer');

  const driver = await prisma.driver.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      licenseNumber: 'DL-123456',
      status: 'AVAILABLE',
      companyId: primaryCompany.id,
    }
  });
  console.log('✅ Created Driver');

  const vehicle = await prisma.vehicle.create({
    data: {
      make: 'Volvo',
      model: 'VNL',
      year: 2023,
      vin: '1ZV900000000000',
      licensePlate: 'TX-12345',
      status: 'IN_SERVICE',
      type: 'TRUCK',
      companyId: primaryCompany.id,
    }
  });
  console.log('✅ Created Vehicle');

  console.log('🌱 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
