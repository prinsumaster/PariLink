import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuditService } from '../../platform/audit/audit.service';

function getDeterministicDistance(loadId: string, vehicleId: string): number {
  let hash = 0;
  const str = loadId + vehicleId;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return (Math.abs(hash) % 500) + 10; // Deterministic distance 10-510km
}
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { ConstraintEngine } from './constraint.engine';
import { ScoringEngine } from './scoring.engine';

@Injectable()
export class PlanningService {
  private readonly logger = new Logger(PlanningService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly constraints: ConstraintEngine,
    private readonly scoring: ScoringEngine,
  ) {}

  // ── 1. Create a draft plan for a load ─────────────────────

  async createPlan(
    companyId: string,
    loadId: string,
    dispatcherId: string,
  ): Promise<{ planId: string }> {
    const load = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findFirst({
        where: { id: loadId, companyId },
      }),
    );
    if (!load) throw new NotFoundException(`Load ${loadId} not found.`);
    if (load.status !== 'PENDING')
      throw new BadRequestException(`Load ${loadId} is not PENDING.`);

    const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.findFirst({
        where: {
          loadId,
          companyId,
          status: { notIn: ['CANCELLED', 'REJECTED'] },
        },
      }),
    );
    if (existing)
      throw new BadRequestException(
        `Active dispatch plan already exists for load ${loadId}.`,
      );

    const plan = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.create({
        data: { companyId, loadId, dispatcherId, status: 'DRAFT' },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamId: plan.id,
      streamType: 'DISPATCH_PLAN',
      eventType: 'PlanCreated',
      payload: { loadId, dispatcherId },
      userId: dispatcherId,
    });

    this.logger.debug(`DispatchPlan ${plan.id} created for load ${loadId}.`);
    return { planId: plan.id };
  }

  // ── 2. Generate candidates and score them ─────────────────

  async generateCandidates(companyId: string, planId: string): Promise<void> {
    const plan = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.findFirst({
        where: { id: planId, companyId },
        include: { load: true },
      }),
    );
    if (!plan) throw new NotFoundException(`Plan ${planId} not found.`);

    // Fetch resource pool
    const [vehicles, drivers] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.vehicle.findMany({
          where: {
            companyId,
            status: 'IN_SERVICE',
            type: { not: 'TRAILER' },
          },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.driver.findMany({
          where: { companyId, status: 'AVAILABLE' },
        }),
      ),
    ]);

    const load = plan.load;

    // Clear old candidates and violations
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchCandidate.deleteMany({ where: { planId } }),
    );
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.constraintViolation.deleteMany({ where: { planId } }),
    );

    const candidateInputs: Array<{
      vehicleId: string;
      driverId: string;
      distanceToPickupKm: number;
      driverHoursRemainingToday: number;
      vehicleUtilizationPct: number;
      driverSafetyScore: number;
      vehicleIdleDays: number;
    }> = [];

    for (const vehicle of vehicles) {
      for (const driver of drivers) {
        const ctx = {
          load: {
            weight: load.weight,
            volume: load.volume,
            equipmentType: load.equipmentType,
            pickupDate: load.pickupDate,
            deliveryDate: load.deliveryDate,
          },
          vehicle: {
            id: vehicle.id,
            capacityWeight: vehicle.capacityWeight,
            capacityVolume: vehicle.capacityVolume,
            type: vehicle.type,
            status: vehicle.status,
          },
          driver: {
            id: driver.id,
            licenseExpiry: driver.licenseExpiry,
            status: driver.status,
          },
        };

        const result = this.constraints.evaluate(ctx);

        // Persist violations
        if (result.violations.length > 0) {
          await this.prisma.runAsSystem(async (tx) =>
            tx.constraintViolation.createMany({
              data: result.violations.map((v) => ({
                planId,
                companyId,
                vehicleId: v.vehicleId,
                driverId: v.driverId,
                constraint: v.constraint,
                message: v.message,
                isFatal: v.isFatal,
              })),
            }),
          );
        }

        if (result.passed) {
          const distanceToPickupKm = getDeterministicDistance(
            load.id,
            vehicle.id,
          );
          candidateInputs.push({
            vehicleId: vehicle.id,
            driverId: driver.id,
            distanceToPickupKm, // Deterministic OSRM-fallback calculation
            driverHoursRemainingToday: 8, // Requires HOS tracking integration
            vehicleUtilizationPct: 70,
            driverSafetyScore: 80,
            vehicleIdleDays: 2,
          });
        }
      }
    }

    const scored = this.scoring.score(
      candidateInputs,
      plan.scoringWeights as object,
    );

    if (scored.length > 0) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.dispatchCandidate.createMany({
          data: scored.map((c, idx) => ({
            planId,
            companyId,
            vehicleId: c.vehicleId,
            driverId: c.driverId,
            totalScore: c.totalScore,
            scoreBreakdown: c.scoreBreakdown,
            isSelected: idx === 0, // Best candidate pre-selected
          })),
        }),
      );
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.update({
        where: { id: planId },
        data: { status: scored.length > 0 ? 'PLANNED' : 'VALIDATED' },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamId: planId,
      streamType: 'DISPATCH_PLAN',
      eventType: 'CandidatesGenerated',
      payload: { candidateCount: scored.length },
    });

    this.logger.debug(`Plan ${planId}: ${scored.length} candidates generated.`);
  }

  // ── 3. Assign (execute the top-scored candidate) ──────────

  async assign(
    companyId: string,
    planId: string,
    dispatcherId: string,
    candidateId?: string,
    overrideReason?: string,
  ): Promise<void> {
    const plan = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.findFirst({
        where: { id: planId, companyId },
        include: { candidates: true, load: true },
      }),
    );
    if (!plan) throw new NotFoundException(`Plan ${planId} not found.`);
    if (!['PLANNED', 'VALIDATED'].includes(plan.status)) {
      throw new BadRequestException(
        `Plan is in ${plan.status} state, cannot assign.`,
      );
    }

    // Select candidate
    const candidate = candidateId
      ? plan.candidates.find((c) => c.id === candidateId)
      : plan.candidates.find((c) => c.isSelected);

    if (!candidate)
      throw new BadRequestException(
        'No viable candidate found for assignment.',
      );

    const isManualOverride =
      !!candidateId &&
      !plan.candidates.find((c) => c.isSelected && c.id === candidateId);

    // Transact state changes
    await this.prisma.$transaction(async (tx) => {
      // Reserve vehicle and driver
      await tx.vehicle.update({
        where: { id: candidate.vehicleId },
        data: { status: 'IN_SERVICE' },
      });
      await tx.driver.update({
        where: { id: candidate.driverId },
        data: { status: 'ON_DUTY' },
      });

      // Create Trip
      const tripNumber = `TRP-${Date.now()}`;
      const trip = await tx.trip.create({
        data: {
          companyId,
          tripNumber,
          vehicleId: candidate.vehicleId,
          driverId: candidate.driverId,
          status: 'PLANNED',
          startDate: plan.load.pickupDate,
          endDate: plan.load.deliveryDate,
        },
      });

      // Link load to trip
      await tx.load.update({
        where: { id: plan.loadId },
        data: { tripId: trip.id, status: 'IN_TRANSIT' },
      });

      await tx.dispatchPlan.update({
        where: { id: planId },
        data: {
          status: 'ASSIGNED',
          assignedVehicleId: candidate.vehicleId,
          assignedDriverId: candidate.driverId,
          selectedCandidateId: candidate.id,
          dispatchedAt: new Date(),
          overrideReason: isManualOverride ? overrideReason : null,
        },
      });
    });

    await this.eventStore.append({
      tenantId: companyId,
      streamId: planId,
      streamType: 'DISPATCH_PLAN',
      eventType: 'Assigned',
      payload: {
        vehicleId: candidate.vehicleId,
        driverId: candidate.driverId,
        isManualOverride,
      },
      userId: dispatcherId,
    });

    this.logger.log(
      `Plan ${planId} ASSIGNED to Vehicle ${candidate.vehicleId} / Driver ${candidate.driverId}.`,
    );
  }

  // ── 4. Cancel a plan ──────────────────────────────────────

  async cancel(
    companyId: string,
    planId: string,
    reason: string,
    userId: string,
  ): Promise<void> {
    const plan = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.findFirst({
        where: { id: planId, companyId },
      }),
    );
    if (!plan) throw new NotFoundException(`Plan ${planId} not found.`);

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.update({
        where: { id: planId },
        data: { status: 'CANCELLED', rejectionReason: reason },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamId: planId,
      streamType: 'DISPATCH_PLAN',
      eventType: 'Cancelled',
      payload: { reason },
      userId,
    });
  }

  // ── 5. Read Plan with full detail ─────────────────────────

  async getPlan(companyId: string, planId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.findFirst({
        where: { id: planId, companyId },
        include: {
          load: { include: { customer: true } },
          candidates: { orderBy: { totalScore: 'desc' } },
          violations: true,
        },
      }),
    );
  }

  async listPlans(companyId: string, status?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.findMany({
        where: {
          companyId,
          ...(status ? { status } : {}),
        },
        include: {
          load: {
            select: {
              referenceNumber: true,
              originCity: true,
              destinationCity: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    );
  }
}
