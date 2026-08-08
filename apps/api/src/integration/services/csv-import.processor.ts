import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('csv-import')
export class CsvImportProcessor {
  private readonly logger = new Logger(CsvImportProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('import-drivers')
  async handleDriverImport(job: Job) {
    const { companyId, rows, mapping } = job.data;

    if (!Array.isArray(rows)) {
      this.logger.error('Invalid payload: rows must be an array');
      return { error: 'Invalid payload' };
    }
    if (rows.length > 5000) {
      this.logger.error(`Import exceeded maximum limits: ${rows.length} rows`);
      return { error: 'Limit exceeded' };
    }

    // mapping = { "Driver Name": "name", "Phone": "phone", "License": "licenseNumber" }

    this.logger.log(
      `Processing ${rows.length} drivers for company ${companyId}`,
    );
    let successCount = 0;
    let failCount = 0;

    for (const row of rows) {
      try {
        const driver = {
          name: row[this.findKey(mapping, 'name')],
          phone: row[this.findKey(mapping, 'phone')],
          licenseNumber: row[this.findKey(mapping, 'licenseNumber')],
        };

        const driverData = {
          companyId,
          firstName: driver.name || '',
          lastName: '',
          phone: driver.phone,
          licenseNumber: driver.licenseNumber,
          status: 'AVAILABLE',
        };

        if (!driverData.firstName || !driverData.phone) {
          throw new Error('Missing required mapped fields');
        }

        await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.driver.create({ data: driverData }),
        );
        successCount++;
      } catch (err) {
        this.logger.warn(
          `Failed to import row: ${JSON.stringify(row)}. Error: ${err.message}`,
        );
        failCount++;
      }

      // Update BullMQ progress
      const progress = Math.floor(
        ((successCount + failCount) / rows.length) * 100,
      );
      await job.progress(progress);
    }

    this.logger.log(
      `Import Complete: ${successCount} Success, ${failCount} Failed.`,
    );
    return { successCount, failCount };
  }

  // Helper to reverse lookup the mapping
  private findKey(
    mapping: Record<string, string>,
    targetField: string,
  ): string {
    return (
      Object.keys(mapping).find((key) => mapping[key] === targetField) || ''
    );
  }
}
