/**
 * STEP 2: Prove the root-cause attribution with concrete seeded data.
 *
 * Scenario:
 *   Route: Mumbai → Nagpur  (1000 km, 4.0 km/L → expectedLitres = 250)
 *   Vehicle: TRK-001 (same for DRIVER isolation test)
 *   Driver A: fills 200L  → variancePct = (200-250)/250 * 100 = -20% (under)
 *   Driver B: fills 330L  → variancePct = (330-250)/250 * 100 = +32% (DRIVER)
 *
 *   DRIVER isolation:  same vehicle (TRK-001) + route (Mumbai:Nagpur), driver B > group avg by >5pp
 *   MECHANICAL isolation: same driver (D1) + route (Mumbai:Pune), TRK-002 > TRK-003 by >5pp
 *   ROUTE isolation: same driver (D1) + vehicle (TRK-003), different routes
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FuelIntelligenceService } from '../../src/intelligence/fuel/fuel-intelligence.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const fuel = app.get(FuelIntelligenceService);

  // ── Setup: create a throwaway company (cleaned up via cascade on delete)
  const company = await prisma.runAsSystem('test seed', tx =>
    tx.company.create({ data: { name: 'FuelProof Co', status: 'ACTIVE' } }),
  );
  const cid = company.id;

  await prisma.runAsSystem('test seed', async tx => {
    const role = await tx.role.create({
      data: { companyId: cid, name: 'OPS', permissions: ['*'] },
    });
    const driverUserA = await tx.user.create({
      data: {
        companyId: cid, roleId: role.id, email: `da@${cid}.test`,
        firstName: 'Amit', lastName: 'Shah',
        password: 'x', status: 'ACTIVE',
      },
    });
    const driverUserB = await tx.user.create({
      data: {
        companyId: cid, roleId: role.id, email: `db@${cid}.test`,
        firstName: 'Ravi', lastName: 'Kumar',
        password: 'x', status: 'ACTIVE',
      },
    });

    const vehicleTRK001 = await tx.vehicle.create({
      data: { companyId: cid, licensePlate: 'TRK-001', type: 'TRUCK', status: 'IN_SERVICE' },
    });
    const vehicleTRK002 = await tx.vehicle.create({
      data: { companyId: cid, licensePlate: 'TRK-002', type: 'TRUCK', status: 'IN_SERVICE' },
    });
    const vehicleTRK003 = await tx.vehicle.create({
      data: { companyId: cid, licensePlate: 'TRK-003', type: 'TRUCK', status: 'IN_SERVICE' },
    });

    const driverA = await tx.driver.create({
      data: { companyId: cid, userId: driverUserA.id, firstName: 'Amit', lastName: 'Shah', phone: '9000000001', status: 'ACTIVE', licenseNumber: 'MH01A001' },
    });
    const driverB = await tx.driver.create({
      data: { companyId: cid, userId: driverUserB.id, firstName: 'Ravi', lastName: 'Kumar', phone: '9000000002', status: 'ACTIVE', licenseNumber: 'MH01B002' },
    });

    // ── DRIVER isolation: TRK-001, Mumbai→Nagpur, Driver A=200L, Driver B=330L (expected=250)
    const tA = await tx.trip.create({
      data: {
        companyId: cid, tripNumber: `T-A-${cid.slice(0,4)}`, vehicleId: vehicleTRK001.id,
        driverId: driverA.id, status: 'COMPLETED', estimatedDistance: 1000,
        actualDistance: 1000,
      },
    });
    const tB = await tx.trip.create({
      data: {
        companyId: cid, tripNumber: `T-B-${cid.slice(0,4)}`, vehicleId: vehicleTRK001.id,
        driverId: driverB.id, status: 'COMPLETED', estimatedDistance: 1000,
        actualDistance: 1000,
      },
    });

    // expected = 1000/4.0 = 250
    await tx.fuelEntry.create({
      data: {
        companyId: cid, tripId: tA.id, vehicleId: vehicleTRK001.id,
        driverId: driverA.id, litres: 200, amount: 16000,
        expectedLitres: 250, variancePct: ((200-250)/250)*100, // -20%
        originCity: 'Mumbai', destinationCity: 'Nagpur',
      },
    });
    await tx.fuelEntry.create({
      data: {
        companyId: cid, tripId: tB.id, vehicleId: vehicleTRK001.id,
        driverId: driverB.id, litres: 330, amount: 26400,
        expectedLitres: 250, variancePct: ((330-250)/250)*100, // +32%
        originCity: 'Mumbai', destinationCity: 'Nagpur',
      },
    });

    // ── MECHANICAL isolation: Driver A, Mumbai→Pune (500km, exp=125), TRK-002=210L, TRK-003=130L
    const tC = await tx.trip.create({
      data: {
        companyId: cid, tripNumber: `T-C-${cid.slice(0,4)}`, vehicleId: vehicleTRK002.id,
        driverId: driverA.id, status: 'COMPLETED', estimatedDistance: 500, actualDistance: 500,
      },
    });
    const tD = await tx.trip.create({
      data: {
        companyId: cid, tripNumber: `T-D-${cid.slice(0,4)}`, vehicleId: vehicleTRK003.id,
        driverId: driverA.id, status: 'COMPLETED', estimatedDistance: 500, actualDistance: 500,
      },
    });

    await tx.fuelEntry.create({
      data: {
        companyId: cid, tripId: tC.id, vehicleId: vehicleTRK002.id,
        driverId: driverA.id, litres: 210, amount: 16800,
        expectedLitres: 125, variancePct: ((210-125)/125)*100, // +68% — MECHANICAL
        originCity: 'Mumbai', destinationCity: 'Pune',
      },
    });
    await tx.fuelEntry.create({
      data: {
        companyId: cid, tripId: tD.id, vehicleId: vehicleTRK003.id,
        driverId: driverA.id, litres: 130, amount: 10400,
        expectedLitres: 125, variancePct: ((130-125)/125)*100, // +4% — normal
        originCity: 'Mumbai', destinationCity: 'Pune',
      },
    });

    // ── ROUTE isolation: Driver A, TRK-003, Mumbai→Surat(300km, exp=75, fill=78 +4%)
    //                                         Mumbai→Nagpur(1000km, exp=250, fill=380 +52%)
    const tE = await tx.trip.create({
      data: {
        companyId: cid, tripNumber: `T-E-${cid.slice(0,4)}`, vehicleId: vehicleTRK003.id,
        driverId: driverA.id, status: 'COMPLETED', estimatedDistance: 300, actualDistance: 300,
      },
    });
    await tx.fuelEntry.create({
      data: {
        companyId: cid, tripId: tE.id, vehicleId: vehicleTRK003.id,
        driverId: driverA.id, litres: 78, amount: 6240,
        expectedLitres: 75, variancePct: ((78-75)/75)*100, // +4% — normal
        originCity: 'Mumbai', destinationCity: 'Surat',
      },
    });
    // tD (TRK-003, Driver A, Mumbai→Pune) already seeded above — reuse it
    // Add a Nagpur trip for Driver A, TRK-003 to make 3 routes
    const tF = await tx.trip.create({
      data: {
        companyId: cid, tripNumber: `T-F-${cid.slice(0,4)}`, vehicleId: vehicleTRK003.id,
        driverId: driverA.id, status: 'COMPLETED', estimatedDistance: 1000, actualDistance: 1000,
      },
    });
    await tx.fuelEntry.create({
      data: {
        companyId: cid, tripId: tF.id, vehicleId: vehicleTRK003.id,
        driverId: driverA.id, litres: 380, amount: 30400,
        expectedLitres: 250, variancePct: ((380-250)/250)*100, // +52% — ROUTE
        originCity: 'Mumbai', destinationCity: 'Nagpur',
      },
    });

    console.log(`\n✅ Seed complete for company ${cid}`);
    console.log(`   TRK-001: Driver A (200L, -20%) + Driver B (330L, +32%) — DRIVER isolation`);
    console.log(`   TRK-002: Driver A, Mumbai→Pune (210L, +68%) — MECHANICAL`);
    console.log(`   TRK-003: Driver A, Mumbai→Pune (130L, +4%) — mechanical normal`);
    console.log(`   TRK-003: Driver A, Mumbai→Surat (78L, +4%) — route normal`);
    console.log(`   TRK-003: Driver A, Mumbai→Nagpur (380L, +52%) — ROUTE`);
  });

  // ── Run the root-cause engine
  console.log('\n═══════════════════════════════════════════════════');
  console.log('ROOT-CAUSE ATTRIBUTION RESULTS');
  console.log('═══════════════════════════════════════════════════');
  const results = await fuel.getRootCause(cid);
  results.forEach(r => {
    const flag = r.rootCause === 'DRIVER' ? '🔴' :
                 r.rootCause === 'MECHANICAL' ? '🟠' :
                 r.rootCause === 'ROUTE' ? '🟡' :
                 r.rootCause === 'INSUFFICIENT_DATA' ? '⚪' : '🔵';
    console.log(`\n${flag} [${r.rootCause}] ${r.driverName} | ${r.licensePlate} | route=${r.routeKey}`);
    console.log(`   litres=${r.litres} expected=${r.expectedLitres} variance=${r.variancePct?.toFixed(1)}%`);
    console.log(`   comparisonGroupSize=${r.comparisonGroupSize} confidence=${r.confidence}`);
    console.log(`   explanation: ${r.explanation}`);
  });

  // ── Summary
  const driverCases = results.filter(r => r.rootCause === 'DRIVER');
  const mechCases = results.filter(r => r.rootCause === 'MECHANICAL');
  const routeCases = results.filter(r => r.rootCause === 'ROUTE');
  const insufficient = results.filter(r => r.rootCause === 'INSUFFICIENT_DATA');
  console.log('\n═══════════════════════════════════════════════════');
  console.log(`SUMMARY: DRIVER=${driverCases.length} MECHANICAL=${mechCases.length} ROUTE=${routeCases.length} INSUFFICIENT=${insufficient.length}`);
  console.log('═══════════════════════════════════════════════════');

  // ── Cleanup
  await prisma.runAsSystem('test cleanup', tx => tx.company.delete({ where: { id: cid } }));
  console.log('\n✅ Cleanup complete');
  await app.close();
}

bootstrap().catch(e => { console.error(e); process.exit(1); });
