import * as bcrypt from 'bcrypt';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const company = await prisma.runAsSystem('ui-seed', tx =>
    tx.company.create({ data: { name: 'Fuel Demo Co', status: 'ACTIVE' } }),
  );
  const cid = company.id;

  await prisma.runAsSystem('ui-seed', async tx => {
    const role = await tx.role.create({
      data: { companyId: cid, name: 'OPS', permissions: ['*'] },
    });
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    const email = `fuelui_${Date.now()}@parilink.test`;
    const adminUser = await tx.user.create({
      data: {
        companyId: cid, roleId: role.id, email: email,
        firstName: 'Fuel', lastName: 'Admin',
        password: hashedPassword, 
        status: 'ACTIVE',
      },
    });


    const idStr = Date.now().toString().slice(-6);
    const v1 = await tx.vehicle.create({ data: { companyId: cid, licensePlate: `TRK-001-${idStr}`, type: 'TRUCK', status: 'IN_SERVICE' } });
    const v2 = await tx.vehicle.create({ data: { companyId: cid, licensePlate: `TRK-002-${idStr}`, type: 'TRUCK', status: 'IN_SERVICE' } });
    const v3 = await tx.vehicle.create({ data: { companyId: cid, licensePlate: `TRK-003-${idStr}`, type: 'TRUCK', status: 'IN_SERVICE' } });

    const dUserA = await tx.user.create({ data: { companyId: cid, roleId: adminUser!.roleId, email: `a_${idStr}@parilink.test`, firstName: 'Amit', lastName: 'Shah', password: 'x', status: 'ACTIVE' } });
    const dUserB = await tx.user.create({ data: { companyId: cid, roleId: adminUser!.roleId, email: `b_${idStr}@parilink.test`, firstName: 'Ravi', lastName: 'Kumar', password: 'x', status: 'ACTIVE' } });

    const d1 = await tx.driver.create({ data: { companyId: cid, userId: dUserA.id, firstName: 'Amit', lastName: 'Shah', phone: `900${idStr}1`, status: 'ACTIVE', licenseNumber: `MH01A${idStr}1` } });
    const d2 = await tx.driver.create({ data: { companyId: cid, userId: dUserB.id, firstName: 'Ravi', lastName: 'Kumar', phone: `900${idStr}2`, status: 'ACTIVE', licenseNumber: `MH01A${idStr}2` } });

    // DRIVER isolation: TRK-001, Mumbai→Nagpur, Driver A=200L (-20%), Driver B=330L (+32%)
    const tA = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-A-${idStr}`, vehicleId: v1.id, driverId: d1.id, status: 'COMPLETED', estimatedDistance: 1000, actualDistance: 1000 } });
    const tB = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-B-${idStr}`, vehicleId: v1.id, driverId: d2.id, status: 'COMPLETED', estimatedDistance: 1000, actualDistance: 1000 } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tA.id, vehicleId: v1.id, driverId: d1.id, litres: 200, amount: 16000, expectedLitres: 250, variancePct: -20, originCity: 'Mumbai', destinationCity: 'Nagpur' } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tB.id, vehicleId: v1.id, driverId: d2.id, litres: 330, amount: 26400, expectedLitres: 250, variancePct: 32, originCity: 'Mumbai', destinationCity: 'Nagpur' } });

    // MECHANICAL isolation: Driver A, Mumbai→Pune, TRK-002=210L (+68%), TRK-003=130L (+4%)
    const tC = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-C-${idStr}`, vehicleId: v2.id, driverId: d1.id, status: 'COMPLETED', estimatedDistance: 500, actualDistance: 500 } });
    const tD = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-D-${idStr}`, vehicleId: v3.id, driverId: d1.id, status: 'COMPLETED', estimatedDistance: 500, actualDistance: 500 } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tC.id, vehicleId: v2.id, driverId: d1.id, litres: 210, amount: 16800, expectedLitres: 125, variancePct: 68, originCity: 'Mumbai', destinationCity: 'Pune' } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tD.id, vehicleId: v3.id, driverId: d1.id, litres: 130, amount: 10400, expectedLitres: 125, variancePct: 4, originCity: 'Mumbai', destinationCity: 'Pune' } });

    // ROUTE isolation: Driver B + TRK-003, Mumbai→Surat=78L (+4%), Mumbai→Indore=350L (+40%)
    const tE = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-E-${idStr}`, vehicleId: v3.id, driverId: d2.id, status: 'COMPLETED', estimatedDistance: 300, actualDistance: 300 } });
    const tF = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-F-${idStr}`, vehicleId: v3.id, driverId: d2.id, status: 'COMPLETED', estimatedDistance: 1000, actualDistance: 1000 } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tE.id, vehicleId: v3.id, driverId: d2.id, litres: 78, amount: 6240, expectedLitres: 75, variancePct: 4, originCity: 'Mumbai', destinationCity: 'Surat' } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tF.id, vehicleId: v3.id, driverId: d2.id, litres: 350, amount: 28000, expectedLitres: 250, variancePct: 40, originCity: 'Mumbai', destinationCity: 'Indore' } });

    // INSUFFICIENT_DATA: Driver B + TRK-002, Chennai→Bangalore=180L (+44%) -> INVESTIGATE
    const tG = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-G-${idStr}`, vehicleId: v2.id, driverId: d2.id, status: 'COMPLETED', estimatedDistance: 500, actualDistance: 500 } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tG.id, vehicleId: v2.id, driverId: d2.id, litres: 180, amount: 14400, expectedLitres: 125, variancePct: 44, originCity: 'Chennai', destinationCity: 'Bangalore' } });

    // REAL INSUFFICIENT_DATA: Driver A + TRK-001, Delhi→Jaipur=102L (+2%) -> INSUFFICIENT_DATA
    const tH = await tx.trip.create({ data: { companyId: cid, tripNumber: `T-H-${idStr}`, vehicleId: v1.id, driverId: d1.id, status: 'COMPLETED', estimatedDistance: 250, actualDistance: 250 } });
    await tx.fuelEntry.create({ data: { companyId: cid, tripId: tH.id, vehicleId: v1.id, driverId: d1.id, litres: 102, amount: 8160, expectedLitres: 100, variancePct: 2, originCity: 'Delhi', destinationCity: 'Jaipur' } });

    console.log(`\n✅ Seed complete! Login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Pass:  password123`);
  });

  const { FuelIntelligenceService } = require('../../src/intelligence/fuel/fuel-intelligence.service');
  const fuelService = app.get(FuelIntelligenceService);

  // DB ISOLATION TEST: Create Tenant B
  const companyB = await prisma.runAsSystem('db-iso', tx =>
    tx.company.create({ data: { name: 'Tenant B', status: 'ACTIVE' } })
  );
  const cidB = companyB.id;
  await prisma.runAsSystem('db-iso', async tx => {
    const ts = Date.now().toString().slice(-6);
    const vB = await tx.vehicle.create({ data: { companyId: cidB, licensePlate: `TRK-TENANT-B-${ts}`, type: 'TRUCK', status: 'IN_SERVICE' } });
    const uB = await tx.user.create({ data: { companyId: cidB, email: `b_${ts}@parilink.test`, firstName: 'B', lastName: 'B', password: 'x', status: 'ACTIVE' } });
    const dB = await tx.driver.create({ data: { companyId: cidB, userId: uB.id, firstName: 'B', lastName: 'B', phone: `999${ts}`, status: 'ACTIVE', licenseNumber: `999${ts}` } });
    const tB = await tx.trip.create({ data: { companyId: cidB, tripNumber: `T-B-${ts}-iso`, vehicleId: vB.id, driverId: dB.id, status: 'COMPLETED', estimatedDistance: 100, actualDistance: 100 } });
    await tx.fuelEntry.create({ data: { companyId: cidB, tripId: tB.id, vehicleId: vB.id, driverId: dB.id, litres: 100, amount: 100, expectedLitres: 100, variancePct: 99, originCity: 'TenantB', destinationCity: 'SecretCity' } });
  });

  const resultsA = await fuelService.getRootCause(cid);
  console.log('\n=== TENANT A RESULTS ===');
  resultsA.forEach((r: any) => console.log(`${r.rootCause.padEnd(20)} | Var: ${String(r.variancePct).padEnd(4)} | Route: ${r.routeKey}`));

  const resultsB = await fuelService.getRootCause(cidB);
  console.log('\n=== TENANT B RESULTS ===');
  resultsB.forEach((r: any) => console.log(`${r.rootCause.padEnd(20)} | Var: ${String(r.variancePct).padEnd(4)} | Route: ${r.routeKey}`));

  await app.close();
  process.exit(0);
}

bootstrap().catch(e => { console.error(e); process.exit(1); });
