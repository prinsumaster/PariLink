import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const company = await prisma.company.findFirst();

  // Create an OAuth2 client
  const clientId = 'client_' + Date.now();
  const clientSecret = 'super_secret_' + Date.now();
  const secretHash = crypto.createHash('sha256').update(clientSecret).digest('hex');

  // @ts-ignore: reserved for future use
  const _client = await prisma.$executeRaw`
    INSERT INTO "OAuthClient" ("id", "name", "clientId", "clientSecret", "companyId", "scopes", "redirectUris", "createdAt", "updatedAt")
    VALUES (${crypto.randomUUID()}, 'Test Client', ${clientId}, ${secretHash}, ${company!.id}, '[]', '[]', NOW(), NOW())
  `;

  // 1. Valid credentials (expect 200)
  let res = await fetch('http://localhost:8080/api/v1/iam/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret })
  });
  console.log('Valid credentials:', res.status);

  // 2. Invalid secret (expect 401)
  res = await fetch('http://localhost:8080/api/v1/iam/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: 'wrong' })
  });
  console.log('Invalid secret:', res.status);

  // 3. Invalid client (expect 401)
  res = await fetch('http://localhost:8080/api/v1/iam/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: 'wrong', client_secret: clientSecret })
  });
  console.log('Invalid client:', res.status);

  await prisma.$disconnect();
})();
