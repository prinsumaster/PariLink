import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const unknownCompany = await prisma.company.upsert({
    where: { id: 'UNKNOWN_COMPANY' },
    update: {},
    create: { id: 'UNKNOWN_COMPANY', name: 'Unknown Company' }
  });

  await prisma.vehicle.upsert({
    where: { id: 'V1' },
    update: {},
    create: { id: 'V1', companyId: unknownCompany.id, make: 'Test', model: 'Test', licensePlate: 'TEST', status: 'ACTIVE' }
  });

  const company = await prisma.company.upsert({
    where: { id: 'SYSTEM' },
    update: {},
    create: { id: 'SYSTEM', name: 'System Company' }
  });

  const apiKeyStr = 'test_iot_api_key_' + Date.now();
  const keyHash = crypto.createHash('sha256').update(apiKeyStr).digest('hex');
  await prisma.apiKey.create({
    data: {
      name: 'IoT Test Key',
      keyHash,
      companyId: company.id,
      scopes: []
    }
  });

  const secretStr = 'iot_super_secret_' + Date.now();
  await prisma.integrationConfig.deleteMany({
    where: { companyId: 'SYSTEM', provider: 'IOT_PROVIDER' }
  });
  await prisma.integrationConfig.create({
    data: {
      companyId: 'SYSTEM',
      provider: 'IOT_PROVIDER',
      credentials: { WEBHOOK_SECRET: secretStr },
      settings: {},
      isActive: true
    }
  });

  const payload = { vehicleId: 'V1', latitude: 12.3, longitude: 45.6 };
  const payloadStr = JSON.stringify(payload);
  const validSig = crypto.createHmac('sha256', secretStr).update(Buffer.from(payloadStr)).digest('hex');

  let res = await fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr },
    body: payloadStr
  });
  console.log('Missing Signature Status:', res.status);

  res = await fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr, 'x-provider-signature': 'invalid_signature_123' },
    body: payloadStr
  });
  console.log('Invalid Signature Status:', res.status);

  res = await fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr, 'x-provider-signature': validSig },
    body: payloadStr
  });
  console.log('Valid Signature Status:', res.status);
  console.log('Valid Signature Body:', await res.text());

  await prisma.$disconnect();
})();
