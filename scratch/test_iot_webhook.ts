import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const company = await prisma.company.findFirst();

  const apiKeyStr = 'test_iot_api_key_' + Date.now();
  const keyHash = crypto.createHash('sha256').update(apiKeyStr).digest('hex');
  await prisma.$executeRaw`
    INSERT INTO "ApiKey" ("id", "name", "keyHash", "companyId", "scopes", "createdAt", "updatedAt")
    VALUES (${crypto.randomUUID()}, 'IoT Test Key', ${keyHash}, ${company!.id}, '[]', NOW(), NOW())
  `;

  const masterKey = process.env.MASTER_ENCRYPTION_KEY_V1;
  const iv = crypto.randomBytes(12);
  const secretStr = 'iot_super_secret_' + Date.now();
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey!, 'base64'), iv);
  let encrypted = cipher.update(secretStr, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');
  const payloadToStore = `v1:${iv.toString('base64')}:${authTag}:${encrypted}`;

  await prisma.$executeRaw`
    INSERT INTO "IntegrationSecret" ("id", "companyId", "provider", "keyName", "keyValue", "encrypted", "createdAt", "updatedAt")
    VALUES (${crypto.randomUUID()}, 'SYSTEM', 'IOT_PROVIDER', 'WEBHOOK_SECRET', ${payloadToStore}, true, NOW(), NOW())
  `;

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

  await prisma.$disconnect();
})();
