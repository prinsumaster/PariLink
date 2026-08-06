import {
  Injectable,
  Logger,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheManagerService } from '../performance/cache-manager.service';

// ---------------------------------------------------------------------------
// PariLink License & Entitlement Engine
//
// Every API request that touches a licensed module passes through this service.
// License data is cached (60s TTL) to avoid per-request DB hits.
//
// Entitlement model (stored in TenantConfig):
//   {
//     "tier": "ENTERPRISE",
//     "modules": ["dispatch", "warehouse", "ai", "integrations"],
//     "limits": {
//       "users": 500,
//       "vehicles": 2000,
//       "apiCallsPerMonth": 5000000,
//       "storageMb": 500000
//     },
//     "trialExpiresAt": null,
//     "contractExpiresAt": "2027-06-30T23:59:59Z",
//     "gracePeriodDays": 7
//   }
//
// Tiers (built-in defaults — overridden by tenant contract):
//   TRIAL   — 5 users, 10 vehicles, no AI, no Integrations
//   STARTER — 20 users, 100 vehicles, core modules only
//   GROWTH  — 100 users, 500 vehicles, + Warehouse + Integrations
//   ENTERPRISE — unlimited users, unlimited vehicles, all modules
// ---------------------------------------------------------------------------

export interface LicenseState {
  tier: 'TRIAL' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  modules: string[];
  limits: {
    users: number;
    vehicles: number;
    apiCallsPerMonth: number;
    storageMb: number;
  };
  isActive: boolean;
  isExpired: boolean;
  isInGracePeriod: boolean;
  gracePeriodEndsAt?: Date;
  contractExpiresAt?: Date;
}

const TIER_DEFAULTS: Record<string, Partial<LicenseState>> = {
  TRIAL: {
    modules: ['dispatch', 'trips', 'vehicles', 'drivers'],
    limits: {
      users: 5,
      vehicles: 10,
      apiCallsPerMonth: 10_000,
      storageMb: 500,
    },
  },
  STARTER: {
    modules: [
      'dispatch',
      'trips',
      'vehicles',
      'drivers',
      'finance',
      'invoices',
    ],
    limits: {
      users: 20,
      vehicles: 100,
      apiCallsPerMonth: 100_000,
      storageMb: 5_000,
    },
  },
  GROWTH: {
    modules: [
      'dispatch',
      'trips',
      'vehicles',
      'drivers',
      'finance',
      'invoices',
      'warehouse',
      'integrations',
      'analytics',
    ],
    limits: {
      users: 100,
      vehicles: 500,
      apiCallsPerMonth: 1_000_000,
      storageMb: 50_000,
    },
  },
  ENTERPRISE: {
    modules: ['*'], // All modules
    limits: {
      users: 999_999,
      vehicles: 999_999,
      apiCallsPerMonth: 999_999_999,
      storageMb: 999_999_999,
    },
  },
};

@Injectable()
export class LicenseService implements OnModuleInit {
  private readonly logger = new Logger(LicenseService.name);
  private readonly CACHE_TTL = 60; // seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
  ) {}

  onModuleInit() {
    this.logger.log('License & Entitlement Engine initialized');
  }

  /** Fetch the effective license state for a tenant. Cached. */
  async getLicense(companyId: string): Promise<LicenseState> {
    const cacheKey = `license:${companyId}`;
    const cached = await this.cache.get<LicenseState>(cacheKey);
    if (cached) return cached;

    const config = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tenantConfig.findUnique({
        where: { companyId },
      }),
    );

    const tier = (config?.tier ?? 'TRIAL') as LicenseState['tier'];
    const defaults = TIER_DEFAULTS[tier] ?? TIER_DEFAULTS['TRIAL'];
    const brandingConfig = (config?.brandingConfig as any) ?? {};

    const contractExpiresAt: Date | undefined = brandingConfig.contractExpiresAt
      ? new Date(brandingConfig.contractExpiresAt)
      : undefined;

    const trialExpiresAt: Date | undefined = brandingConfig.trialExpiresAt
      ? new Date(brandingConfig.trialExpiresAt)
      : undefined;

    const now = new Date();
    const gracePeriodDays: number = brandingConfig.gracePeriodDays ?? 7;

    let isExpired = false;
    let isInGracePeriod = false;
    let gracePeriodEndsAt: Date | undefined;

    const expiryDate = contractExpiresAt ?? trialExpiresAt;
    if (expiryDate) {
      isExpired = now > expiryDate;
      if (isExpired) {
        gracePeriodEndsAt = new Date(
          expiryDate.getTime() + gracePeriodDays * 86_400_000,
        );
        isInGracePeriod = now < gracePeriodEndsAt;
      }
    }

    // Merge contract overrides
    const modules: string[] = brandingConfig.modules ?? defaults.modules ?? [];
    const limits = { ...defaults.limits, ...(brandingConfig.limits ?? {}) };

    const state: LicenseState = {
      tier,
      modules,
      limits: limits as LicenseState['limits'],
      isActive: !isExpired || isInGracePeriod,
      isExpired,
      isInGracePeriod,
      gracePeriodEndsAt,
      contractExpiresAt,
    };

    await this.cache.set(cacheKey, state, this.CACHE_TTL);
    return state;
  }

  /** Throws ForbiddenException if the tenant is not licensed for the module. */
  async requireModule(companyId: string, module: string): Promise<void> {
    const license = await this.getLicense(companyId);

    if (!license.isActive) {
      throw new ForbiddenException(
        `Your PariLink subscription has expired. Please renew to continue using ${module}.`,
      );
    }

    const hasModule =
      license.modules.includes('*') || license.modules.includes(module);

    if (!hasModule) {
      throw new ForbiddenException(
        `The "${module}" module is not included in your ${license.tier} plan. Please upgrade your subscription.`,
      );
    }

    if (license.isInGracePeriod) {
      this.logger.warn(
        `[License] Tenant ${companyId} is in grace period until ${license.gracePeriodEndsAt?.toISOString()}`,
      );
    }
  }

  /** Returns true if the tenant is under a specific resource limit. */
  async checkLimit(
    companyId: string,
    limitKey: keyof LicenseState['limits'],
    currentCount: number,
  ): Promise<{ allowed: boolean; limit: number; current: number }> {
    const license = await this.getLicense(companyId);
    const limit = license.limits[limitKey];
    return { allowed: currentCount < limit, limit, current: currentCount };
  }

  /** Invalidates the cached license for a tenant (call after plan changes). */
  async invalidate(companyId: string): Promise<void> {
    await this.cache.delete(`license:${companyId}`);
  }
}
