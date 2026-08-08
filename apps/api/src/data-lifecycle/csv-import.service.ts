import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';

const driverSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(1),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid international phone format'),
  licenseNumber: z.string().min(5),
});

@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importDriversTransactional(companyId: string, rows: any[]) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('Rows must be a non-empty array');
    }
    if (rows.length > 5000) {
      throw new BadRequestException(
        'Maximum import limit exceeded (5000 rows)',
      );
    }
    this.logger.log(
      `Starting transactional import of ${rows.length} drivers for company ${companyId}`,
    );

    const validDrivers: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const parsed = driverSchema.safeParse(row);
      if (!parsed.success) {
        errors.push({ row: i + 1, error: parsed.error.issues });
      } else {
        validDrivers.push(parsed.data);
      }
    }

    if (errors.length > 0) {
      this.logger.warn(
        `Import failed. Found ${errors.length} validation errors.`,
      );
      return { success: false, errors };
    }

    try {
      // Perform ACID transaction with Batch Optimization (O(1) Queries)
      await this.prisma.$transaction(async (tx) => {
        const licenseNumbers = validDrivers.map((d) => d.licenseNumber);
        const existingDrivers = await tx.driver.findMany({
          where: {
            companyId,
            licenseNumber: { in: licenseNumbers },
          },
          select: { licenseNumber: true },
        });

        if (existingDrivers.length > 0) {
          const duplicates = existingDrivers
            .map((d) => d.licenseNumber)
            .join(', ');
          throw new Error(`Duplicate licenses detected: ${duplicates}`);
        }

        const createPayloads = validDrivers.map((driver) => ({
          ...driver,
          companyId,
          status: 'AVAILABLE',
        }));

        await tx.driver.createMany({
          data: createPayloads,
          skipDuplicates: false,
        });
      });
      this.logger.log(
        `Successfully imported ${validDrivers.length} drivers in batch mode.`,
      );
      return { success: true, count: validDrivers.length };
    } catch (error: any) {
      this.logger.error(
        'Import transaction rolled back due to duplicate logic',
        error,
      );
      return { success: false, rollback: true, message: error.message };
    }
  }
}
