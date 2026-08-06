import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  AssignPlanDto,
  SetTruckLimitDto,
  SetDriverLimitDto,
  SetBoostDto,
  SetUnlimitedModeDto,
} from '../dto/enterprise-admin.dto';

// ─── Default capacity per plan code ──────────────────────────────────────────
const PLAN_DEFAULTS: Record<
  string,
  { maxVehicles: number; maxDrivers: number }
> = {
  STARTER: { maxVehicles: 20, maxDrivers: 50 },
  GROWTH: { maxVehicles: 50, maxDrivers: 100 },
  PROFESSIONAL: { maxVehicles: 100, maxDrivers: 200 },
  BUSINESS: { maxVehicles: 250, maxDrivers: 500 },
  ENTERPRISE: { maxVehicles: 500, maxDrivers: 1000 },
  ENTERPRISE_PLUS: { maxVehicles: 1000, maxDrivers: 2000 },
  CUSTOM: { maxVehicles: 99999, maxDrivers: 99999 },
};

@Injectable()
export class LicenseAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ─── Get full license overview for a tenant ─────────────────────────────────
  async getLicenseOverview(companyId: string) {
    const [
      company,
      config,
      tenantConfig,
      activeUsersCount,
      totalUsersCount,
      vehicleCount,
      driverCount,
    ] = await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.company.findUnique({
          where: { id: companyId },
          include: { subscriptionPlan: true },
        }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.tenantConfiguration.findUnique({ where: { companyId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.tenantConfig.findUnique({ where: { companyId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.user.count({ where: { companyId, status: 'ACTIVE' } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.user.count({ where: { companyId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.vehicle.count({ where: { companyId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.driver.count({ where: { companyId } }),
      ),
    ]);

    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    const maxUsers = tenantConfig?.maxUsers ?? 50;
    const maxVehicles = tenantConfig?.maxVehicles ?? 20;
    const maxDrivers = tenantConfig?.maxDrivers ?? 50;
    const storageQuotaMb = tenantConfig?.storageQuotaMb ?? 10000;
    const apiRateLimit = tenantConfig?.apiRateLimit ?? 1000;
    const unlimitedMode = tenantConfig?.unlimitedMode ?? false;
    const boostExpiresAt = tenantConfig?.boostExpiresAt ?? null;
    const boostMaxVehicles = tenantConfig?.boostMaxVehicles ?? null;

    const now = new Date();
    const isInBoostPeriod = boostExpiresAt && boostExpiresAt > now;
    const effectiveVehicleLimit =
      isInBoostPeriod && boostMaxVehicles ? boostMaxVehicles : maxVehicles;

    const settings = (config?.settings || {}) as Record<string, any>;

    return {
      companyId,
      subscriptionPlan: company.subscriptionPlan || {
        id: 'default',
        name: 'Standard Enterprise',
        planCode: 'ENTERPRISE',
        price: 0,
      },
      capacity: {
        vehicles: {
          used: vehicleCount,
          limit: maxVehicles,
          effectiveLimit: effectiveVehicleLimit,
          utilizationPct: unlimitedMode
            ? 0
            : Math.round((vehicleCount / effectiveVehicleLimit) * 100),
          unlimitedMode,
          boost: isInBoostPeriod ? { boostMaxVehicles, boostExpiresAt } : null,
        },
        drivers: {
          used: driverCount,
          limit: maxDrivers,
          utilizationPct: Math.round((driverCount / maxDrivers) * 100),
        },
        users: {
          used: activeUsersCount,
          total: totalUsersCount,
          limit: maxUsers,
          utilizationPct: Math.round((activeUsersCount / maxUsers) * 100),
        },
        storage: {
          quotaMb: storageQuotaMb,
          usedMb: settings.storageUsedMb || 0,
          utilizationPct: Math.round(
            ((settings.storageUsedMb || 0) / storageQuotaMb) * 100,
          ),
        },
        api: {
          rateLimitPerMinute: apiRateLimit,
        },
      },
      trialMode: {
        isTrial: !!settings.isTrial,
        trialEndsAt: settings.trialEndsAt || null,
      },
      gracePeriod: {
        inGracePeriod: !!settings.inGracePeriod,
        gracePeriodDays: settings.gracePeriodDays || 14,
        gracePeriodEndsAt: settings.gracePeriodEndsAt || null,
      },
    };
  }

  // ─── Assign subscription plan ───────────────────────────────────────────────
  async assignPlan(companyId: string, dto: AssignPlanDto, adminUserId: string) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({
        where: { id: companyId },
        include: { subscriptionPlan: true },
      }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    // Resolve capacity from plan defaults if not explicitly provided
    const plan = await this.prisma.runAsSystem(async (tx) =>
      tx.subscriptionPlan.findUnique({ where: { id: dto.subscriptionPlanId } }),
    );

    const planCode = plan?.planCode || 'STARTER';
    const planDefaults = PLAN_DEFAULTS[planCode] || PLAN_DEFAULTS['STARTER'];

    await this.prisma.runAsSystem(async (tx) =>
      tx.company.update({
        where: { id: companyId },
        data: { subscriptionPlanId: dto.subscriptionPlanId },
      }),
    );

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.upsert({
        where: { companyId },
        update: {
          maxUsers: dto.seats ?? undefined,
          apiRateLimit: dto.apiRateLimit ?? undefined,
          storageQuotaMb: dto.storageQuotaMb ?? undefined,
          maxVehicles: plan?.defaultMaxVehicles ?? planDefaults.maxVehicles,
          maxDrivers: plan?.defaultMaxDrivers ?? planDefaults.maxDrivers,
          unlimitedMode: planCode === 'CUSTOM',
        },
        create: {
          companyId,
          maxUsers: dto.seats ?? 50,
          apiRateLimit: dto.apiRateLimit ?? 1000,
          storageQuotaMb: dto.storageQuotaMb ?? 10000,
          maxVehicles: plan?.defaultMaxVehicles ?? planDefaults.maxVehicles,
          maxDrivers: plan?.defaultMaxDrivers ?? planDefaults.maxDrivers,
          unlimitedMode: planCode === 'CUSTOM',
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:license:assign_plan',
      entity: 'Company',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: { planId: dto.subscriptionPlanId, planCode, planDefaults },
    });

    return this.getLicenseOverview(companyId);
  }

  // ─── Set truck/vehicle capacity override ────────────────────────────────────
  async setTruckLimit(
    companyId: string,
    dto: SetTruckLimitDto,
    adminUserId: string,
  ) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({ where: { id: companyId } }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.upsert({
        where: { companyId },
        update: { maxVehicles: dto.maxVehicles },
        create: { companyId, maxVehicles: dto.maxVehicles },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:license:set_truck_limit',
      entity: 'TenantConfig',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: { maxVehicles: dto.maxVehicles, reason: dto.reason },
    });

    return this.getLicenseOverview(companyId);
  }

  // ─── Set driver capacity override ───────────────────────────────────────────
  async setDriverLimit(
    companyId: string,
    dto: SetDriverLimitDto,
    adminUserId: string,
  ) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({ where: { id: companyId } }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.upsert({
        where: { companyId },
        update: { maxDrivers: dto.maxDrivers },
        create: { companyId, maxDrivers: dto.maxDrivers },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:license:set_driver_limit',
      entity: 'TenantConfig',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: { maxDrivers: dto.maxDrivers, reason: dto.reason },
    });

    return this.getLicenseOverview(companyId);
  }

  // ─── Set temporary capacity boost ──────────────────────────────────────────
  async setBoost(companyId: string, dto: SetBoostDto, adminUserId: string) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({ where: { id: companyId } }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    const boostExpiresAt = new Date(dto.boostExpiresAt);

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.upsert({
        where: { companyId },
        update: { boostMaxVehicles: dto.boostMaxVehicles, boostExpiresAt },
        create: {
          companyId,
          boostMaxVehicles: dto.boostMaxVehicles,
          boostExpiresAt,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:license:set_boost',
      entity: 'TenantConfig',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: {
        boostMaxVehicles: dto.boostMaxVehicles,
        boostExpiresAt: dto.boostExpiresAt,
        reason: dto.reason,
      },
    });

    return this.getLicenseOverview(companyId);
  }

  // ─── Toggle unlimited mode ──────────────────────────────────────────────────
  async setUnlimitedMode(
    companyId: string,
    dto: SetUnlimitedModeDto,
    adminUserId: string,
  ) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({ where: { id: companyId } }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.upsert({
        where: { companyId },
        update: { unlimitedMode: dto.unlimited },
        create: { companyId, unlimitedMode: dto.unlimited },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:license:set_unlimited',
      entity: 'TenantConfig',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: { unlimited: dto.unlimited, reason: dto.reason },
    });

    return this.getLicenseOverview(companyId);
  }

  // ─── List all subscription plans ────────────────────────────────────────────
  async listPlans() {
    return this.prisma.runAsSystem(async (tx) =>
      tx.subscriptionPlan.findMany({
        orderBy: { defaultMaxVehicles: 'asc' },
      }),
    );
  }

  // ─── Get tenant usage dashboard ─────────────────────────────────────────────
  async getUsageDashboard(companyId: string) {
    return this.getLicenseOverview(companyId);
  }

  // ─── List all tenants with license summary (for Super Admin Center) ──────────
  async listAllTenantsWithLicense() {
    const companies = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findMany({
        include: {
          subscriptionPlan: true,
          tenantConfiguration: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
    );

    const summaries = await Promise.all(
      companies.map(async (company) => {
        const config = await this.prisma.runAsSystem(async (tx) =>
          tx.tenantConfig.findUnique({ where: { companyId: company.id } }),
        );
        const [vehicleCount, driverCount] = await Promise.all([
          this.prisma.runAsSystem(async (tx) =>
            tx.vehicle.count({
              where: { companyId: company.id },
            }),
          ),
          this.prisma.runAsSystem(async (tx) =>
            tx.driver.count({
              where: { companyId: company.id },
            }),
          ),
        ]);
        return {
          id: company.id,
          name: company.name,
          status: company.status,
          plan: company.subscriptionPlan?.name || 'No Plan',
          planCode: company.subscriptionPlan?.planCode || 'NONE',
          maxVehicles: config?.maxVehicles ?? 20,
          vehicleCount,
          maxDrivers: config?.maxDrivers ?? 50,
          driverCount,
          unlimitedMode: config?.unlimitedMode ?? false,
          boostExpiresAt: config?.boostExpiresAt ?? null,
          createdAt: company.createdAt,
        };
      }),
    );

    return summaries;
  }
}
