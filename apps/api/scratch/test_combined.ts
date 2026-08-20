import { PrismaClient } from '@prisma/client';
import { IntegrationAuthService } from '../src/integration/auth/auth.service';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const authService = new IntegrationAuthService();

(async () => {
  const company = await prisma.company.findFirst();
  if (!company) {
    console.log("No company found!");
    return;
  }
  const companyId = company.id;
  const provider = 'ENTERPRISE_PAYMENTS';
  
  // Ensure Connector exists
  const connector = await prisma.integrationConnector.upsert({
    where: { provider: provider },
    update: {},
    create: {
      id: provider,
      provider: provider,
      version: '2.0.0',
      status: 'ACTIVE',
      authType: 'API_KEY'
    }
  });
  
  const secret = 'my_super_secret_key_123';
  const credentials = authService.encryptCredentials({
    webhookSecret: secret
  });
  
  const connection = await prisma.integrationConnection.create({
    data: {
      companyId,
      connectorId: connector.id,
      status: 'CONFIGURED',
      credentials: JSON.parse(credentials)
    }
  });
  
  console.log("Seeded connection:", connection.id);

  const bodyObj = { type: "test", data: {} };
  const rawBody = JSON.stringify(bodyObj);
  
  // 1. Valid Signature -> Expect 2xx
  const validSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  console.log("Testing VALID signature:", validSignature);
  const resValid = await fetch(`http://localhost:8080/api/v1/integration/gateway/${provider}/webhook/${companyId}`, {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "x-webhook-signature": validSignature
      },
      body: rawBody
  });
  console.log("Valid Signature Status:", resValid.status);
  console.log("Valid Signature Body:", await resValid.text());
  
  // 2. Invalid Signature -> Expect 401
  const invalidSignature = "invalid_signature_123456789";
  console.log("Testing INVALID signature:", invalidSignature);
  const resInvalid = await fetch(`http://localhost:8080/api/v1/integration/gateway/${provider}/webhook/${companyId}`, {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "x-webhook-signature": invalidSignature
      },
      body: rawBody
  });
  console.log("Invalid Signature Status:", resInvalid.status);
  
  // Cleanup
  // await prisma.integrationConnection.delete({ where: { id: connection.id } });
  // console.log("Cleaned up connection");
})();
