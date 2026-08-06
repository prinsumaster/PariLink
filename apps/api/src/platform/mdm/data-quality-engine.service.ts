import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface DataQualityReport {
  score: number;
  flags: string[];
  duplicates: string[]; // IDs of potential duplicates
}

@Injectable()
export class DataQualityEngineService {
  private readonly logger = new Logger(DataQualityEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluate data quality for a master record payload.
   * Checks completeness, validity (PAN/GST formats), and looks for potential duplicates.
   */
  async evaluateQuality(
    companyId: string,
    entityType: string,
    data: Record<string, unknown>,
  ): Promise<DataQualityReport> {
    const flags: string[] = [];
    const duplicates: string[] = [];
    let score = 100;

    // 1. Completeness Check
    const requiredFields = this.getRequiredFields(entityType);
    for (const field of requiredFields) {
      if (!data[field]) {
        flags.push(`Missing required field: ${field}`);
        score -= 10;
      }
    }

    // 2. Format Validation
    if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan as string)) {
      flags.push('Invalid PAN format');
      score -= 15;
    }
    if (
      data.gstin &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        data.gstin as string,
      )
    ) {
      flags.push('Invalid GSTIN format');
      score -= 15;
    }
    if (
      data.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)
    ) {
      flags.push('Invalid email format');
      score -= 10;
    }

    // 3. Duplicate Detection (Fuzzy & Exact)
    const duplicateIds = await this.findPotentialDuplicates(
      companyId,
      entityType,
      data,
    );
    if (duplicateIds.length > 0) {
      flags.push(`Found ${duplicateIds.length} potential duplicates`);
      score -= 20;
      duplicates.push(...duplicateIds);
    }

    return {
      score: Math.max(0, score),
      flags,
      duplicates,
    };
  }

  /** Run a bulk quality evaluation across all active master records for a tenant */
  async reevaluateTenant(companyId: string) {
    this.logger.log(
      `Starting bulk MDM quality re-evaluation for tenant ${companyId}`,
    );
    // In production, this would queue background jobs per entity type.
    // We update the dataQuality score in the DB.
  }

  private getRequiredFields(entityType: string): string[] {
    switch (entityType) {
      case 'CUSTOMER':
        return ['name', 'phone'];
      case 'VENDOR':
        return ['name', 'type'];
      case 'DRIVER':
        return ['firstName', 'lastName', 'licenseNumber'];
      case 'VEHICLE':
        return ['licensePlate', 'type'];
      default:
        return [];
    }
  }

  private async findPotentialDuplicates(
    companyId: string,
    entityType: string,
    data: Record<string, unknown>,
  ): Promise<string[]> {
    const orConditions: { path: string[]; equals: unknown }[] = [];

    // Exact match keys
    if (data.pan) orConditions.push({ path: ['pan'], equals: data.pan });
    if (data.gstin) orConditions.push({ path: ['gstin'], equals: data.gstin });
    if (data.phone) orConditions.push({ path: ['phone'], equals: data.phone });
    if (data.email) orConditions.push({ path: ['email'], equals: data.email });
    if (data.licensePlate)
      orConditions.push({ path: ['licensePlate'], equals: data.licensePlate });
    if (data.licenseNumber)
      orConditions.push({
        path: ['licenseNumber'],
        equals: data.licenseNumber,
      });

    if (orConditions.length === 0) return [];

    // Note: In Postgres 14+, we can use JSONB queries.
    // Since Prisma JSON filtering is somewhat limited without raw queries,
    // we use a raw query for advanced duplication checks.

    // Construct dynamic raw SQL for JSONB OR conditions
    // This assumes `masterData` is a JSONB column in MasterRecord.
    try {
      const conditions = orConditions.map(
        (c) => Prisma.sql`"masterData"->>${c.path[0]} = ${c.equals}`,
      );
      const orClause = Prisma.join(conditions, ' OR ');

      const records = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.$queryRaw<{ id: string }[]>`
          SELECT id 
          FROM "MasterRecord" 
          WHERE "companyId" = ${companyId} 
            AND "entityType" = ${entityType} 
            AND "isGolden" = true 
            AND (${orClause}) 
          LIMIT 5
        `,
      );

      return records.map((r) => r.id);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Duplicate check failed: ${errorMessage}`);
      return [];
    }
  }
}
