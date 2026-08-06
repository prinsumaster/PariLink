import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';

@Injectable()
export class ImportExportService {
  private readonly logger = new Logger(ImportExportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async previewImport(
    companyId: string,
    entityType: string,
    format: string,
    rows: Record<string, unknown>[],
  ) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('Rows must be a non-empty array');
    }

    const validRows: Record<string, unknown>[] = [];
    const errorRows: Record<string, unknown>[] = [];
    const duplicateRows: Record<string, unknown>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      if (entityType === 'INVOICE') {
        if (!row.invoiceNumber || row.amount === undefined) {
          errorRows.push({
            row: rowNum,
            data: row,
            error: 'Missing required field: invoiceNumber or amount',
          });
          continue;
        }
        const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.invoice.findFirst({
            where: { companyId, invoiceNumber: String(row.invoiceNumber) },
          }),
        );
        if (existing) {
          duplicateRows.push({
            row: rowNum,
            data: row,
            existingId: existing.id,
            error: `Duplicate invoice number ${row.invoiceNumber as string}`,
          });
          continue;
        }
      } else if (entityType === 'DRIVER') {
        if ((!row.firstName && !row.name) || !row.licenseNumber) {
          errorRows.push({
            row: rowNum,
            data: row,
            error: 'Missing required field: firstName/name or licenseNumber',
          });
          continue;
        }
        const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.driver.findFirst({
            where: { companyId, licenseNumber: String(row.licenseNumber) },
          }),
        );
        if (existing) {
          duplicateRows.push({
            row: rowNum,
            data: row,
            existingId: existing.id,
            error: `Duplicate license number ${row.licenseNumber as string}`,
          });
          continue;
        }
      } else if (entityType === 'VEHICLE') {
        if (!row.licensePlate) {
          errorRows.push({
            row: rowNum,
            data: row,
            error: 'Missing required field: licensePlate',
          });
          continue;
        }
        const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.vehicle.findFirst({
            where: { companyId, licensePlate: String(row.licensePlate) },
          }),
        );
        if (existing) {
          duplicateRows.push({
            row: rowNum,
            data: row,
            existingId: existing.id,
            error: `Duplicate license plate ${row.licensePlate as string}`,
          });
          continue;
        }
      }

      validRows.push({ row: rowNum, data: row });
    }

    return {
      entityType,
      format: format.toUpperCase(),
      totalRows: rows.length,
      validCount: validRows.length,
      errorCount: errorRows.length,
      duplicateCount: duplicateRows.length,
      validRows,
      errorRows,
      duplicateRows,
    };
  }

  async executeImport(
    companyId: string,
    userId: string,
    entityType: string,
    format: string,
    rows: Record<string, unknown>[],
    rollbackOnError: boolean = true,
  ) {
    const preview = await this.previewImport(
      companyId,
      entityType,
      format,
      rows,
    );

    if (rollbackOnError && preview.errorCount > 0) {
      throw new BadRequestException({
        message:
          'Import aborted due to validation errors (rollbackOnError=true)',
        errorCount: preview.errorCount,
        errorRows: preview.errorRows,
      });
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const job = await tx.backgroundJob.create({
        data: {
          companyId,
          userId,
          type: 'IMPORT',
          status: 'PROCESSING',
          progress: 0,
          metadata: { entityType, format, totalRows: rows.length },
          startedAt: new Date(),
        },
      });

      let importedCount = 0;
      const createdIds: string[] = [];

      try {
        let defaultCustomer: Awaited<
          ReturnType<typeof tx.customer.findFirst>
        > | null = null;
        if (entityType === 'INVOICE') {
          defaultCustomer = await tx.customer.findFirst({
            where: { companyId },
          });
          if (!defaultCustomer) {
            defaultCustomer = await tx.customer.create({
              data: {
                companyId,
                name: 'Default Import Customer',
                status: 'ACTIVE',
              },
            });
          }
        }

        for (const item of preview.validRows) {
          const rowData = item.data as Record<string, unknown>;
          if (entityType === 'INVOICE') {
            const inv = await tx.invoice.create({
              data: {
                companyId,
                customerId: (rowData.customerId ??
                  defaultCustomer!.id) as string,
                invoiceNumber: String(rowData.invoiceNumber),
                amount: Number(rowData.amount),
                status: (rowData.status ?? 'DRAFT') as string,
                notes: `Imported via job ${job.id}`,
              },
            });
            createdIds.push(inv.id);
          } else if (entityType === 'DRIVER') {
            const parts = String(
              (rowData.name as string | undefined) ??
                (rowData.firstName as string | undefined) ??
                'Unknown Driver',
            )
              .trim()
              .split(' ');
            const firstName = (rowData.firstName ?? parts[0]) as string;
            const lastName = (rowData.lastName ??
              (parts.length > 1
                ? parts.slice(1).join(' ')
                : 'Driver')) as string;
            const drv = await tx.driver.create({
              data: {
                companyId,
                firstName: firstName,
                lastName: lastName,
                licenseNumber: String(rowData.licenseNumber),
                phone: (rowData.phone ?? null) as string | null,
                status: (rowData.status ?? 'AVAILABLE') as string,
              },
            });
            createdIds.push(drv.id);
          } else if (entityType === 'VEHICLE') {
            const veh = await tx.vehicle.create({
              data: {
                companyId,
                licensePlate: String(rowData.licensePlate),
                make: (rowData.make ?? 'GENERIC') as string,
                model: (rowData.model ?? 'TRUCK') as string,
                status: (rowData.status ?? 'IN_SERVICE') as string,
              },
            });
            createdIds.push(veh.id);
          }
          importedCount++;
        }

        const completedJob = await tx.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            progress: 100,
            result: {
              importedCount,
              createdIds,
              errorCount: preview.errorCount,
            },
            completedAt: new Date(),
          },
        });

        await this.audit.logEvent({
          companyId,
          userId,
          entity: 'BackgroundJob',
          entityId: job.id,
          action: 'EXECUTE_BULK_IMPORT',
          details: {
            entityType,
            importedCount,
            createdIdsCount: createdIds.length,
          },
        });

        return completedJob;
      } catch (err: unknown) {
        const importErr = err as Error;
        this.logger.error(`Import job ${job.id} failed: ${importErr.message}`);
        const failedJob = await tx.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: 'FAILED',
            error: importErr.message,
            completedAt: new Date(),
          },
        });
        if (rollbackOnError) throw err;
        return failedJob;
      }
    });
  }

  async executeExport(
    companyId: string,
    userId: string,
    entityType: string,
    format: string,
    filter?: Record<string, unknown>,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const job = await tx.backgroundJob.create({
        data: {
          companyId,
          userId,
          type: 'EXPORT',
          status: 'PROCESSING',
          progress: 50,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metadata: { entityType, format, filter: filter || {} } as any,
          startedAt: new Date(),
        },
      });

      let records: Record<string, unknown>[] = [];
      if (entityType === 'INVOICE') {
        records = await tx.invoice.findMany({
          where: { companyId },
          take: 1000,
        });
      } else if (entityType === 'DRIVER') {
        records = await tx.driver.findMany({
          where: { companyId },
          take: 1000,
        });
      } else if (entityType === 'VEHICLE') {
        records = await tx.vehicle.findMany({
          where: { companyId },
          take: 1000,
        });
      } else if (entityType === 'TRIP') {
        records = await tx.trip.findMany({ where: { companyId }, take: 1000 });
      }

      let exportData: string | Record<string, unknown>[] = records;
      const fmt = format.toUpperCase();

      if (fmt === 'CSV') {
        if (records.length > 0) {
          const headers = Object.keys(records[0]).join(',');
          const rows = records.map((r) =>
            Object.values(r)
              .map(
                (val) =>
                  `"${val instanceof Date ? val.toISOString() : typeof val === 'object' && val !== null ? JSON.stringify(val).replace(/"/g, '""') : String(val as string)}"`,
              )
              .join(','),
          );
          exportData = [headers, ...rows].join('\n');
        } else {
          exportData = '';
        }
      } else if (fmt === 'XML') {
        const xmlRows = records
          .map(
            (r) =>
              `<${entityType.toLowerCase()}>` +
              Object.entries(r)
                .map(
                  ([k, v]) =>
                    `<${k}>${v instanceof Date ? v.toISOString() : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v as string)}</${k}>`,
                )
                .join('') +
              `</${entityType.toLowerCase()}>`,
          )
          .join('\n');
        exportData = `<?xml version="1.0" encoding="UTF-8"?>\n<export total="${records.length}">\n${xmlRows}\n</export>`;
      }

      const completedJob = await tx.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          progress: 100,

          result: {
            recordCount: records.length,
            format: fmt,
            payload: exportData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          completedAt: new Date(),
        },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'BackgroundJob',
        entityId: job.id,
        action: 'EXECUTE_BULK_EXPORT',
        details: { entityType, recordCount: records.length, format: fmt },
      });

      return completedJob;
    });
  }

  async getJobStatus(companyId: string, jobId: string) {
    const job = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.backgroundJob.findUnique({
        where: { id: jobId },
      }),
    );
    if (!job || job.companyId !== companyId) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async listJobs(companyId: string, type?: string) {
    const where: Partial<{ companyId: string; type: string }> = { companyId };
    if (type) where.type = type.toUpperCase();
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.backgroundJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    );
  }
}
