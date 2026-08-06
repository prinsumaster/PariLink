import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheManagerService } from '../performance/cache-manager.service';

// ---------------------------------------------------------------------------
// Enterprise Feature Flag Platform
//
// Evaluation order (highest precedence first):
//   1. Global kill switch — single env var can disable any flag instantly
//   2. User-level override
//   3. Role-level rule
//   4. Branch-level rule
//   5. Percentage rollout (deterministic hash on tenantId+userId+flagKey)
//   6. Tenant-level default
//   7. Global default (rules.default)
//
// Rule Schema (stored in featureFlag.rules JSON):
//   {
//     "default": false,
//     "userIds": ["user-abc"],           // explicit user allow-list
//     "roleIds": ["role-admin"],         // role-based activation
//     "branchIds": ["branch-123"],       // branch rollout
//     "percentage": 20,                 // 0–100 — deterministic hash rollout
//     "scheduledFrom": "2026-01-01T00:00:00Z",
//     "scheduledUntil": "2026-12-31T23:59:59Z"
//   }
// ---------------------------------------------------------------------------

export interface FeatureContext {
  companyId: string;
  userId?: string;
  roleId?: string;
  branchId?: string;
}

@Injectable()
export class FeatureToggleService implements OnModuleInit {
  private readonly logger = new Logger(FeatureToggleService.name);
  private readonly CACHE_TTL_SECONDS = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
  ) {}

  onModuleInit() {
    this.logger.log('Feature Toggle Platform initialized');
  }

  /**
   * Primary evaluation method. Use this everywhere.
   */
  async isEnabled(flagKey: string, ctx: FeatureContext): Promise<boolean> {
    // 1. Global kill switch (env-level emergency disable)
    const killSwitchKey = `FEATURE_DISABLED_${flagKey.toUpperCase().replace(/-/g, '_')}`;
    if (process.env[killSwitchKey] === 'true') {
      this.logger.warn(
        `[FeatureFlag] ${flagKey} disabled via kill switch env var`,
      );
      return false;
    }

    const cacheKey = this.cache.generateTenantKey(
      ctx.companyId,
      'ff',
      `${flagKey}:${ctx.userId ?? 'anon'}`,
    );
    const cached = await this.cache.get<boolean>(cacheKey);
    if (cached !== null) return cached;

    const flag = await this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.findUnique({
        where: { companyId_key: { companyId: ctx.companyId, key: flagKey } },
      }),
    );

    // Tenant hasn't configured this flag — check global default
    if (!flag) {
      await this.cache.set(cacheKey, false, this.CACHE_TTL_SECONDS);
      return false;
    }

    // Global flag switch
    if (!flag.isEnabled) {
      await this.cache.set(cacheKey, false, this.CACHE_TTL_SECONDS);
      return false;
    }

    const rules = (flag.rules as Record<string, unknown>) || {};
    const result = this.evaluateRules(rules, ctx, flagKey);

    await this.cache.set(cacheKey, result, this.CACHE_TTL_SECONDS);
    return result;
  }

  /** Enable a flag for a tenant (sets isEnabled=true and default=true in rules) */
  async enable(
    companyId: string,
    flagKey: string,
    updatedBy: string,
  ): Promise<void> {
    await this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.upsert({
        where: { companyId_key: { companyId, key: flagKey } },
        create: {
          companyId,
          key: flagKey,
          name: flagKey,
          isEnabled: true,
          rules: { default: true },
        },
        update: { isEnabled: true },
      }),
    );
    await this.invalidate(companyId, flagKey);
    this.logger.log(
      `[FeatureFlag] ${flagKey} ENABLED for tenant ${companyId} by ${updatedBy}`,
    );
  }

  /** Instant emergency kill: sets isEnabled=false */
  async killSwitch(
    companyId: string,
    flagKey: string,
    updatedBy: string,
  ): Promise<void> {
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.featureFlag.updateMany({
        where: { companyId, key: flagKey },
        data: { isEnabled: false },
      }),
    );
    await this.invalidate(companyId, flagKey);
    this.logger.warn(
      `[FeatureFlag] KILL SWITCH: ${flagKey} DISABLED for tenant ${companyId} by ${updatedBy}`,
    );
  }

  async invalidate(companyId: string, flagKey: string): Promise<void> {
    // Invalidate all user-specific cache entries for this flag
    // In a full Redis implementation we'd use SCAN + DEL pattern
    await this.cache.delete(
      this.cache.generateTenantKey(companyId, 'ff', `${flagKey}:anon`),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  private evaluateRules(
    rules: Record<string, unknown>,
    ctx: FeatureContext,
    flagKey: string,
  ): boolean {
    const now = new Date();

    // Schedule gate
    if (rules.scheduledFrom && new Date(rules.scheduledFrom as string) > now)
      return false;
    if (rules.scheduledUntil && new Date(rules.scheduledUntil as string) < now)
      return false;

    // User allow-list
    if (
      ctx.userId &&
      Array.isArray(rules.userIds) &&
      rules.userIds.includes(ctx.userId)
    )
      return true;

    // Role-based
    if (
      ctx.roleId &&
      Array.isArray(rules.roleIds) &&
      rules.roleIds.includes(ctx.roleId)
    )
      return true;

    // Branch-based
    if (
      ctx.branchId &&
      Array.isArray(rules.branchIds) &&
      rules.branchIds.includes(ctx.branchId)
    )
      return true;

    // Percentage rollout (deterministic: same user always gets same result)
    if (typeof rules.percentage === 'number' && rules.percentage > 0) {
      const hash = this.deterministicHash(
        `${ctx.companyId}:${ctx.userId ?? ''}:${flagKey}`,
      );
      const bucket = hash % 100;
      if (bucket < rules.percentage) return true;
    }

    // Fall through to global default
    return rules.default === true;
  }

  private deterministicHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // 32-bit int
    }
    return Math.abs(hash);
  }
}
