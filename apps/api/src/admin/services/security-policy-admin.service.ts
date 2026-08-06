import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { UpdateSecurityPolicyDto } from '../dto/enterprise-admin.dto';

@Injectable()
export class SecurityPolicyAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getSecurityPolicies(companyId: string) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({
        where: { companyId },
      }),
    );
    if (!config)
      throw new NotFoundException(
        `Tenant configuration for ${companyId} not found`,
      );

    const defaultPolicies = {
      passwordMinLength: 8,
      requireNumbers: true,
      requireSymbols: false,
      passwordExpiryDays: 90,
      requireMfa: false,
      allowedMfaMethods: ['totp', 'webauthn', 'backup_codes'],
      maxConcurrentSessions: 5,
      idleTimeoutMinutes: 30,
      ipAllowList: [],
      allowedCountries: [],
      restrictToWorkingHours: false,
      requireTrustedDevice: false,
    };

    const currentPolicies = (config.policies || {}) as Record<string, any>;
    return {
      companyId,
      policies: { ...defaultPolicies, ...currentPolicies },
      updatedAt: config.updatedAt,
    };
  }

  async updateSecurityPolicies(
    companyId: string,
    dto: UpdateSecurityPolicyDto,
    adminUserId: string,
  ) {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.findUnique({
        where: { companyId },
      }),
    );
    if (!config)
      throw new NotFoundException(
        `Tenant configuration for ${companyId} not found`,
      );

    const currentPolicies = (config.policies || {}) as Record<string, any>;
    const updatedPolicies = { ...currentPolicies, ...dto };

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { policies: updatedPolicies },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:security_policy:update',
      entity: 'TenantConfiguration',
      entityId: updated.id,
      userId: adminUserId,
      companyId,
      details: { policies: dto },
    });

    return {
      companyId,
      policies: updatedPolicies,
      updatedAt: updated.updatedAt,
    };
  }
}
