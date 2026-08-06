/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  UpdateSmtpSettingsDto,
  UpdateStorageSettingsDto,
  UpdateQueueSettingsDto,
  UpdateRedisSettingsDto,
  UpdateCdnSettingsDto,
  UpdateMaintenanceModeDto,
} from '../dto/enterprise-admin.dto';

@Injectable()
export class SystemSettingsAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private async getOrInitConfig(companyId: string) {
    let config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({ where: { companyId } }),
    );
    if (!config) {
      const company = await this.prisma.runAsSystem(async (tx) =>
        tx.company.findUnique({ where: { id: companyId } }),
      );
      if (!company)
        throw new NotFoundException(`Tenant ${companyId} not found`);
      config = await this.prisma.runAsSystem(async (tx) =>
        tx.tenantConfiguration.create({
          data: { companyId, settings: {}, theme: {}, policies: {} },
        }),
      );
    }
    return config;
  }

  async getSystemSettings(companyId: string) {
    const config = await this.getOrInitConfig(companyId);
    const settings = (config.settings || {}) as Record<string, any>;

    return {
      companyId,
      smtp: settings.smtp || {
        smtpHost: 'smtp.sendgrid.net',
        smtpPort: 587,
        smtpUser: 'apikey',
        smtpSecure: true,
      },
      storage: settings.storage || {
        storageProvider: 's3',
        s3Bucket: 'parilink-enterprise-storage',
        s3Region: 'us-east-1',
      },
      queue: settings.queue || { queueConcurrency: 10, retryAttempts: 5 },
      redis: settings.redis || {
        redisHost: 'redis-cluster.internal',
        redisPort: 6379,
        cacheTtl: 300,
      },
      cdn: settings.cdn || {
        cdnUrl: 'https://cdn.parilink.com',
        cdnEnabled: true,
      },
      maintenance: settings.maintenance || {
        maintenanceMode: false,
        maintenanceMessage: 'System is undergoing scheduled maintenance.',
      },
      updatedAt: config.updatedAt,
    };
  }

  async updateSmtp(
    companyId: string,
    dto: UpdateSmtpSettingsDto,
    adminUserId: string,
  ) {
    const config = await this.getOrInitConfig(companyId);
    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedSmtp = { ...(currentSettings.smtp || {}), ...dto };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: { ...currentSettings, smtp: updatedSmtp } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:system:update_smtp',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { smtp: dto },
    });

    return updatedSmtp;
  }

  async updateStorage(
    companyId: string,
    dto: UpdateStorageSettingsDto,
    adminUserId: string,
  ) {
    const config = await this.getOrInitConfig(companyId);
    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedStorage = { ...(currentSettings.storage || {}), ...dto };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: { ...currentSettings, storage: updatedStorage } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:system:update_storage',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { storage: dto },
    });

    return updatedStorage;
  }

  async updateQueue(
    companyId: string,
    dto: UpdateQueueSettingsDto,
    adminUserId: string,
  ) {
    const config = await this.getOrInitConfig(companyId);
    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedQueue = { ...(currentSettings.queue || {}), ...dto };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: { ...currentSettings, queue: updatedQueue } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:system:update_queue',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { queue: dto },
    });

    return updatedQueue;
  }

  async updateRedis(
    companyId: string,
    dto: UpdateRedisSettingsDto,
    adminUserId: string,
  ) {
    const config = await this.getOrInitConfig(companyId);
    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedRedis = { ...(currentSettings.redis || {}), ...dto };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: { ...currentSettings, redis: updatedRedis } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:system:update_redis',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { redis: dto },
    });

    return updatedRedis;
  }

  async updateCdn(
    companyId: string,
    dto: UpdateCdnSettingsDto,
    adminUserId: string,
  ) {
    const config = await this.getOrInitConfig(companyId);
    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedCdn = { ...(currentSettings.cdn || {}), ...dto };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { settings: { ...currentSettings, cdn: updatedCdn } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:system:update_cdn',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { cdn: dto },
    });

    return updatedCdn;
  }

  async updateMaintenanceMode(
    companyId: string,
    dto: UpdateMaintenanceModeDto,
    adminUserId: string,
  ) {
    const config = await this.getOrInitConfig(companyId);
    const currentSettings = (config.settings || {}) as Record<string, any>;
    const updatedMaintenance = {
      ...(currentSettings.maintenance || {}),
      ...dto,
    };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: {
          settings: { ...currentSettings, maintenance: updatedMaintenance },
        },
      }),
    );

    await this.audit.logEvent({
      action: dto.maintenanceMode
        ? 'admin:system:enable_maintenance'
        : 'admin:system:disable_maintenance',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { maintenance: dto },
    });

    return updatedMaintenance;
  }
}
