import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../events/event.service';
import { AuditService } from '../audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

export interface SurvivorshipRule {
  field: string;
  strategy: 'LATEST' | 'MOST_FREQUENT' | 'TRUSTED_SOURCE' | 'MANUAL';
  trustedSource?: string;
}

@Injectable()
export class GoldenRecordEngineService {
  private readonly logger = new Logger(GoldenRecordEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly audit: AuditService,
  ) {}

  /** Create a new Golden Record for an entity */
  async createGoldenRecord(
    companyId: string,
    entityType: string,
    masterData: Record<string, unknown>,
    sourceSystem: string,
    userId?: string,
  ) {
    const globalId = `MDM-${entityType}-${uuidv4()}`;

    const record = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.masterRecord.create({
        data: {
          companyId,
          entityType,
          globalId,
          isGolden: true,
          confidenceScore: 1.0,
          status: 'ACTIVE',
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          masterData: masterData as object,
          externalRefs: {
            create: {
              sourceSystem,
              externalId: (masterData.id as string) || globalId,
              priority: 100,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              rawData: masterData as object,
            },
          },
          changeHistory: {
            create: {
              userId,
              sourceSystem,
              action: 'CREATE',
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              changes: masterData as object,
            },
          },
          dataQuality: {
            create: {
              overallScore: 100,
              completeness: 100,
              accuracy: 100,
              uniqueness: 100,
              consistency: 100,
            },
          },
        },
      }),
    );

    this.events.publish(`mdm.${entityType.toLowerCase()}.created`, {
      tenantId: companyId,
      payload: {
        masterRecordId: record.id,
        globalId,
        data: masterData,
      },
    });

    return record;
  }

  /** Merge a duplicate record into a primary Golden Record */
  async mergeRecords(
    companyId: string,
    primaryId: string,
    duplicateId: string,
    survivorshipRules: SurvivorshipRule[],
    userId?: string,
  ) {
    if (primaryId === duplicateId) {
      throw new ConflictException('Cannot merge a record into itself');
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const primary = await tx.masterRecord.findUnique({
        where: { id: primaryId },
      });
      const duplicate = await tx.masterRecord.findUnique({
        where: { id: duplicateId },
      });

      if (!primary || !duplicate) {
        throw new NotFoundException('Master records not found');
      }

      if (primary.entityType !== duplicate.entityType) {
        throw new ConflictException(
          'Cannot merge records of different entity types',
        );
      }

      // 1. Apply survivorship rules to construct merged master data
      const mergedData = this.applySurvivorship(
        primary.masterData as Record<string, unknown>,
        duplicate.masterData as Record<string, unknown>,
        survivorshipRules,
      );

      // 2. Update Primary Record
      const updatedPrimary = await tx.masterRecord.update({
        where: { id: primaryId },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          masterData: mergedData as object,
          changeHistory: {
            create: {
              userId,
              action: 'MERGE',
              changes: {
                mergedFrom: duplicateId,

                priorData: primary.masterData as object,
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                newData: mergedData as object,
              },
            },
          },
        },
      });

      // 3. Mark Duplicate as MERGED
      await tx.masterRecord.update({
        where: { id: duplicateId },
        data: {
          isGolden: false,
          status: 'MERGED',
          mergedIntoId: primaryId,
          changeHistory: {
            create: {
              userId,
              action: 'MERGED_INTO',
              changes: { mergedInto: primaryId },
            },
          },
        },
      });

      // 4. Re-parent external references
      await tx.externalReference.updateMany({
        where: { masterRecordId: duplicateId },
        data: { masterRecordId: primaryId },
      });

      this.events.publish(`mdm.${primary.entityType.toLowerCase()}.merged`, {
        tenantId: companyId,
        payload: {
          primaryId,
          duplicateId,
          mergedData,
        },
      });

      this.audit.logEvent({
        action: 'MDM_RECORD_MERGED',
        entity: 'MasterRecord',
        entityId: primaryId,
        companyId,
        userId,
        details: { duplicateId, entityType: primary.entityType },
      });

      return updatedPrimary;
    });
  }

  private applySurvivorship(
    primary: Record<string, unknown>,
    duplicate: Record<string, unknown>,
    rules: SurvivorshipRule[],
  ): Record<string, unknown> {
    const merged = { ...primary };

    for (const rule of rules) {
      if (rule.strategy === 'LATEST') {
        // Fallback: assume primary is latest for now unless metadata exists
        merged[rule.field] = duplicate[rule.field] || primary[rule.field];
      } else if (rule.strategy === 'MANUAL' && duplicate[rule.field]) {
        merged[rule.field] = duplicate[rule.field]; // In manual mode, we explicitly provide rules to override
      }
      // Expand strategies in V2 (TRUSTED_SOURCE, etc)
    }

    return merged;
  }
}
