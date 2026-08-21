/**
 * S1 — OAuth2 Guard Triple Test
 * Tests ApiV2AuthGuard (not the token issuer).
 */
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const BASE = 'http://localhost:8080';

function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

function randomBase64url(bytes: number): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

async function main() {
  await prisma.$connect();

  // Need a real companyId
  const company = await prisma.company.findFirstOrThrow();

  // S1a: Seed one throwaway OAuthClient via Prisma (not raw SQL)
  const plainClientId     = `client_${crypto.randomBytes(16).toString('hex')}`;
  const plainClientSecret = `secret_${crypto.randomBytes(32).toString('hex')}`;
  const clientSecretHash  = hashSecret(plainClientSecret);

  const throwawayClient = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.oAuthClient.create({
      data: {
        companyId:    company.id,
        clientId:     plainClientId,
        clientSecret: clientSecretHash,
        name:         'S1-throwaway-guard-test',
        scopes:       ['loads:read'],
        redirectUris: [],
        grantTypes:   ['client_credentials'],
        isActive:     true,
      },
    });
  });
  console.log('Seeded throwaway client id:', throwawayClient.id);

  // Issue token via endpoint
  const tokenRes = await fetch(`${BASE}/api/v1/iam/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type:    'client_credentials',
      client_id:     plainClientId,
      client_secret: plainClientSecret,
      scope:         'loads:read',
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Token issuance failed ${tokenRes.status}: ${await tokenRes.text()}`);
  }
  const { access_token } = (await tokenRes.json()) as { access_token: string };
  console.log('Issued token (first 16):', access_token.substring(0, 16) + '...');

  // S1b: Valid bearer -> PROTECTED /api/v2/loads
  const validRes = await fetch(`${BASE}/api/v2/loads`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  console.log('S1b Valid bearer /api/v2/loads:', validRes.status);

  // S1c: Random 48-byte base64url bearer -> must be 401
  const fakeToken = randomBase64url(48);
  const randomRes = await fetch(`${BASE}/api/v2/loads`, {
    headers: { Authorization: `Bearer ${fakeToken}` },
  });
  console.log('S1c Random 48-byte bearer:', randomRes.status);

  // S1d: Revoke the specific token row, then retry
  const tokenHash = hashSecret(access_token);
  const tokenRow = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.oAuthToken.findUnique({ where: { tokenHash } });
  });
  if (!tokenRow) throw new Error('Token row not found for revocation');

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    await tx.oAuthToken.update({
      where: { id: tokenRow.id },
      data:  { revokedAt: new Date() },
    });
  });
  console.log('Revoked token id:', tokenRow.id);

  const revokedRes = await fetch(`${BASE}/api/v2/loads`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  console.log('S1d After revocation:', revokedRes.status);

  // S1e: Scoped cleanup — ONLY the throwaway client and its tokens
  const beforeClients = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.oAuthClient.count();
  });
  const beforeTokens = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.oAuthToken.count();
  });
  console.log(`Before cleanup: OAuthClient=${beforeClients}, OAuthToken=${beforeTokens}`);

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    // Delete tokens for this specific client first (explicit, even though CASCADE covers it)
    await tx.oAuthToken.deleteMany({
      where: { clientId: throwawayClient.id },
    });
    // Delete only this specific throwaway client
    await tx.oAuthClient.deleteMany({
      where: { id: throwawayClient.id },
    });
  });

  const afterClients = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.oAuthClient.count();
  });
  const afterTokens = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.oAuthToken.count();
  });
  console.log(`After  cleanup: OAuthClient=${afterClients}, OAuthToken=${afterTokens}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
