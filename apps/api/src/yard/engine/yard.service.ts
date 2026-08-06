import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class YardService {
  private readonly logger = new Logger(YardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Log Gate Entry
   */
  async logGateEntry(
    companyId: string,
    warehouseId: string,
    data: {
      vehicleId?: string;
      trailerId?: string;
      driverId?: string;
      purpose: string;
    },
    userId: string,
  ) {
    const log = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.yardGateLog.create({
        data: {
          companyId,
          warehouseId,
          type: 'ENTRY',
          purpose: data.purpose,
          vehicleId: data.vehicleId,
          trailerId: data.trailerId,
          driverId: data.driverId,
        },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'YARD_GATE',
      streamId: log.id,
      eventType: 'GateEntered',
      payload: data,
      userId,
    });

    return log;
  }

  /**
   * Log Gate Exit
   */
  async logGateExit(
    companyId: string,
    warehouseId: string,
    data: {
      vehicleId?: string;
      trailerId?: string;
      driverId?: string;
      purpose: string;
    },
    userId: string,
  ) {
    const log = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.yardGateLog.create({
        data: {
          companyId,
          warehouseId,
          type: 'EXIT',
          purpose: data.purpose,
          vehicleId: data.vehicleId,
          trailerId: data.trailerId,
          driverId: data.driverId,
        },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'YARD_GATE',
      streamId: log.id,
      eventType: 'GateExited',
      payload: data,
      userId,
    });

    return log;
  }
}
