import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  AuditQueryDto,
  AuditRetentionPolicyDto,
} from '../dto/enterprise-admin.dto';

@Injectable()
export class AuditAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async queryAuditLogs(
    companyId: string,
    dto: AuditQueryDto,
    isSuperAdmin: boolean = false,
  ) {
    const {
      page = 1,
      limit = 50,
      entity,
      userId,
      actionPrefix,
      startDate,
      endDate,
    } = dto;
    const where: any = {};
    if (!isSuperAdmin || companyId !== 'GLOBAL') {
      where.companyId = companyId;
    }
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    if (actionPrefix) {
      where.action = { startsWith: actionPrefix };
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
      ),
      this.prisma.runAsSystem(async (tx) => tx.auditLog.count({ where })),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getUserTimeline(
    companyId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    return this.queryAuditLogs(companyId, { userId, page, limit });
  }

  async getSecurityEvents(
    companyId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const where = {
      companyId,
      OR: [
        { action: { startsWith: 'auth:' } },
        { action: { startsWith: 'security:' } },
        { action: { startsWith: 'sso:' } },
        { action: { startsWith: 'mfa:' } },
        { action: { startsWith: 'admin:security:' } },
        { action: { startsWith: 'admin:user:lock' } },
        { action: { startsWith: 'admin:user:suspend' } },
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
      ),
      this.prisma.runAsSystem(async (tx) => tx.auditLog.count({ where })),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getComplianceReport(companyId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalEvents, authFailures, adminMutations, securityChanges] =
      await Promise.all([
        this.prisma.runAsSystem(async (tx) =>
          tx.auditLog.count({
            where: { companyId, createdAt: { gte: thirtyDaysAgo } },
          }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.auditLog.count({
            where: {
              companyId,
              createdAt: { gte: thirtyDaysAgo },
              OR: [
                { action: 'auth:login:failed' },
                { action: 'auth:mfa:failed' },
                { action: 'auth:brute_force_lock' },
              ],
            },
          }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.auditLog.count({
            where: {
              companyId,
              createdAt: { gte: thirtyDaysAgo },
              action: { startsWith: 'admin:' },
            },
          }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.auditLog.count({
            where: {
              companyId,
              createdAt: { gte: thirtyDaysAgo },
              action: { startsWith: 'security:' },
            },
          }),
        ),
      ]);

    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({ where: { companyId } }),
    );
    const policies = (config?.policies || {}) as Record<string, any>;

    return {
      companyId,
      reportGeneratedAt: now.toISOString(),
      periodDays: 30,
      metrics: {
        totalAuditEvents: totalEvents,
        authenticationFailures: authFailures,
        administrativeMutations: adminMutations,
        securityPolicyModifications: securityChanges,
      },
      compliancePosture: {
        mfaRequired: !!policies.requireMfa,
        auditRetentionDays: policies.auditRetentionDays || 365,
        passwordExpiryDays: policies.passwordExpiryDays || 90,
        compliant:
          !!policies.requireMfa && (policies.auditRetentionDays || 365) >= 90,
      },
    };
  }

  async getRetentionPolicy(companyId: string) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({ where: { companyId } }),
    );
    const policies = (config?.policies || {}) as Record<string, any>;
    return {
      companyId,
      auditRetentionDays: policies.auditRetentionDays || 365,
      autoArchiveEnabled: true,
    };
  }

  async updateRetentionPolicy(
    companyId: string,
    dto: AuditRetentionPolicyDto,
    adminUserId: string,
  ) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({ where: { companyId } }),
    );
    if (!config)
      throw new NotFoundException(
        `Tenant configuration for ${companyId} not found`,
      );

    const currentPolicies = (config.policies || {}) as Record<string, any>;
    const updatedPolicies = {
      ...currentPolicies,
      auditRetentionDays: dto.auditRetentionDays,
    };

    await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { policies: updatedPolicies },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:audit:update_retention',
      entity: 'TenantConfiguration',
      entityId: config.id,
      userId: adminUserId,
      companyId,
      details: { auditRetentionDays: dto.auditRetentionDays },
    });

    return { companyId, auditRetentionDays: dto.auditRetentionDays };
  }

  async purgeExpiredLogs(companyId: string, adminUserId: string) {
    const policy = await this.getRetentionPolicy(companyId);
    const cutoffDate = new Date(
      Date.now() - policy.auditRetentionDays * 24 * 60 * 60 * 1000,
    );

    const result = await this.prisma.runAsSystem(async (tx) =>
      tx.auditLog.deleteMany({
        where: { companyId, createdAt: { lt: cutoffDate } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:audit:purge_expired',
      entity: 'AuditLog',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: {
        purgedCount: result.count,
        cutoffDate: cutoffDate.toISOString(),
      },
    });

    return { purgedCount: result.count, cutoffDate: cutoffDate.toISOString() };
  }
}
