/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CrmLeadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, userId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.crmLead.create({
        data: { ...data, companyId },
      });
    });
  }

  async findAll(companyId: string, query: any) {
    const take = query.take ? parseInt(query.take, 10) : 50;
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    const where: any = { companyId };

    if (query.status) {
      where.status = query.status;
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const [items, total] = await Promise.all([
        tx.crmLead.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        tx.crmLead.count({ where }),
      ]);
      return { data: items, meta: { total, skip, take } };
    });
  }

  async findOne(companyId: string, id: string) {
    const item = await this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.crmLead.findFirst({ where: { id, companyId } });
    });
    if (!item || item.companyId !== companyId) {
      throw new NotFoundException('CrmLead not found');
    }
    return item;
  }

  async update(companyId: string, id: string, userId: string, data: any) {
    await this.findOne(companyId, id); // verify access
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.crmLead.updateMany({
        where: { id, companyId },
        data,
      });
    });
  }

  async remove(companyId: string, id: string, userId: string) {
    await this.findOne(companyId, id);
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.crmLead.deleteMany({
        where: { id, companyId },
      });
    });
  }
}
