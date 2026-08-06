import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IamPolicyEngineService } from '../iam/iam-policy-engine.service';

export interface MdmSearchParams {
  companyId: string;
  entityType?: string;
  query: string;
  limit?: number;
  offset?: number;
  status?: string;
}

@Injectable()
export class MdmSearchService {
  private readonly logger = new Logger(MdmSearchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly iam: IamPolicyEngineService, // Used for Data Governance/Permissions
  ) {}

  /**
   * Enterprise fuzzy search over Golden Records.
   * Utilizes ILIKE over text-cast JSONB fields in Postgres for flexible search.
   * In a true hyper-scale production environment (100M+ records),
   * this would proxy to Elasticsearch or Algolia.
   */
  async searchMasterRecords(params: MdmSearchParams) {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const status = params.status || 'ACTIVE';

    const textSearch = `%${params.query}%`;

    try {
      // Execute raw query for fast JSONB text search
      const conditions = [
        Prisma.sql`"companyId" = ${params.companyId}`,
        Prisma.sql`"isGolden" = true`,
        Prisma.sql`"status" = ${status}`,
      ];

      if (params.entityType) {
        conditions.push(Prisma.sql`"entityType" = ${params.entityType}`);
      }

      conditions.push(Prisma.sql`"masterData"::text ILIKE ${textSearch}`);

      const where = Prisma.join(conditions, ' AND ');

      const records = await this.prisma.runAsTenant(
        params.companyId,
        (tx) =>
          tx.$queryRaw<Record<string, unknown>[]>`
          SELECT id, "entityType", "globalId", "confidenceScore", "status", "masterData"
          FROM "MasterRecord"
          WHERE ${where}
          ORDER BY "confidenceScore" DESC, "createdAt" DESC 
          LIMIT ${limit} OFFSET ${offset}
        `,
      );

      return records;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`MDM Search failed: ${errorMessage}`);
      return [];
    }
  }

  /**
   * Semantic search using AI (stub for when Vector extension is enabled)
   */
  async semanticSearch(companyId: string, query: string) {
    this.logger.warn(
      'Semantic search requested but vector embeddings are not yet generated for MasterRecords',
    );
    return [];
  }
}
