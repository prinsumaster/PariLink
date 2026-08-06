import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { LifecycleEngineService } from '../../platform/lifecycle/lifecycle-engine.service';

@Injectable()
export class MaintenanceEngine {
  private readonly logger = new Logger(MaintenanceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly lifecycle: LifecycleEngineService,
  ) {}

  /**
   * Tracks Preventive Maintenance intervals (Odometer/Calendar).
   */
  async checkPreventiveMaintenance(
    companyId: string,
    vehicleId: string,
    currentOdometer: number,
  ) {
    this.logger.log(
      `Evaluating maintenance schedules for vehicle ${vehicleId}`,
    );

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle) return;

      // Dynamic rule checks (In reality, fetch from MaintenanceSchedule table)
      // E.g., Service every 10,000 km
      const lastServiceOdometer = 50000; // Mocked value
      const serviceInterval = 10000;

      if (currentOdometer >= lastServiceOdometer + serviceInterval) {
        this.logger.warn(`Maintenance due for Vehicle ${vehicleId}`);

        await this.eventStore.append({
          tenantId: companyId,
          streamId: vehicleId,
          streamType: 'VEHICLE',
          eventType: 'VehicleMaintenanceDue',
          payload: { reason: 'ODOMETER_INTERVAL', currentOdometer },
          userId: 'SYSTEM',
        });

        // Potentially shift status to 'MAINTENANCE_DUE'
      }
    });
  }

  async completeMaintenance(
    companyId: string,
    vehicleId: string,
    cost: number,
    details: any,
    userId: string,
  ) {
    this.logger.log(`Completing maintenance for ${vehicleId}`);

    // Auto-resume vehicle status via Lifecycle
    const vehicle = await (this.prisma as any).vehicle.findUnique({
      where: { id: vehicleId },
      select: { status: true },
    });
    if (vehicle && vehicle.status === 'UNDER_MAINTENANCE') {
      await this.lifecycle.transitionState({
        companyId,
        entityType: 'Vehicle',
        entityId: vehicleId,
        fromState: vehicle.status,
        toState: 'APPROVED',
        userId,
        reason: 'Maintenance Completed',
      });
    }

    await this.eventStore.append({
      tenantId: companyId,
      streamId: vehicleId,
      streamType: 'VEHICLE',
      eventType: 'MaintenanceCompleted',
      payload: { cost, details },
      userId,
    });
  }
}
