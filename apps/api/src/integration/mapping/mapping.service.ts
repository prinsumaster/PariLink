/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';

export interface MappingRule {
  sourceField?: string;
  targetField: string;
  defaultValue?: unknown;
  transformFn?: string;
  lookupTable?: Record<string, unknown>;
  condition?: {
    ifField: string;
    ifOperator: 'EQUALS' | 'NOT_EQUALS' | 'EXISTS' | 'CONTAINS';
    ifValue?: unknown;
  };
}

@Injectable()
export class DataMappingService {
  private readonly logger = new Logger(DataMappingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit?: AuditService,
  ) {}

  async createTemplate(
    companyId: string,
    userId: string,
    dto: {
      name: string;
      sourceEntity: string;
      targetEntity: string;
      mappingRules: MappingRule[];
      isActive?: boolean;
    },
  ) {
    if (
      !dto.name ||
      !dto.sourceEntity ||
      !dto.targetEntity ||
      !Array.isArray(dto.mappingRules)
    ) {
      throw new BadRequestException(
        'name, sourceEntity, targetEntity, and mappingRules array are required',
      );
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const template = await tx.dataMappingTemplate.create({
        data: {
          companyId,
          name: dto.name,
          sourceEntity: dto.sourceEntity,
          targetEntity: dto.targetEntity,

          mappingRules: dto.mappingRules as any,
          isActive: dto.isActive !== false,
        },
      });

      if (this.audit) {
        await this.audit.logEvent({
          companyId,
          userId,
          entity: 'DataMappingTemplate',
          entityId: template.id,
          action: 'CREATE_MAPPING_TEMPLATE',
          details: {
            name: dto.name,
            source: dto.sourceEntity,
            target: dto.targetEntity,
          },
        });
      }

      return template;
    });
  }

  async getTemplates(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dataMappingTemplate.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async getTemplate(companyId: string, templateId: string) {
    const template = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dataMappingTemplate.findUnique({
        where: { id: templateId },
      }),
    );
    if (!template || template.companyId !== companyId) {
      throw new NotFoundException('Data mapping template not found');
    }
    return template;
  }

  async previewMapping(
    companyId: string,
    templateIdOrName: string,
    sampleSourcePayload: Record<string, unknown>,
  ) {
    const template = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dataMappingTemplate.findFirst({
        where: {
          companyId,
          OR: [{ id: templateIdOrName }, { name: templateIdOrName }],
          isActive: true,
        },
      }),
    );

    if (!template) {
      throw new NotFoundException(
        `Mapping template ${templateIdOrName} not found`,
      );
    }

    const mappingRules = template.mappingRules as unknown as MappingRule[];
    const targetPayload: Record<string, unknown> = {};
    const validationWarnings: string[] = [];
    let rulesApplied = 0;
    let rulesSkipped = 0;

    for (const rule of mappingRules) {
      // Check conditional mapping
      if (
        rule.condition &&
        !this.evaluateCondition(sampleSourcePayload, rule.condition)
      ) {
        rulesSkipped++;
        continue;
      }

      let val = rule.sourceField
        ? this.getValueFromPath(sampleSourcePayload, rule.sourceField)
        : undefined;

      // Fallback to default value
      if (val === undefined && rule.defaultValue !== undefined) {
        val = rule.defaultValue;
      }

      // Apply lookup table mapping
      if (
        val !== undefined &&
        rule.lookupTable &&
        typeof rule.lookupTable === 'object'
      ) {
        const lookupKey =
          typeof val === 'object' && val !== null
            ? JSON.stringify(val)
            : `${val as any}`;
        const lookupVal = rule.lookupTable[lookupKey];
        if (lookupVal !== undefined) {
          val = lookupVal;
        } else {
          validationWarnings.push(
            `Value "${val as string}" for source field "${rule.sourceField}" not found in lookup table`,
          );
        }
      }

      // Apply transformation functions
      if (val !== undefined && rule.transformFn) {
        val = this.applyTransformation(val, rule.transformFn);
      }

      // Set to target path
      if (val !== undefined) {
        this.setValueToPath(targetPayload, rule.targetField, val);
        rulesApplied++;
      } else {
        validationWarnings.push(
          `Target field "${rule.targetField}" evaluated to undefined (no source or default value)`,
        );
      }
    }

    return {
      templateId: template.id,
      templateName: template.name,
      sourceEntity: template.sourceEntity,
      targetEntity: template.targetEntity,
      sampleSourcePayload,
      transformedPayload: targetPayload,
      rulesApplied,
      rulesSkipped,
      validationWarnings,
    };
  }

  async transformPayload(
    companyId: string,
    templateName: string,
    sourcePayload: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const res = await this.previewMapping(
      companyId,
      templateName,
      sourcePayload,
    );
    return res.transformedPayload;
  }

  private evaluateCondition(
    obj: Record<string, unknown>,
    cond: { ifField: string; ifOperator: string; ifValue?: unknown },
  ): boolean {
    const val = this.getValueFromPath(obj, cond.ifField);
    switch (cond.ifOperator) {
      case 'EXISTS':
        return val !== undefined && val !== null;
      case 'EQUALS':
        return val === cond.ifValue;
      case 'NOT_EQUALS':
        return val !== cond.ifValue;
      case 'CONTAINS':
        return String((val as string) ?? '').includes(
          String((cond.ifValue as string) ?? ''),
        );
      default:
        return true;
    }
  }

  private getValueFromPath(
    obj: Record<string, unknown>,
    path: string,
  ): unknown {
    if (!path) return undefined;
    return path
      .split('.')
      .reduce(
        (acc: any, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        obj,
      );
  }

  private setValueToPath(
    obj: Record<string, unknown>,
    path: string,
    value: unknown,
  ) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }

  private applyTransformation(value: unknown, transformFn: string): unknown {
    switch (transformFn) {
      case 'UPPERCASE':
        return String(value).toUpperCase();
      case 'LOWERCASE':
        return String(value).toLowerCase();
      case 'TO_INT':
        return parseInt(String(value), 10);
      case 'TO_FLOAT':
        return parseFloat(String(value));
      case 'ISO_DATE':
        return new Date(value as string | number).toISOString();
      case 'BOOLEAN':
        return value === 'true' || value === true || value === 1;
      case 'TRIM':
        return String(value).trim();
      case 'STRINGIFY':
        return typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : String(value);
      default:
        return value;
    }
  }
}
