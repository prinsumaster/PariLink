import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parse } from 'json2csv';
import * as archiver from 'archiver';
import * as crypto from 'crypto';
import { Response } from 'express';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async exportCompanyData(
    companyId: string,
    modules: string[],
    format: string,
    res: Response,
  ) {
    this.logger.log(
      `Starting enterprise export for company ${companyId}, modules: ${modules.join(',')}`,
    );

    const exportData: Record<string, any[]> = {};

    // Enforce tenant isolation via Prisma runAsTenant where applicable, or explicit where checks
    if (modules.includes('Fleet')) {
      exportData.vehicles = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.vehicle.findMany({
            where: { companyId },
            take: 10000,
          }),
      );
    }
    if (modules.includes('Drivers')) {
      exportData.drivers = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.driver.findMany({
            where: { companyId },
            take: 10000,
          }),
      );
    }
    if (modules.includes('Customers')) {
      exportData.customers = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.customer.findMany({
            where: { companyId },
            take: 10000,
          }),
      );
    }
    if (modules.includes('Loads')) {
      exportData.loads = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.findMany({
          where: { companyId },
          take: 10000,
        }),
      );
    }
    if (modules.includes('Trips')) {
      exportData.trips = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.findMany({
          where: { companyId },
          take: 10000,
        }),
      );
    }
    if (modules.includes('Invoices')) {
      exportData.invoices = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.invoice.findMany({
            where: { companyId },
            take: 10000,
          }),
      );
    }
    if (modules.includes('AuditLogs')) {
      exportData.auditLogs = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.auditLog.findMany({
            where: { companyId },
            take: 10000,
          }),
      );
    }

    if (format.toLowerCase() === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="parilink_export_${companyId}.json"`,
      );
      return res.send(exportData);
    }

    if (format.toLowerCase() === 'csv') {
      const archive = (archiver as any)('zip', { zlib: { level: 9 } });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="parilink_export_${companyId}.zip"`,
      );

      archive.pipe(res);

      for (const [key, data] of Object.entries(exportData)) {
        if (data.length > 0) {
          try {
            const csv = parse(data);
            archive.append(csv, { name: `${key}.csv` });
          } catch (err) {
            this.logger.error(`Error parsing CSV for ${key}`, err);
          }
        }
      }

      await archive.finalize();
      return;
    }

    throw new BadRequestException(`Unsupported export format: ${format}`);
  }
}
