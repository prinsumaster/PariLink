import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

async function bootstrap() {
  const prisma = new PrismaClient();
  try {
    const companyA = '18f24eb8-0d1a-4ed1-8c96-3e3980e4ca5c';
    const companyB = '01041308-a695-45ac-bc25-7a6c23030f45';

    require('dotenv').config({ path: '.env' });
    let privateKey = process.env.JWT_PRIVATE_KEY || '';
    if (!privateKey?.includes('BEGIN PRIVATE KEY')) {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
    }

    async function runFor(tenantId: string, name: string) {
      // get user
      const user = await prisma.user.findFirst({ where: { companyId: tenantId } });
      if (!user) throw new Error(`No user for ${name}`);

      const token = jwt.sign({ sub: user.id, cid: user.companyId, rid: user.roleId }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
      
      const trip = await prisma.trip.findFirst({ where: { companyId: tenantId } });
      const vehicle = await prisma.vehicle.findFirst({ where: { companyId: tenantId } });
      const driver = await prisma.driver.findFirst({ where: { companyId: tenantId } });

      if (trip && vehicle && driver) {
        await prisma.fuelEntry.create({
          data: {
            tripId: trip.id,
            vehicleId: vehicle.id,
            driverId: driver.id,
            companyId: tenantId,
            litres: 200,
            amount: 200,
            variancePct: 35,
            filledAt: new Date()
          }
        });
      }

      const res = await fetch('http://localhost:8080/api/v1/intelligence/fuel/anomalies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      console.log(`\n=== ANOMALIES FOR ${name} ===`);
      console.log(JSON.stringify(json, null, 2));

      // print their true fuel entries count using runAsSystem
      const raw = await prisma.fuelEntry.findMany({ where: { companyId: tenantId } });
      console.log(`True FuelEntry IDs for ${name}:`, raw.map(r => r.id));
    }

    await runFor(companyA, 'Tenant A');
    await runFor(companyB, 'Tenant B');
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
