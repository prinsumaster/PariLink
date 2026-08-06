import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DispatchService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getBoardData(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const [
        pendingLoads,
        availableDrivers,
        availableVehicles,
        availableTrailers,
        activeTrips,
      ] = await Promise.all([
        // 1. Pending Loads
        tx.load.findMany({
          where: { companyId, status: 'PENDING' },
          include: { customer: true },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),

        // 2. Available Drivers
        tx.driver.findMany({
          where: { companyId, status: 'AVAILABLE' },
          orderBy: { firstName: 'asc' },
          take: 100,
        }),

        // 3. Available Vehicles
        tx.vehicle.findMany({
          where: {
            companyId,
            status: 'IN_SERVICE',
            type: { not: 'TRAILER' },
          },
          orderBy: { licensePlate: 'asc' },
          take: 100,
        }),

        // 4. Available Trailers
        tx.vehicle.findMany({
          where: {
            companyId,
            status: 'IN_SERVICE',
            type: 'TRAILER',
          },
          orderBy: { licensePlate: 'asc' },
          take: 100,
        }),

        // 5. Active Trips
        tx.trip.findMany({
          where: {
            companyId,
            status: { in: ['PLANNED', 'DISPATCHED', 'IN_PROGRESS'] },
          },
          include: { driver: true, vehicle: true, trailer: true, loads: true },
          orderBy: { startDate: 'asc' },
          take: 100,
        }),
      ]);

      return {
        pendingLoads,
        availableDrivers,
        availableVehicles,
        availableTrailers,
        activeTrips,
        metrics: {
          pendingLoadsCount: pendingLoads.length,
          availableDriversCount: availableDrivers.length,
          availableVehiclesCount: availableVehicles.length,
          availableTrailersCount: availableTrailers.length,
          activeTripsCount: activeTrips.length,
        },
      };
    });
  }

  async moveBoardCard(
    companyId: string,
    loadId: string,
    newStatus: string,
    boardPosition: number,
  ) {
    const updatedLoad = await this.prisma.runAsTenant(companyId, async (tx) => {
      const existingLoad = await tx.load.findFirst({
        where: { id: loadId, companyId },
      });

      if (!existingLoad) {
        throw new BadRequestException('Load not found');
      }

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'DISPATCH',
        trigger: 'BOARD_CARD_MOVED',
        entityData: { load: existingLoad, newStatus, boardPosition },
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new BadRequestException(
          'Dispatch move rejected by business rules.',
        );
      }

      return this.prisma.updateWithOcc<any>(
        tx,
        'load',
        loadId,
        existingLoad.updatedAt,
        { status: newStatus, boardPosition },
      );
    });

    this.eventEmitter.emit('dispatch.updated', {
      loadId,
      newStatus,
      boardPosition,
    });

    return updatedLoad;
  }
}
