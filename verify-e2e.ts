import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/api/src/app.module';
import { DriversService } from './apps/api/src/drivers/drivers.service';
import { VehiclesService } from './apps/api/src/vehicles/vehicles.service';
import { TripsService } from './apps/api/src/trips/trips.service';
import { PrismaService } from './apps/api/src/prisma/prisma.service';

async function bootstrap() {
  console.log('--- STARTING E2E VERIFICATION SPRINT ---');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const driversService = app.get(DriversService);
  const vehiclesService = app.get(VehiclesService);
  const tripsService = app.get(TripsService);
  const prisma = app.get(PrismaService);
  
  const companyId = 'test-company-123';
  
  console.log('Ensuring test company exists (bypassing RLS)...');
  await prisma.runAsSystem(async (tx: any) => {
    const existingCompany = await tx.company.findUnique({ where: { id: companyId } });
    if (!existingCompany) {
      await tx.company.create({
        data: {
          id: companyId,
          name: 'Test Company',
        }
      });
    }
  });

  // Cleanup previous test data
  console.log('Cleaning up old test data...');
  await prisma.runAsSystem(async (tx: any) => {
    await tx.driver.deleteMany({ where: { companyId } });
    await tx.vehicle.deleteMany({ where: { companyId } });
    await tx.trip.deleteMany({ where: { companyId } });
    await tx.auditLog.deleteMany({ where: { companyId } });
  });

  const uniqueSuffix = Date.now().toString();

  console.log('\n==================================');
  console.log('1. DRIVER WORKFLOW VERIFICATION');
  console.log('==================================');
  try {
    const driver = await driversService.create(companyId, {
      companyId,
      firstName: 'John',
      lastName: 'Doe',
      email: `john-${uniqueSuffix}@example.com`,
      licenseNumber: `CDL-${uniqueSuffix}`,
    });
    console.log('✅ Driver Created Successfully:', driver.id);
    
    // Check audit log
    await prisma.runAsSystem(async (tx: any) => {
      const auditLog = await tx.auditLog.findFirst({
        where: { companyId, entityType: 'Driver', entityId: driver.id, action: 'CREATE' }
      });
      if (auditLog) {
        console.log('✅ Audit Log Verified:', auditLog.id);
      } else {
        console.error('❌ Audit Log Missing for Driver');
      }
    });
    
    // Duplicate test
    console.log('Testing duplicate prevention...');
    try {
      await driversService.create(companyId, {
        companyId,
        firstName: 'Jane',
        lastName: 'Doe',
        email: `john-${uniqueSuffix}@example.com`,
        licenseNumber: `CDL-OTHER-${uniqueSuffix}`,
      });
      console.error('❌ Duplicate prevention failed! Created second driver with same email.');
    } catch (e: any) {
      if (e.status === 409 || e.message?.includes('exists')) {
         console.log('✅ Duplicate Prevention Verified (Email/License Conflict caught):', e.message);
      } else {
         console.error('❌ Unexpected error on duplicate:', e);
      }
    }
  } catch (e) {
    console.error('❌ Driver creation failed:', e);
  }

  console.log('\n==================================');
  console.log('2. VEHICLE WORKFLOW VERIFICATION');
  console.log('==================================');
  try {
    const vehicle = await vehiclesService.create(companyId, {
      companyId,
      licensePlate: `PLT-${uniqueSuffix}`,
      vin: `VIN-${uniqueSuffix}`,
      make: 'Volvo',
      model: 'VNL',
    });
    console.log('✅ Vehicle Created Successfully:', vehicle.id);
    
    // Check audit log
    await prisma.runAsSystem(async (tx: any) => {
      const auditLog = await tx.auditLog.findFirst({
        where: { companyId, entityType: 'Vehicle', entityId: vehicle.id, action: 'CREATE' }
      });
      if (auditLog) {
        console.log('✅ Audit Log Verified:', auditLog.id);
      } else {
        console.error('❌ Audit Log Missing for Vehicle');
      }
    });
    
    // Duplicate test
    console.log('Testing duplicate prevention...');
    try {
      await vehiclesService.create(companyId, {
        companyId,
        licensePlate: `PLT-${uniqueSuffix}`,
        vin: `VIN-OTHER-${uniqueSuffix}`,
      });
      console.error('❌ Duplicate prevention failed! Created second vehicle with same license plate.');
    } catch (e: any) {
      if (e.status === 409 || e.message?.includes('exists')) {
         console.log('✅ Duplicate Prevention Verified (License/VIN Conflict caught):', e.message);
      } else {
         console.error('❌ Unexpected error on duplicate:', e);
      }
    }
  } catch (e) {
    console.error('❌ Vehicle creation failed:', e);
  }

  console.log('\n==================================');
  console.log('3. TRIP WORKFLOW VERIFICATION');
  console.log('==================================');
  try {
    const trip = await tripsService.create(companyId, {
      route: { origin: 'Dallas', destination: 'Houston' },
      tripNumber: `TRP-${uniqueSuffix}`,
    });
    console.log('✅ Trip Created Successfully:', trip.id);
    
    // Check audit log
    await prisma.runAsSystem(async (tx: any) => {
      const auditLog = await tx.auditLog.findFirst({
        where: { companyId, entityType: 'Trip', entityId: trip.id, action: 'CREATE' }
      });
      if (auditLog) {
        console.log('✅ Audit Log Verified:', auditLog.id);
      } else {
        console.error('❌ Audit Log Missing for Trip');
      }
    });
    
    // Duplicate test
    console.log('Testing duplicate prevention...');
    try {
      await tripsService.create(companyId, {
        route: { origin: 'Austin', destination: 'Waco' },
        tripNumber: `TRP-${uniqueSuffix}`,
      });
      console.error('❌ Duplicate prevention failed! Created second trip with same tripNumber.');
    } catch (e: any) {
      if (e.status === 409 || e.message?.includes('exists')) {
         console.log('✅ Duplicate Prevention Verified (Trip Number Conflict caught):', e.message);
      } else {
         console.error('❌ Unexpected error on duplicate:', e);
      }
    }
  } catch (e) {
    console.error('❌ Trip creation failed:', e);
  }

  await app.close();
  console.log('\n--- VERIFICATION SPRINT COMPLETE ---');
}
bootstrap();
