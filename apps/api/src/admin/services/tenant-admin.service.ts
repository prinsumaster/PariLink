import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  UpdateTenantBrandingDto,
  UpdateTenantRegionalDto,
  UpdateTenantBusinessHoursDto,
  UpdateTenantStatusDto,
} from '../dto/enterprise-admin.dto';

@Injectable()
export class TenantAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getTenants(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.prisma.runAsSystem(async (tx) =>
      tx.company.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          tenantConfiguration: true,
          tenantConfigs: true,
          _count: {
            select: { users: true, branches: true, departments: true },
          },
        },
      }),
    );
  }

  async getTenantById(companyId: string) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({
        where: { id: companyId },
        include: {
          tenantConfiguration: true,
          tenantConfigs: true,
          subscriptionPlan: true,
          _count: {
            select: {
              users: true,
              branches: true,
              departments: true,
              teams: true,
              costCenters: true,
            },
          },
        },
      }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);
    return company;
  }

  async updateTenantStatus(
    companyId: string,
    dto: UpdateTenantStatusDto,
    adminUserId: string,
  ) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({ where: { id: companyId } }),
    );
    if (!company) throw new NotFoundException(`Tenant ${companyId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.company.update({
        where: { id: companyId },
        data: {
          status: dto.status,
          deletedAt: dto.status === 'DELETED' ? new Date() : null,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:tenant:update_status',
      entity: 'Company',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: { oldStatus: company.status, newStatus: dto.status },
    });

    return updated;
  }

  async updateBranding(
    companyId: string,
    dto: UpdateTenantBrandingDto,
    adminUserId: string,
  ) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({
        where: { companyId },
      }),
    );
    if (!config)
      throw new NotFoundException(
        `Configuration for tenant ${companyId} not found`,
      );

    const currentTheme = (config.theme || {}) as Record<string, any>;
    const updatedTheme = { ...currentTheme, ...dto };

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { theme: updatedTheme },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:tenant:update_branding',
      entity: 'TenantConfiguration',
      entityId: updated.id,
      userId: adminUserId,
      companyId,
      details: { branding: dto },
    });

    return updated;
  }

  async updateRegional(
    companyId: string,
    dto: UpdateTenantRegionalDto,
    adminUserId: string,
  ) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({
        where: { companyId },
      }),
    );
    if (!config)
      throw new NotFoundException(
        `Configuration for tenant ${companyId} not found`,
      );

    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedSettings = {
      ...currentSettings,
      regional: { ...(currentSettings.regional || {}), ...dto },
    };

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: updatedSettings },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:tenant:update_regional',
      entity: 'TenantConfiguration',
      entityId: updated.id,
      userId: adminUserId,
      companyId,
      details: { regional: dto },
    });

    return updated;
  }

  async updateBusinessHours(
    companyId: string,
    dto: UpdateTenantBusinessHoursDto,
    adminUserId: string,
  ) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({
        where: { companyId },
      }),
    );
    if (!config)
      throw new NotFoundException(
        `Configuration for tenant ${companyId} not found`,
      );

    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedSettings = {
      ...currentSettings,
      businessHours: { ...(currentSettings.businessHours || {}), ...dto },
    };

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: updatedSettings },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:tenant:update_business_hours',
      entity: 'TenantConfiguration',
      entityId: updated.id,
      userId: adminUserId,
      companyId,
      details: { businessHours: dto },
    });

    return updated;
  }
}
