import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShareLorryReceiptDto } from './dto/share-lorry-receipt.dto';

@Injectable()
export class LorryReceiptsService {
  constructor(private prisma: PrismaService) {}

  async share(companyId: string, id: string, dto: ShareLorryReceiptDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt with ID ${id} not found`);
      }

      if (dto.driverId) {
        const driver = await tx.driver.findFirst({ where: { id: dto.driverId, companyId } });
        if (!driver) throw new NotFoundException('Driver not found in tenant');
      }

      return tx.lorryReceipt.update({
        where: { id },
        data: {
          driverId: dto.driverId,
          status: 'SHARED',
        },
      });
    });
  }

  async findAll(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.lorryReceipt.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
        include: { trip: true, driver: true, vehicle: true },
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt not found`);
      }
      return lr;
    });
  }

  async generatePdf(companyId: string, id: string): Promise<any> {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
        include: {
          trip: true,
          driver: true,
          vehicle: true,
          company: true,
        },
      });

      if (!lr) {
        throw new NotFoundException('Lorry Receipt not found');
      }

      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50 });

      doc
        .fontSize(20)
        .text('LORRY RECEIPT / BILTY', { align: 'center' })
        .moveDown();

      doc.fontSize(10).text(`Company: ${lr.company.name}`);
      doc.text(`LR Number: ${lr.lrNumber}`);
      doc.text(`Date: ${lr.createdAt.toDateString()}`);
      doc.moveDown();

      doc.text(`Consignor: ${lr.consignorName}`);
      doc.text(`Consignee: ${lr.consigneeName}`);
      doc.moveDown();

      doc.text(`Vehicle: ${lr.vehicle?.licensePlate || 'N/A'}`);
      doc.text(`Driver: ${lr.driver?.firstName} ${lr.driver?.lastName || ''}`);
      doc.moveDown();

      doc.text(`Product: ${lr.product}`);
      doc.text(`Gross Weight: ${lr.grossWeight} kg`);
      doc.text(`Tare Weight: ${lr.tareWeight} kg`);
      doc.text(`Net Weight: ${lr.netWeight} kg`);
      doc.moveDown();

      doc.end();

      return doc;
    });
  }
}
