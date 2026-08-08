import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class FuelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async createFuelCard(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const card = await tx.fuelCard.create({
        data: {
          companyId,
          cardNumber: data.cardNumber,
          provider: data.provider,
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          dailyLimit: data.dailyLimit,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Fuel',
          entityType: 'FuelCard',
          entityId: card.id,
          action: 'CREATE',
          details: { cardNumber: card.cardNumber },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'FUEL_CARD',
        streamId: card.id,
        eventType: 'FuelCardCreated',
        payload: { cardNumber: card.cardNumber },
        userId,
      });

      return card;
    });
  }

  async getFuelCards(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.fuelCard.findMany({ where: { companyId } }),
    );
  }

  async createFuelStation(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const station = await tx.fuelStation.create({
        data: {
          companyId,
          name: data.name,
          network: data.network,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          isPreferred: data.isPreferred || false,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Fuel',
          entityType: 'FuelStation',
          entityId: station.id,
          action: 'CREATE',
          details: { name: station.name },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'FUEL_STATION',
        streamId: station.id,
        eventType: 'FuelStationCreated',
        payload: { name: station.name },
        userId,
      });

      return station;
    });
  }

  async getFuelStations(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.fuelStation.findMany({ where: { companyId } }),
    );
  }

  async logFuelTransaction(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Basic anomaly check: > 100 gallons or cost > 500
      let anomalyDetected = false;
      if (data.gallons > 100 || data.totalCost > 500) {
        anomalyDetected = true;
      }

      const txRecord = await tx.fuelTransaction.create({
        data: {
          companyId,
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          fuelCardId: data.fuelCardId,
          stationName: data.stationName,
          gallons: data.gallons,
          totalCost: data.totalCost,
          pricePerGallon: data.pricePerGallon,
          odometer: data.odometer,
          anomalyDetected,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Fuel',
          entityType: 'FuelTransaction',
          entityId: txRecord.id,
          action: 'CREATE',
          details: { gallons: txRecord.gallons, totalCost: txRecord.totalCost },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'FUEL_TRANSACTION',
        streamId: txRecord.id,
        eventType: 'FuelTransactionLogged',
        payload: {
          gallons: txRecord.gallons,
          totalCost: txRecord.totalCost,
          anomalyDetected,
        },
        userId,
      });

      return txRecord;
    });
  }

  async getFuelTransactions(companyId: string, vehicleId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (vehicleId) where.vehicleId = vehicleId;
      return tx.fuelTransaction.findMany({
        where,
        orderBy: { transactionTime: 'desc' },
      });
    });
  }
}
