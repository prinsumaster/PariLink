/**
 * GUC Attack Penetration Test
 *
 * Verifies that a tenant cannot escape their RLS boundary by calling
 * SET set_config('app.current_company_id', <other_tenant_id>, true)
 * inside a runAsTenant() transaction.
 *
 * Strategy: bypass the full AppModule entirely — PrismaService only needs
 * a DATABASE_URL env-var, so we instantiate it directly without NestJS.
 */
import { PrismaService } from '../src/prisma/prisma.service';

// Silence NestJS Logger noise during the test
jest.spyOn(console, 'debug').mockReturnValue(undefined as any);

describe('GUC Attack — Tenant Isolation Penetration Test', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('attempts GUC re-point inside a tenant transaction and proves it is blocked by RLS', async () => {
    // Use runAsSystem to fetch tenants — the app-role client is RLS-scoped
    // and returns 0 rows without a GUC context set.
    const tenants = await prisma.runAsSystem(
      'GUC penetration test — tenant lookup for setup',
      async (tx) => tx.company.findMany({ take: 2, select: { id: true, name: true } }),
    );
    if (tenants.length < 2) {
      console.warn('[GUC-ATTACK] Insufficient tenants seeded — skipping penetration test.');
      return;
    }

    const tA = tenants[0].id;
    const tB = tenants[1].id;
    console.log(`[GUC-ATTACK] Tenant A: ${tA} | Tenant B (attack target): ${tB}`);


    let tripIds: string[] = [];

    await prisma.runAsTenant(tA, async (tx) => {
      console.log('[GUC-ATTACK] --> TX OPEN FOR TENANT A:', tA);

      // ── Phase 1: Try to silently overwrite the GUC to Tenant B ────────────
      try {
        await tx.$queryRawUnsafe(
          `SELECT set_config('app.current_company_id', '${tB}', true)`,
        );

        console.log('[GUC-ATTACK] --> REPOINT CALL: did not throw');
      } catch (e: any) {

        console.log('[GUC-ATTACK] --> REPOINT BLOCKED BY DB:', e.message);
      }

      // ── Phase 2: Attempt data exfiltration after the re-point ─────────────
      const trips = await tx.trip.findMany({ select: { id: true, companyId: true } });
      tripIds = trips.map((t) => t.companyId);
      console.log('[GUC-ATTACK] --> TRIPS VISIBLE AFTER REPOINT ATTEMPT:', trips.length);

      if (trips.length > 0) {
        console.log('[GUC-ATTACK] --> COMPANY IDS IN RESULT:', [...new Set(tripIds)].join(', '));
      }
    });

    // ── Assert: All visible trips still belong to Tenant A ──────────────────
    const leakedTrips = tripIds.filter((id) => id !== tA);
    if (leakedTrips.length > 0) {
      console.error('[GUC-ATTACK] !! CRITICAL VULNERABILITY CONFIRMED — Cross-tenant data leaked:', leakedTrips);
    } else {
      console.log('[GUC-ATTACK] --> ISOLATION HELD: 0 trips from Tenant B visible.');
    }

    expect(leakedTrips).toHaveLength(0);
  }, 30_000);
});
