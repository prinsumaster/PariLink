import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AsyncParser } from 'json2csv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExportsService {
  constructor(private prisma: PrismaService) {}

  async generateExport(companyId: string, userId: string, entityType: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Create pending export record
      const exportRecord = await tx.fileExport.create({
        data: {
          companyId,
          userId,
          type: 'CSV',
          entityType,
          status: 'PROCESSING',
        },
      });

      // Process export asynchronously
      this.processExportAsync(
        companyId,
        userId,
        exportRecord.id,
        entityType,
      ).catch((e) => console.error(e));

      return exportRecord;
    });
  }

  private async processExportAsync(
    companyId: string,
    userId: string,
    exportId: string,
    entityType: string,
  ) {
    try {
      let data = [];
      if (entityType === 'Loads') {
        data = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.load.findMany({ where: { companyId } }),
        );
      } else if (entityType === 'Customers') {
        data = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.customer.findMany({ where: { companyId } }),
        );
      } else if (entityType === 'Trips') {
        data = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.findMany({ where: { companyId } }),
        );
      } else if (entityType === 'Invoices') {
        data = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.invoice.findMany({ where: { companyId } }),
        );
      } else {
        throw new Error('Unsupported entity type for export');
      }

      if (data.length === 0) {
        throw new Error('No data found to export');
      }

      // Generate CSV
      const { Parser } = require('json2csv');
      const parser = new Parser();
      const csv = parser.parse(data);

      const fileName = `${entityType}_Export_${new Date().getTime()}.csv`;
      const fileUrl = `/uploads/${fileName}`; // In real app, upload to S3

      // Simulate writing file (In dev, we mock this for now to avoid dealing with temp dirs or just return the record)
      // For this implementation, we assume we just update the record with the generated CSV data or a mock URL

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.fileExport.update({
          where: { id: exportId },
          data: {
            status: 'COMPLETED',
            fileUrl,
            fileName,
            sizeBytes: Buffer.byteLength(csv, 'utf8'),
            completedAt: new Date(),
          },
        }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.fileExport.update({
          where: { id: exportId },
          data: {
            status: 'FAILED',
            error: errorMessage,
            completedAt: new Date(),
          },
        }),
      );
    }
  }

  async getExports(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.fileExport.findMany({
        where: { companyId, userId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }
}
