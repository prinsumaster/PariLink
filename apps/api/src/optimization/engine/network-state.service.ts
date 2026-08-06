import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Load, Vehicle, Driver } from '@prisma/client';

export interface NetworkStateContext {
  companyId: string;
  openLoads: Load[];
  availableVehicles: Array<{
    vehicle: Vehicle;
    driver?: Driver;
    state: any; // The TwinSnapshot JSON state
  }>;
  // future: depots, available drivers without vehicles, etc.
}

@Injectable()
export class NetworkStateService {
  private readonly logger = new Logger(NetworkStateService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Builds a deterministic snapshot of the entire network state for a company.
   * This retrieves Open Loads and all active Vehicle Twins.
   */
  async buildOptimizationContext(
    companyId: string,
  ): Promise<NetworkStateContext> {
    // 1. Fetch Open Loads (not yet planned, assigned, or completed)
    // For this context, we'll consider loads in 'PENDING' status.
    const openLoads = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findMany({
        where: {
          companyId,
          status: 'PENDING',
          // Also ensure no active non-cancelled dispatch plan exists
          DispatchPlan: {
            none: {
              status: { notIn: ['CANCELLED', 'REJECTED'] },
            },
          },
        },
        orderBy: { pickupDate: 'asc' },
      }),
    );

    // 2. Fetch Vehicle Twins
    const vehicleTwins = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.twinSnapshot.findMany({
        where: {
          companyId,
          twinType: 'VEHICLE',
        },
      }),
    );

    // Extract vehicle IDs from twins
    const vehicleIds = vehicleTwins.map((t) => t.twinId);

    // 3. Fetch underlying physical Vehicle and Driver resources
    const vehicles = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findMany({
        where: {
          companyId,
          id: { in: vehicleIds },
          status: 'IN_SERVICE',
        },
      }),
    );

    // We assume an optimistic driver-vehicle pairing for the sake of optimization context
    // if the state specifies an activeDriverId.
    const driverIdsToFetch = vehicleTwins
      .map((t) => (t.state as any).activeDriverId as string | undefined)
      .filter((id): id is string => !!id);

    const drivers = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driver.findMany({
        where: {
          companyId,
          id: { in: driverIdsToFetch },
          status: 'AVAILABLE',
        },
      }),
    );

    // Build the merged available vehicles context
    const availableVehicles = vehicles.map((vehicle) => {
      const twin = vehicleTwins.find((t) => t.twinId === vehicle.id);
      const state = twin?.state as any;
      let driver: Driver | undefined;

      if (state?.activeDriverId) {
        driver = drivers.find((d) => d.id === state.activeDriverId);
      }

      return {
        vehicle,
        driver,
        state: state || {},
      };
    });

    this.logger.debug(
      `Built Network Context for ${companyId}: ${openLoads.length} loads, ${availableVehicles.length} vehicles.`,
    );

    return {
      companyId,
      openLoads,
      availableVehicles,
    };
  }
}
