import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExternalIdentityMappingService {
  private readonly logger = new Logger(ExternalIdentityMappingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Look up a Golden Record ID using an external system's ID.
   * Useful for API integrations (e.g. LocoNav sending telemetry for vehicle 'LOC-123')
   */
  async resolveToGoldenId(
    sourceSystem: string,
    externalId: string,
  ): Promise<string | null> {
    const extRef = await this.prisma.runAsSystem(async (tx) =>
      tx.externalReference.findUnique({
        where: {
          masterRecordId_sourceSystem: {
            // This relies on the unique compound index but Prisma handles it
            // via findFirst if we search by sourceSystem + externalId
          },
        } as any,
      }),
    );

    const ref = await this.prisma.runAsSystem(async (tx) =>
      tx.externalReference.findFirst({
        where: { sourceSystem, externalId },
        select: {
          masterRecordId: true,
          masterRecord: { select: { isGolden: true, mergedIntoId: true } },
        },
      }),
    );

    if (!ref) return null;

    // Follow merge chain if the resolved record was merged into another
    if (!ref.masterRecord.isGolden && ref.masterRecord.mergedIntoId) {
      return ref.masterRecord.mergedIntoId;
    }

    return ref.masterRecordId;
  }

  /**
   * Link an external system's ID to an existing Golden Record.
   */
  async linkExternalIdentity(
    masterRecordId: string,
    sourceSystem: string,
    externalId: string,
    priority = 0,
    rawData?: Record<string, any>,
  ) {
    const master = await this.prisma.runAsSystem(async (tx) =>
      tx.masterRecord.findUnique({
        where: { id: masterRecordId },
      }),
    );
    if (!master || !master.isGolden) {
      throw new NotFoundException('Golden record not found or has been merged');
    }

    return this.prisma.runAsSystem(async (tx) =>
      tx.externalReference.upsert({
        where: {
          masterRecordId_sourceSystem: { masterRecordId, sourceSystem },
        },
        update: {
          externalId,
          priority,
          rawData,
          lastSyncedAt: new Date(),
        },
        create: {
          masterRecordId,
          sourceSystem,
          externalId,
          priority,
          rawData,
        },
      }),
    );
  }

  /**
   * Fetch all external identities for a Golden Record.
   */
  async getLinkedIdentities(masterRecordId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.externalReference.findMany({
        where: { masterRecordId },
        orderBy: { priority: 'desc' },
      }),
    );
  }
}
