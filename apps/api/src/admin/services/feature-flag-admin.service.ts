import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  CreateEnterpriseFlagDto,
  UpdateEnterpriseFlagDto,
} from '../dto/enterprise-admin.dto';

@Injectable()
export class FeatureFlagAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getFlags(companyId: string) {
    const flags = await this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.findMany({
        where: {
          OR: [{ companyId }, { companyId: 'GLOBAL' }],
        },
        orderBy: { key: 'asc' },
      }),
    );

    return flags.map((f) => {
      const rules = (f.rules || {}) as Record<string, any>;
      return {
        id: f.id,
        companyId: f.companyId,
        key: f.key,
        name: f.name,
        description: f.description,
        isEnabled: f.isEnabled,
        isGlobal: f.companyId === 'GLOBAL' || !!rules.isGlobal,
        percentageRollout:
          typeof rules.percentageRollout === 'number'
            ? rules.percentageRollout
            : 100,
        killSwitch: !!rules.killSwitch,
        targetEnvironments: Array.isArray(rules.targetEnvironments)
          ? rules.targetEnvironments
          : ['production', 'staging', 'development'],
        rules: f.rules,
      };
    });
  }

  async upsertFlag(
    companyId: string,
    dto: CreateEnterpriseFlagDto,
    adminUserId: string,
  ) {
    const targetCompanyId = dto.isGlobal ? 'GLOBAL' : companyId;
    const rules = {
      isGlobal: !!dto.isGlobal,
      percentageRollout: dto.percentageRollout ?? 100,
      killSwitch: !!dto.killSwitch,
      targetEnvironments: dto.targetEnvironments ?? [
        'production',
        'staging',
        'development',
      ],
    };

    const flag = await this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.upsert({
        where: { companyId_key: { companyId: targetCompanyId, key: dto.key } },
        update: {
          name: dto.name,
          description: dto.description,
          isEnabled: dto.isEnabled ?? false,
          rules: rules as any,
        },
        create: {
          companyId: targetCompanyId,
          key: dto.key,
          name: dto.name,
          description: dto.description || dto.key,
          isEnabled: dto.isEnabled ?? false,
          rules: rules as any,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:feature_flag:upsert',
      entity: 'FeatureFlag',
      entityId: flag.id,
      userId: adminUserId,
      companyId: targetCompanyId,
      details: { dto, rules },
    });

    return flag;
  }

  async updateFlag(
    companyId: string,
    flagId: string,
    dto: UpdateEnterpriseFlagDto,
    adminUserId: string,
  ) {
    const flag = await this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.findFirst({
        where: { id: flagId, OR: [{ companyId }, { companyId: 'GLOBAL' }] },
      }),
    );
    if (!flag) throw new NotFoundException(`Feature flag ${flagId} not found`);

    const currentRules = (flag.rules || {}) as Record<string, any>;
    const updatedRules = {
      ...currentRules,
      percentageRollout:
        dto.percentageRollout ?? currentRules.percentageRollout ?? 100,
      killSwitch: dto.killSwitch ?? currentRules.killSwitch ?? false,
      targetEnvironments: dto.targetEnvironments ??
        currentRules.targetEnvironments ?? [
          'production',
          'staging',
          'development',
        ],
    };

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.featureFlag.update({
        where: { id: flagId },
        data: {
          isEnabled: dto.isEnabled ?? flag.isEnabled,
          rules: updatedRules as any,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:feature_flag:update',
      entity: 'FeatureFlag',
      entityId: flagId,
      userId: adminUserId,
      companyId: flag.companyId,
      details: { dto },
    });

    return updated;
  }

  async triggerKillSwitch(
    companyId: string,
    flagId: string,
    adminUserId: string,
  ) {
    return this.updateFlag(
      companyId,
      flagId,
      { isEnabled: false, killSwitch: true },
      adminUserId,
    );
  }
}
