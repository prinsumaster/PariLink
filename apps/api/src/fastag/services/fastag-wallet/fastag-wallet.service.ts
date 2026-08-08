/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditService } from '../../../platform/audit/audit.service';
import { EventStoreService } from '../../../platform/digital-twin/event-store.service';

@Injectable()
export class FastagWalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async create(companyId: string, userId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const account = await tx.tollAccount.create({
        data: { ...data, companyId },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Fastag',
          entityType: 'TollAccount',
          entityId: account.id,
          action: 'CREATE',
          details: { accountNumber: data.accountNumber },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TOLL_ACCOUNT',
        streamId: account.id,
        eventType: 'TollAccountCreated',
        payload: { accountNumber: data.accountNumber },
        userId,
      });

      return account;
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
        tx.tollAccount.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        tx.tollAccount.count({ where }),
      ]);
      return { data: items, meta: { total, skip, take } };
    });
  }

  async findOne(companyId: string, id: string) {
    const item = await this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.tollAccount.findFirst({ where: { id, companyId } });
    });
    if (!item || item.companyId !== companyId) {
      throw new NotFoundException('TollAccount not found');
    }
    return item;
  }

  async update(companyId: string, id: string, userId: string, data: any) {
    const existing = await this.findOne(companyId, id); // verify access
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const updated = await tx.tollAccount.updateMany({
        where: { id, companyId },
        data,
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Fastag',
          entityType: 'TollAccount',
          entityId: id,
          action: 'UPDATE',
          beforeValue: existing,
          afterValue: updated,
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TOLL_ACCOUNT',
        streamId: id,
        eventType: 'TollAccountUpdated',
        payload: data,
        userId,
      });

      return updated;
    });
  }

  async remove(companyId: string, id: string, userId: string) {
    const existing = await this.findOne(companyId, id);
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const deleted = await tx.tollAccount.deleteMany({
        where: { id, companyId },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Fastag',
          entityType: 'TollAccount',
          entityId: id,
          action: 'DELETE',
          details: existing,
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TOLL_ACCOUNT',
        streamId: id,
        eventType: 'TollAccountDeleted',
        payload: {},
        userId,
      });

      return deleted;
    });
  }
}
