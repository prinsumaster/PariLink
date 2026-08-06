/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTenantDto,
  CreateSubscriptionPlanDto,
  UpdateTenantConfigDto,
} from './dto/admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createSubscriptionPlan(dto: CreateSubscriptionPlanDto) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.subscriptionPlan.create({
        data: dto,
      }),
    );
  }

  async getSubscriptionPlans() {
    return this.prisma.runAsSystem(async (tx) =>
      tx.subscriptionPlan.findMany(),
    );
  }

  async provisionTenant(dto: CreateTenantDto) {
    // Check if admin email already exists globally
    const existingUser = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: dto.adminEmail },
      }),
    );
    if (existingUser) {
      throw new ConflictException('Admin email already in use globally');
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    // Create the tenant, config, role, and admin user in a transaction
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.name,
          subscriptionPlanId: dto.subscriptionPlanId,
        },
      });

      // Default tenant config
      await tx.tenantConfiguration.create({
        data: {
          companyId: company.id,
          settings: { timezone: 'UTC', currency: 'USD' },
          theme: { primaryColor: '#000000', logoUrl: '' },
          policies: { requireMfa: false },
        },
      });

      // Create Admin Role
      const adminRole = await tx.role.create({
        data: {
          companyId: company.id,
          name: 'Super Admin',
          description: 'Tenant Super Administrator',
          permissions: ['*'], // wildcard permission
        },
      });

      // Create Admin User
      const adminUser = await tx.user.create({
        data: {
          companyId: company.id,
          email: dto.adminEmail,
          password: hashedPassword,
          firstName: dto.adminFirstName,
          lastName: dto.adminLastName,
          roleId: adminRole.id,
        },
      });

      return { company, adminUser };
    });
  }

  async suspendTenant(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.company.update({
        where: { id: companyId },
        data: { status: 'SUSPENDED' },
      }),
    );
  }

  async updateTenantConfig(companyId: string, dto: UpdateTenantConfigDto) {
    // This uses runAsTenant to ensure safety if called by a tenant admin
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const config = await tx.tenantConfiguration.findUnique({
        where: { companyId },
      });
      if (!config) throw new NotFoundException('Tenant config not found');

      return tx.tenantConfiguration.update({
        where: { companyId },
        data: {
          settings: (dto.settings || config.settings) as any,
          theme: (dto.theme || config.theme) as any,
          policies: (dto.policies || config.policies) as any,
        },
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // V27 — MARKETPLACE
  // ─────────────────────────────────────────────────────────────

  async getMarketplaceApps(companyId: string) {
    const [apps, installations] = await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.marketplaceApp.findMany({ orderBy: { name: 'asc' } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.appInstallation.findMany({ where: { companyId } }),
      ),
    ]);
    const installedMap = new Map(installations.map((i) => [i.appId, i]));
    return apps.map((app) => ({
      ...app,
      isInstalled: installedMap.has(app.id),
      installation: installedMap.get(app.id) || null,
    }));
  }

  async installApp(
    companyId: string,
    userId: string,
    appId: string,
    credentials: any = {},
    settings: any = {},
  ) {
    const app = await this.prisma.runAsSystem(async (tx) =>
      tx.marketplaceApp.findUnique({
        where: { id: appId },
      }),
    );
    if (!app) throw new NotFoundException('App not found');
    return this.prisma.runAsSystem(async (tx) =>
      tx.appInstallation.upsert({
        where: { companyId_appId: { companyId, appId } },
        update: {
          status: 'ACTIVE',
          credentials,
          settings,
          installedBy: userId,
        },
        create: {
          companyId,
          appId,
          status: 'ACTIVE',
          credentials,
          settings,
          installedBy: userId,
        },
      }),
    );
  }

  async uninstallApp(companyId: string, appId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.appInstallation.updateMany({
        where: { companyId, appId },
        data: { status: 'UNINSTALLED' },
      }),
    );
  }

  async updateAppSettings(companyId: string, appId: string, settings: any) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.appInstallation.update({
        where: { companyId_appId: { companyId, appId } },
        data: { settings },
      }),
    );
  }

  // ─────────────────────────────────────────────────────────────
  // V27 — FEATURE FLAGS
  // ─────────────────────────────────────────────────────────────

  async getFeatureFlags(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.findMany({ where: { companyId } }),
    );
  }

  async upsertFeatureFlag(
    companyId: string,
    key: string,
    isEnabled: boolean,
    description?: string,
  ) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.upsert({
        where: { companyId_key: { companyId, key } },
        update: { isEnabled, description },
        create: {
          companyId,
          key,
          name: key,
          isEnabled,
          description: description || key,
        },
      }),
    );
  }

  // ─────────────────────────────────────────────────────────────
  // V27 — AUDIT LOGS
  // ─────────────────────────────────────────────────────────────

  async getAuditLogs(
    companyId: string,
    options: {
      page?: number;
      limit?: number;
      entity?: string;
      userId?: string;
    } = {},
  ) {
    const { page = 1, limit = 50, entity, userId } = options;
    const where: any = { companyId };
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    const [data, total] = await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        }),
      ),
      this.prisma.runAsSystem(async (tx) => tx.auditLog.count({ where })),
    ]);
    return { data, total, page, limit };
  }

  // ─────────────────────────────────────────────────────────────
  // V27 — USERS MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  async getAllUsers(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.user.findMany({
        where: { companyId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,
          role: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async getAllRoles(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.role.findMany({
        where: { companyId },
        include: { _count: { select: { users: true } } },
        orderBy: { name: 'asc' },
      }),
    );
  }
}
