import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

async function bootstrap() {
  const prisma = new PrismaClient();
  try {
    const companyA = '18f24eb8-0d1a-4ed1-8c96-3e3980e4ca5c';
    require('dotenv').config({ path: '.env' });
    let privateKey = process.env.JWT_PRIVATE_KEY || '';
    if (!privateKey?.includes('BEGIN PRIVATE KEY')) {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
    }

    const user = await prisma.user.findFirst({ where: { companyId: companyA } });
    if (!user) throw new Error('No user for Tenant A');

    const token = jwt.sign({ sub: user.id, cid: user.companyId, rid: user.roleId }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });

    const payloads = [
      `SELECT * FROM "User" WHERE '{{COMPANY_ID_PLACEHOLDER}}'='{{COMPANY_ID_PLACEHOLDER}}'`,
      `SELECT * FROM "Trip" WHERE 1=1 -- {{COMPANY_ID_PLACEHOLDER}}`,
      `SELECT * FROM "Trip" UNION SELECT * FROM "User" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'`,
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config('app.bypass_rls','on',true)='on' OR 1=1`,
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_catalog.set_config('app.bypass_rls','on',true)='on'`,
      `SELECT count(*) FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}'` // The legitimate one
    ];

    for (let i = 0; i < payloads.length; i++) {
      const intent = payloads[i];
      console.log(`\n=== PAYLOAD ${i + 1} ===\n${intent}`);
      
      const res = await fetch('http://localhost:8080/api/v1/ai/interact', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, domain: 'test', id: '123' })
      });
      const json = await res.json();
      console.log(JSON.stringify(json, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
