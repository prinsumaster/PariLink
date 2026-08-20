import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ApiKeyService } from '../src/iam/services/api-keys.service';
import { SecretsService } from '../src/platform/security/secrets/secrets.service';
import { PrismaService } from '../src/prisma/prisma.service';
import * as crypto from 'crypto';

(async () => {
  // Mock logger to suppress nest startup noise
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const prisma = app.get(PrismaService);
  const secretsService = app.get(SecretsService);
  const apiKeyService = app.get(ApiKeyService);

  const company = await prisma.company.findFirst();
  const apiKeyStr = 'test_iot_api_key_' + Date.now();
  
  // Seed API Key
  const keyHash = crypto.createHash('sha256').update(apiKeyStr).digest('hex');
  await prisma.runAsSystem('Seeding test API key', async (tx) => {
    return tx.apiKey.create({
      data: {
        id: crypto.randomUUID(),
        name: 'IoT Test Key',
        keyHash,
        scopes: [],
        companyId: company!.id,
      }
    });
  });

  // Seed Secret
  const secretStr = 'iot_super_secret_' + Date.now();
  const user = await prisma.user.findFirst();
  await secretsService.storeIntegrationSecret('SYSTEM', 'IOT_PROVIDER', 'WEBHOOK_SECRET', secretStr, user!.id);

  const payload = { vehicleId: 'V1', latitude: 12.3, longitude: 45.6 };
  const payloadStr = JSON.stringify(payload);
  const validSig = crypto.createHmac('sha256', secretStr).update(Buffer.from(payloadStr)).digest('hex');

  // Test Missing Header
  let res = await fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr },
    body: payloadStr
  });
  console.log('Missing Signature Status:', res.status);

  // Test Invalid Header
  res = await fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr, 'x-provider-signature': 'invalid_signature_123' },
    body: payloadStr
  });
  console.log('Invalid Signature Status:', res.status);

  // Test Valid Header
  res = await fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr, 'x-provider-signature': validSig },
    body: payloadStr
  });
  console.log('Valid Signature Status:', res.status);
  
  await app.close();
  process.exit(0);
})();
