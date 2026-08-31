import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const BASE = 'http://localhost:8080/api/v1';

async function main() {
  console.log("=== A. TENANT ISOLATION ===\n");

  const adminA = await prisma.user.findFirst({ where: { email: 'admin@parilink.com' } });
  if (!adminA) throw new Error("Admin A not found");

  // 1. SEED TENANT B & DATA
  let tenantB = await prisma.company.findFirst({ where: { name: 'Tenant B Logistics' } });
  if (!tenantB) {
    tenantB = await prisma.company.create({ data: { name: 'Tenant B Logistics', plan: 'ENTERPRISE' } });
  }

  const emailB = 'adminB@parilink.in';
  let adminB = await prisma.user.findFirst({ where: { email: emailB } });
  if (!adminB) {
    adminB = await prisma.user.create({
      data: {
        email: emailB,
        passwordHash: adminA.passwordHash,
        name: 'Admin B',
        role: 'ADMIN',
        companyId: tenantB.id
      }
    });
  }

  // Seed Driver B
  let driverB = await prisma.driver.findFirst({ where: { companyId: tenantB.id } });
  if (!driverB) {
    driverB = await prisma.driver.create({
      data: {
        name: 'Driver B',
        phone: '+919999999999',
        licenseNumber: 'B-LIC-1234',
        companyId: tenantB.id,
        status: 'AVAILABLE'
      }
    });
  }

  // Seed Vehicle B
  let vehicleB = await prisma.vehicle.findFirst({ where: { companyId: tenantB.id } });
  if (!vehicleB) {
    vehicleB = await prisma.vehicle.create({
      data: {
        licensePlate: 'MH-04-BB-9999',
        make: 'Tata',
        model: 'Signa',
        year: 2024,
        type: 'TRUCK',
        status: 'AVAILABLE',
        capacityWeight: 20,
        companyId: tenantB.id
      }
    });
  }

  // Seed Trip B
  let tripB = await prisma.trip.findFirst({ where: { companyId: tenantB.id } });
  if (!tripB) {
    tripB = await prisma.trip.create({
      data: {
        tripNumber: 'TRP-B-1001',
        origin: 'Mumbai',
        destination: 'Delhi',
        status: 'COMPLETED',
        driverId: driverB.id,
        vehicleId: vehicleB.id,
        companyId: tenantB.id,
        revenue: 50000
      }
    });
  }

  // Seed Fuel Entry B
  let fuelB = await prisma.fuelEntry.findFirst({ where: { companyId: tenantB.id } });
  if (!fuelB) {
    fuelB = await prisma.fuelEntry.create({
      data: {
        amount: 5000,
        liters: 50,
        pricePerLiter: 100,
        odometer: 1000,
        date: new Date(),
        vehicleId: vehicleB.id,
        tripId: tripB.id,
        driverId: driverB.id,
        companyId: tenantB.id,
      }
    });
  }

  // Seed Maintenance Job B
  let jobB = await prisma.maintenanceJob.findFirst({ where: { companyId: tenantB.id } });
  if (!jobB) {
    jobB = await prisma.maintenanceJob.create({
      data: {
        type: 'PREVENTIVE',
        status: 'COMPLETED',
        startDate: new Date(),
        endDate: new Date(),
        labourCost: 1000,
        vehicleId: vehicleB.id,
        companyId: tenantB.id
      }
    });
  }

  // Seed Tyre B
  let tyreB = await prisma.tyre.findFirst({ where: { companyId: tenantB.id } });
  if (!tyreB) {
    tyreB = await prisma.tyre.create({
      data: {
        brand: 'MRF',
        serialNumber: 'SN-BB-1111',
        status: 'ACTIVE',
        position: 'FL',
        vehicleId: vehicleB.id,
        companyId: tenantB.id
      }
    });
  }

  // Seed Lorry Receipt B
  let lrB = await prisma.lorryReceipt.findFirst({ where: { companyId: tenantB.id } });
  if (!lrB) {
    lrB = await prisma.lorryReceipt.create({
      data: {
        lrNumber: 'LR-B-1001',
        date: new Date(),
        consignorName: 'Test Consignor',
        consigneeName: 'Test Consignee',
        origin: 'Mumbai',
        destination: 'Delhi',
        weight: 15,
        rate: 1000,
        freightAmount: 15000,
        advanceAmount: 5000,
        balanceAmount: 10000,
        tripId: tripB.id,
        vehicleId: vehicleB.id,
        driverId: driverB.id,
        companyId: tenantB.id
      }
    });
  }

  // Seed Fuel Anomaly B
  let anomalyB = await prisma.fuelAnomaly.findFirst({ where: { companyId: tenantB.id } });
  if (!anomalyB) {
    anomalyB = await prisma.fuelAnomaly.create({
      data: {
        entityId: tripB.id,
        entityType: 'TRIP',
        entityName: 'Trip TRP-B-1001',
        expectedFuel: 40,
        actualFuel: 50,
        variancePct: 25,
        cause: 'INVESTIGATE',
        description: 'Testing anomaly',
        companyId: tenantB.id
      }
    });
  }

  // 2. AUTHENTICATE
  const loginA = await axios.post(`${BASE}/auth/login`, { email: 'admin@parilink.com', password: 'password123' });
  const tokA = loginA.data.access_token;

  const loginB = await axios.post(`${BASE}/auth/login`, { email: 'adminB@parilink.in', password: 'password123' });
  const tokB = loginB.data.access_token;

  const H_A = { headers: { Authorization: `Bearer ${tokA}` } };
  const H_B = { headers: { Authorization: `Bearer ${tokB}` } };

  const tests = [
    { name: '/profitability/vehicles/:id', path: `/profitability/vehicles/${vehicleB.id}` },
    { name: '/trips/:id/desks', path: `/trips/${tripB.id}/desks` },
    { name: '/trips/:id/fuel', path: `/trips/${tripB.id}/fuel` },
    { name: '/vehicles/:id/jobs', path: `/vehicles/${vehicleB.id}/jobs` },
    { name: '/vehicles/:id/tyres', path: `/vehicles/${vehicleB.id}/tyres` },
    { name: '/drivers/:id/score', path: `/drivers/${driverB.id}/score` },
    { name: '/bilty/:id/pdf', path: `/lorry-receipts/${lrB.id}/pdf` }, // the endpoint is /lorry-receipts/:id/pdf
    // wait, anomaly engine is /intelligence/fuel/anomalies (list only). The prompt says: /intelligence/fuel/anomalies. 
    // We should test if A sees B's anomalies.
  ];

  console.log("Endpoint | Tenant A (Intruder) | Tenant B (Owner)");
  console.log("--------------------------------------------------");

  for (const t of tests) {
    let statusA = 0, statusB = 0;
    try {
      const rA = await axios.get(`${BASE}${t.path}`, H_A);
      statusA = rA.status;
    } catch(e: any) { statusA = e.response?.status || 500; }

    try {
      const rB = await axios.get(`${BASE}${t.path}`, H_B);
      statusB = rB.status;
    } catch(e: any) { statusB = e.response?.status || 500; }

    console.log(`${t.name.padEnd(30)} | A -> ${statusA} | B -> ${statusB}`);
  }

  // Test /intelligence/fuel/anomalies
  let a_status = 0, a_len = 0;
  try {
    const rA = await axios.get(`${BASE}/intelligence/fuel/anomalies`, H_A);
    a_status = rA.status;
    const items = Array.isArray(rA.data) ? rA.data : (rA.data.data || []);
    const foundB = items.some((i: any) => i.companyId === tenantB?.id);
    a_len = foundB ? -1 : 0; // -1 means leaked
  } catch(e: any) { a_status = e.response?.status || 500; }

  let b_status = 0, b_len = 0;
  try {
    const rB = await axios.get(`${BASE}/intelligence/fuel/anomalies`, H_B);
    b_status = rB.status;
    const items = Array.isArray(rB.data) ? rB.data : (rB.data.data || []);
    b_len = items.length;
  } catch(e: any) { b_status = e.response?.status || 500; }

  const a_result = a_status === 200 && a_len === -1 ? 'LEAKED(200)' : a_status.toString();
  console.log(`/intelligence/fuel/anomalies   | A -> ${a_result} | B -> ${b_status} (count=${b_len})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
