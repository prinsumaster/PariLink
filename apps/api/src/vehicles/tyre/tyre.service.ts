import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class TyreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async createTyre(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tyre = await tx.tyre.create({
        data: {
          companyId,
          brand: data.brand,
          modelName: data.modelName,
          serialNumber: data.serialNumber,
          size: data.size,
          type: data.type,
          purchaseDate: data.purchaseDate,
          purchaseCost: data.purchaseCost,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Tyre',
          entityType: 'Tyre',
          entityId: tyre.id,
          action: 'CREATE',
          details: { serialNumber: tyre.serialNumber },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TYRE',
        streamId: tyre.id,
        eventType: 'TyreCreated',
        payload: { serialNumber: tyre.serialNumber },
        userId,
      });

      return tyre;
    });
  }

  async getTyres(companyId: string, status?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (status) where.status = status;
      return tx.tyre.findMany({ where });
    });
  }

  async installTyre(
    companyId: string,
    tyreId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tyre = await tx.tyre.update({
        where: { id: tyreId, companyId },
        data: {
          status: 'INSTALLED',
          currentVehicleId: data.vehicleId,
          currentPosition: data.position,
          installedOdo: data.odometer,
        },
      });

      await tx.tyreLog.create({
        data: {
          companyId,
          tyreId,
          vehicleId: data.vehicleId,
          action: 'INSTALLED',
          newPosition: data.position,
          odometer: data.odometer,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Tyre',
          entityType: 'Tyre',
          entityId: tyre.id,
          action: 'INSTALL',
          details: { vehicleId: data.vehicleId, position: data.position },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TYRE',
        streamId: tyre.id,
        eventType: 'TyreInstalled',
        payload: { vehicleId: data.vehicleId, position: data.position },
        userId,
      });

      return tyre;
    });
  }

  async rotateTyre(
    companyId: string,
    tyreId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tyre = await tx.tyre.findUnique({
        where: { id: tyreId, companyId },
      });
      if (!tyre) throw new NotFoundException('Tyre not found');

      const updated = await tx.tyre.update({
        where: { id: tyreId, companyId },
        data: {
          currentPosition: data.newPosition,
        },
      });

      await tx.tyreLog.create({
        data: {
          companyId,
          tyreId,
          vehicleId: tyre.currentVehicleId,
          action: 'ROTATED',
          oldPosition: tyre.currentPosition,
          newPosition: data.newPosition,
          odometer: data.odometer,
          treadDepthMm: data.treadDepthMm,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Tyre',
          entityType: 'Tyre',
          entityId: tyre.id,
          action: 'ROTATE',
          details: {
            oldPosition: tyre.currentPosition,
            newPosition: data.newPosition,
          },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TYRE',
        streamId: tyre.id,
        eventType: 'TyreRotated',
        payload: {
          oldPosition: tyre.currentPosition,
          newPosition: data.newPosition,
        },
        userId,
      });

      return updated;
    });
  }

  async scrapTyre(
    companyId: string,
    tyreId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tyre = await tx.tyre.update({
        where: { id: tyreId, companyId },
        data: {
          status: 'SCRAPPED',
          scrapValue: data.scrapValue,
          currentVehicleId: null,
          currentPosition: null,
          removedOdo: data.odometer,
        },
      });

      await tx.tyreLog.create({
        data: {
          companyId,
          tyreId,
          action: 'SCRAPPED',
          odometer: data.odometer,
          reason: data.reason,
          cost: data.scrapValue,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Tyre',
          entityType: 'Tyre',
          entityId: tyre.id,
          action: 'SCRAP',
          details: { reason: data.reason, cost: data.scrapValue },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'TYRE',
        streamId: tyre.id,
        eventType: 'TyreScrapped',
        payload: { reason: data.reason, cost: data.scrapValue },
        userId,
      });

      return tyre;
    });
  }
}
