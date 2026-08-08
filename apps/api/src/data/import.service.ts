import { AuditService } from '../platform/audit/audit.service';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  async importData(
    companyId: string,
    moduleType: string,
    data: any[],
    userId: string,
  ) {
    this.logger.log(
      `Starting enterprise import for company ${companyId}, module: ${moduleType}`,
    );

    // Enterprise safeguards: Rollback on failure, limit to 1000 rows
    if (data.length > 1000) {
      throw new BadRequestException(
        'Import payload exceeds maximum allowed size of 1000 records per batch.',
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        let importedCount = 0;
        if (moduleType === 'Customers') {
          const customersToCreate = data.map((record) => ({
            companyId,
            name: record.name,
            email: record.email,
            phone: record.phone,
            status: 'ACTIVE',
          }));

          const result = await tx.customer.createMany({
            data: customersToCreate,
            skipDuplicates: true,
          });
          importedCount = result.count;
        }

        // Log Audit Event
        await this.auditService.logEvent(
          {
            companyId,
            userId,
            action: 'BULK_IMPORT',
            entity: moduleType,
            entityId: 'BATCH',
            details: { recordCount: importedCount },
          },
          null,
          tx,
        );

        return { success: true, importedCount };
      });
    } catch (error) {
      this.logger.error('Import transaction failed, rolling back.', error);
      throw new BadRequestException(
        'Import failed due to validation or integrity errors.',
      );
    }
  }
}
