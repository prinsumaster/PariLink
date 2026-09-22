import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { CreatePartDto } from './dto/create-part.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateTyreLogDto } from './dto/create-tyre-log.dto';
import { CreateJobPartDto } from './dto/create-job-part.dto';

@Injectable()
export class WorkshopService {
  constructor(private prisma: PrismaService) {}

  async createJobCard(companyId: string, data: CreateJobCardDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.jobCard.create({
        data: {
          ...data,
          companyId,
          status: 'OPEN',
        },
      });
    });
  }

  async getAllJobCards(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.jobCard.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' }
      });
    });
  }

  async getJobCard(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.findUnique({
        where: { id },
      });
      if (!jobCard) {
        throw new NotFoundException(`JobCard with ID ${id} not found`);
      }
      return jobCard;
    });
  }

  async getAllParts(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.part.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' }
      });
    });
  }

  async getPart(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const part = await tx.part.findUnique({
        where: { id, companyId }
      });
      if (!part) {
        throw new NotFoundException(`Part with ID ${id} not found`);
      }
      return part;
    });
  }

  async createPart(companyId: string, data: CreatePartDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.part.create({ data: { ...data, companyId } });
    });
  }

  async getAllVendors(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => tx.vendor.findMany({ where: { companyId } }));
  }

  async createVendor(companyId: string, data: CreateVendorDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.vendor.create({ data: { ...data, companyId } });
    });
  }

  async getAllTyreLogs(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => tx.tyreLog.findMany({ where: { companyId } }));
  }

  async createTyreLog(companyId: string, data: CreateTyreLogDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.tyreLog.create({ data: { ...data, companyId } });
    });
  }

  async createJobPart(companyId: string, data: CreateJobPartDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      if (data.partId) {
        const part = await tx.part.findUnique({ where: { id: data.partId } });
        if (!part) throw new NotFoundException('Part not found');
        const qtyUsed = data.qty || 1;
        if (part.quantity < qtyUsed) {
          throw new BadRequestException(`Insufficient inventory for part ${part.name}. Requested ${qtyUsed}, available ${part.quantity}.`);
        }
        await tx.part.update({
          where: { id: data.partId },
          data: { quantity: { decrement: qtyUsed } }
        });
      }
      return tx.jobPart.create({ data: { ...data, companyId } });
    });
  }

  async getAllJobParts(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => tx.jobPart.findMany({ where: { companyId } }));
  }

  async getJobPart(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobPart = await tx.jobPart.findUnique({ where: { id, companyId } });
      if (!jobPart) throw new NotFoundException(`JobPart with ID ${id} not found`);
      return jobPart;
    });
  }
}
