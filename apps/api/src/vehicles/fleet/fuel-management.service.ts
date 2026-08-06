import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

export interface FuelPurchaseDto {
  companyId: string;
  vehicleId: string;
  driverId: string;
  gallonsOrLiters: number;
  totalCost: number;
  odometer: number;
  location: string;
}

@Injectable()
export class FuelManagementService {
  private readonly logger = new Logger(FuelManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  async logFuelPurchase(dto: FuelPurchaseDto, userId: string) {
    this.logger.log(`Logging fuel purchase for vehicle ${dto.vehicleId}`);

    return this.prisma.runAsTenant(dto.companyId, async (tx) => {
      // 1. Detect Fuel Anomaly (Theft or extreme inefficiency)
      // Check last fueling odometer
      const lastFuelingOdometer = dto.odometer - 500; // Mock historical check
      const lastFuelVolume = 100; // Mock
      const distanceCovered = dto.odometer - lastFuelingOdometer;

      if (distanceCovered > 0) {
        const efficiency = distanceCovered / lastFuelVolume;
        // Typical truck: 3-6 kmpl. Anomaly if < 1.5
        if (efficiency < 1.5) {
          this.logger.warn(
            `Fuel anomaly detected on ${dto.vehicleId}. Efficiency: ${efficiency}`,
          );

          await this.eventStore.append({
            tenantId: dto.companyId,
            streamId: dto.vehicleId,
            streamType: 'VEHICLE',
            eventType: 'FuelAnomalyDetected',
            payload: {
              efficiency,
              location: dto.location,
              suspectedTheft: true,
            },
            userId,
          });
        }
      }

      // 2. Log standard event
      await this.eventStore.append({
        tenantId: dto.companyId,
        streamId: dto.vehicleId,
        streamType: 'VEHICLE',
        eventType: 'FuelPurchased',
        payload: {
          cost: dto.totalCost,
          volume: dto.gallonsOrLiters,
          odometer: dto.odometer,
        },
        userId,
      });

      // (In production, persist this in a FuelTransaction table)
      return { status: 'RECORDED', anomalyDetected: false };
    });
  }
}
