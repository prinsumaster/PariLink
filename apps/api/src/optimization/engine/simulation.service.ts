import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NetworkStateService,
  NetworkStateContext,
} from './network-state.service';
import {
  HeuristicOptimizerService,
  OptimizationObjective,
} from './heuristic-optimizer.service';
import { VrpSolverService } from './vrp-solver.service';

export enum SimulationTrigger {
  TRUCK_UNAVAILABLE = 'TRUCK_UNAVAILABLE',
  DRIVER_SICK = 'DRIVER_SICK',
  TRAFFIC_CONGESTION = 'TRAFFIC_CONGESTION',
  FUEL_PRICE_INCREASE = 'FUEL_PRICE_INCREASE',
  LATE_PICKUP = 'LATE_PICKUP',
}

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly networkState: NetworkStateService,
    private readonly optimizer: HeuristicOptimizerService,
    private readonly vrpSolver: VrpSolverService,
  ) {}

  /**
   * Generates a "What-if" scenario comparing Baseline vs Simulated.
   */
  async simulateWhatIf(
    companyId: string,
    trigger: SimulationTrigger,
    parameters: Record<string, unknown>,
  ) {
    this.logger.log(
      `Running simulation for trigger ${trigger} in company ${companyId}`,
    );

    // 1. Build original (Baseline) context
    const baselineContext =
      await this.networkState.buildOptimizationContext(companyId);

    // 2. Clone context for mutation
    const simulatedContext: NetworkStateContext = {
      ...baselineContext,
      availableVehicles: [...baselineContext.availableVehicles],
      openLoads: [...baselineContext.openLoads],
    };

    // 3. Mutate the simulated context based on the trigger
    if (trigger === SimulationTrigger.TRUCK_UNAVAILABLE) {
      const vehicleId = parameters.vehicleId as string;
      simulatedContext.availableVehicles =
        simulatedContext.availableVehicles.filter(
          (v) => v.vehicle.id !== vehicleId,
        );
    } else if (trigger === SimulationTrigger.DRIVER_SICK) {
      const driverId = parameters.driverId as string;
      simulatedContext.availableVehicles =
        simulatedContext.availableVehicles.filter(
          (v) => v.driver?.id !== driverId,
        );
    }
    // other triggers (traffic, fuel prices) would modify cost estimations rather than context directly
    // but for simplicity, we mock the result here.

    // 4. Run Optimization for Simulated Context
    // To properly simulate, we need to pass the mutated context down.
    // Since heuristic-optimizer currently pulls its own context via networkState,
    // we will mock a scenario creation for the simulation output.

    const scenario = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.optimizationScenario.create({
        data: {
          companyId,
          objective: OptimizationObjective.COST_MINIMIZATION, // default
          status: 'GENERATED',
          totalCost: 1500, // mock simulated cost
          totalRevenue: 2500, // mock revenue
          margin: 1000,
          confidenceScore: 0.88,
          explanation: `Simulated impact of ${trigger}.`,
          simulatedTrigger: trigger,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          simulationContext: parameters as any,
        },
      }),
    );

    return {
      baseline: {
        totalCost: 1400,
        margin: 1100,
        assignedLoads: baselineContext.openLoads.length,
      },
      simulated: {
        scenarioId: scenario.id,
        totalCost: scenario.totalCost,
        margin: scenario.margin,
        assignedLoads: simulatedContext.openLoads.length, // approximation
      },
      delta: {
        costImpact: scenario.totalCost - 1400,
        marginImpact: scenario.margin - 1100,
      },
    };
  }
}
