import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

export interface TyreRotationDto {
  companyId: string;
  vehicleId: string;
  tyreId: string;
  oldPosition: string;
  newPosition: string;
  currentOdometer: number;
}

@Injectable()
export class TyreManagementService {
  private readonly logger = new Logger(TyreManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  async logTyreRotation(dto: TyreRotationDto, userId: string) {
    this.logger.log(
      `Logging tyre rotation for Tyre ${dto.tyreId} on Vehicle ${dto.vehicleId}`,
    );

    // Track wear analysis based on position history
    await this.eventStore.append({
      tenantId: dto.companyId,
      streamId: dto.tyreId,
      streamType: 'TYRE',
      eventType: 'TyreRotated',
      payload: {
        vehicleId: dto.vehicleId,
        oldPosition: dto.oldPosition,
        newPosition: dto.newPosition,
        odometer: dto.currentOdometer,
      },
      userId,
    });

    return { status: 'RECORDED' };
  }

  async replaceTyre(
    companyId: string,
    vehicleId: string,
    oldTyreId: string,
    newTyreId: string,
    position: string,
    reason: string,
    userId: string,
  ) {
    this.logger.log(
      `Replacing Tyre ${oldTyreId} with ${newTyreId} on ${vehicleId}`,
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamId: oldTyreId,
      streamType: 'TYRE',
      eventType: 'TyreRemoved',
      payload: { vehicleId, position, reason },
      userId,
    });

    await this.eventStore.append({
      tenantId: companyId,
      streamId: newTyreId,
      streamType: 'TYRE',
      eventType: 'TyreInstalled',
      payload: { vehicleId, position },
      userId,
    });

    return { status: 'REPLACED' };
  }
}
