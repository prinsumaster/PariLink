import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SlaEvaluationResult {
  totalLoads: number;
  onTimeDeliveries: number;
  onTimePercentage: number;
  targetPercentage: number;
  penaltyExposure: number;
}

@Injectable()
export class SlaTrackerService {
  private readonly logger = new Logger(SlaTrackerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates a customer's SLA performance over a specific period.
   * Compares CustomerPromise estimates/actuals against Contract SLA targets.
   */
  async evaluateCustomerSLA(
    companyId: string,
    customerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SlaEvaluationResult> {
    // 1. Find active contract with SLA terms
    const contract = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.contract.findFirst({
        where: { companyId, customerId, status: 'ACTIVE', type: 'MSA' },
        orderBy: { createdAt: 'desc' },
      }),
    );

    const targetPercentage = contract?.slaDeliveryOnTimePct || 0;
    const penaltyRate = contract?.penaltyPerLateDay || 0;

    // 2. Query loads within the timeframe
    const loads = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findMany({
        where: {
          companyId,
          customerId,
          pickupDate: { gte: startDate },
          deliveryDate: { lte: endDate },
          status: 'COMPLETED', // Only completed loads determine final SLA compliance
        },
        include: {
          CustomerPromise: true, // Uses the model linked by loadId
        },
      }),
    );

    let onTimeCount = 0;
    let lateCount = 0;
    let totalPenalty = 0;

    for (const load of loads) {
      const promise = load.CustomerPromise;
      if (!promise) continue;

      // Simplification: In a full event model, we query EventStore for actual delivery event.
      // Here, we compare the final `estimatedArrivalAt` against `committedDeliveryAt`
      const actualDelivery = promise.estimatedArrivalAt || load.deliveryDate;
      const targetDelivery = promise.committedDeliveryAt;

      if (targetDelivery && actualDelivery <= targetDelivery) {
        onTimeCount++;
      } else {
        lateCount++;

        // Calculate penalty if applicable
        if (targetDelivery && penaltyRate > 0) {
          const delayDays = Math.ceil(
            (actualDelivery.getTime() - targetDelivery.getTime()) /
              (1000 * 3600 * 24),
          );
          totalPenalty += delayDays * penaltyRate;
        }
      }
    }

    const totalEvaluated = onTimeCount + lateCount;
    const onTimePercentage =
      totalEvaluated > 0 ? (onTimeCount / totalEvaluated) * 100 : 100;

    return {
      totalLoads: totalEvaluated,
      onTimeDeliveries: onTimeCount,
      onTimePercentage: parseFloat(onTimePercentage.toFixed(2)),
      targetPercentage,
      penaltyExposure: totalPenalty,
    };
  }
}
