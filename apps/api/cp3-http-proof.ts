import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

async function bootstrap() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findFirst({
      where: { status: 'ACTIVE' },
      include: { company: true, role: true }
    });

    if (!user) throw new Error('No user seeded in the DB');
    console.log(`Using user:`, user.email);

    // Seed anomaly
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
      
      const trip = await tx.trip.findFirst({ where: { companyId: user.companyId } });
      const vehicle = await tx.vehicle.findFirst({ where: { companyId: user.companyId } });
      const driver = await tx.driver.findFirst({ where: { companyId: user.companyId } });

      if (!trip || !vehicle || !driver) throw new Error('No trip, vehicle or driver found to seed anomaly');

      await tx.fuelEntry.create({
        data: {
          tripId: trip.id,
          vehicleId: vehicle.id,
          companyId: user.companyId,
          driverId: driver.id,
          litres: 200,
          amount: 200,
          variancePct: 35, // > 25 triggers anomaly
          filledAt: new Date()
        }
      });
      console.log('Seeded high variance fuel entry');
    });

    require('dotenv').config({ path: '.env' });
    let privateKey = process.env.JWT_PRIVATE_KEY || '';
    if (!privateKey?.includes('BEGIN PRIVATE KEY')) {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
    }
    const token = jwt.sign({ sub: user.id, cid: user.companyId, rid: user.roleId }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });

    const res = await fetch('http://localhost:8080/api/v1/intelligence/fuel/anomalies', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const json = await res.json();
    console.log('HTTP Response for Tenant:\n', JSON.stringify(json, null, 2));

  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
