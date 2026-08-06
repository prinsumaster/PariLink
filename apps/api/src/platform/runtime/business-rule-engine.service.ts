import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheManagerService } from '../performance/cache-manager.service';

export interface RuleValidationContext {
  companyId: string;
  entityType: string; // e.g. 'TRIP', 'LOAD'
  entityId?: string;
  payload: any;
}

@Injectable()
export class BusinessRuleEngineService {
  private readonly logger = new Logger(BusinessRuleEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
  ) {}

  /**
   * Executes configurable business rules dynamically.
   */
  async evaluateRules(ctx: RuleValidationContext): Promise<boolean> {
    this.logger.log(`Evaluating Business Rules for ${ctx.entityType}`);

    // Load active rules from DB/Cache (using mock static rules here for demonstration of ELOM without schema lock-in)
    // In a full implementation, rules are loaded from a 'BusinessRule' table.
    const activeRules = [
      { type: 'CAPACITY', target: 'LOAD', strict: true },
      { type: 'WORKING_HOURS', target: 'DRIVER', strict: true },
      { type: 'HAZMAT_COMPLIANCE', target: 'VEHICLE', strict: true },
      { type: 'COLD_CHAIN', target: 'TRAILER', strict: true },
    ];

    for (const rule of activeRules) {
      // 1. Capacity Rule
      if (
        rule.type === 'CAPACITY' &&
        ctx.payload.vehicleId &&
        ctx.payload.weight
      ) {
        const vehicle = await this.prisma.runAsSystem(async (tx) =>
          tx.vehicle.findFirst({
            where: { id: ctx.payload.vehicleId },
          }),
        );
        if (
          vehicle &&
          vehicle.capacityWeight &&
          ctx.payload.weight > vehicle.capacityWeight
        ) {
          if (rule.strict)
            throw new BadRequestException(
              `Rule violation: Load weight (${ctx.payload.weight}) exceeds vehicle capacity (${vehicle.capacityWeight}).`,
            );
        }
      }

      // 2. Working Hours (HOS Compliance)
      if (rule.type === 'WORKING_HOURS' && ctx.payload.driverId) {
        // Mock check against recent trips
        const recentTrips = await this.prisma.runAsSystem(async (tx) =>
          tx.trip.count({
            where: {
              driverId: ctx.payload.driverId,
              startDate: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
          }),
        );
        if (recentTrips > 2) {
          if (rule.strict)
            throw new BadRequestException(
              `Rule violation: Driver ${ctx.payload.driverId} exceeds working hour limits (HOS).`,
            );
        }
      }

      // 3. HAZMAT Compliance
      if (
        rule.type === 'HAZMAT_COMPLIANCE' &&
        ctx.payload.isHazmat &&
        ctx.payload.vehicleId
      ) {
        const vehicle = await this.prisma.runAsSystem(async (tx) =>
          tx.vehicle.findFirst({
            where: { id: ctx.payload.vehicleId },
          }),
        );
        // Assume vehicle type defines hazmat readiness (mock validation)
        if (vehicle && vehicle.type !== 'HAZMAT_TRUCK') {
          if (rule.strict)
            throw new BadRequestException(
              `Rule violation: Vehicle ${vehicle.id} is not certified for Hazardous Materials (HAZMAT).`,
            );
        }
      }
    }

    return true;
  }
}
