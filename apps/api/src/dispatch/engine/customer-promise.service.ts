import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import type { PlatformEvent } from '../../platform/events/event.service';

@Injectable()
export class CustomerPromiseService {
  private readonly logger = new Logger(CustomerPromiseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPromise(
    companyId: string,
    loadId: string,
    pickupAt: Date,
    deliveryAt: Date,
  ): Promise<void> {
    await this.prisma.runAsSystem(async (tx) =>
      tx.customerPromise.upsert({
        where: { loadId },
        create: {
          companyId,
          loadId,
          committedPickupAt: pickupAt,
          committedDeliveryAt: deliveryAt,
          estimatedArrivalAt: deliveryAt,
          confidenceScore: 1.0,
          delayRiskScore: 0,
        },
        update: {
          committedPickupAt: pickupAt,
          committedDeliveryAt: deliveryAt,
          lastUpdatedAt: new Date(),
        },
      }),
    );
  }

  /**
   * Listen to geofence events and route deviation alerts to recompute ETA confidence.
   */
  @OnEvent('Alert.Triggered')
  async onAlertTriggered(event: PlatformEvent) {
    const { tenantId } = event;
    const payload = event.payload as { ruleType?: string };
    if (!payload?.ruleType) return;

    // When a speeding or route deviation alert is raised, flag delay risk for open loads
    if (['SPEEDING', 'DEVIATION'].includes(payload.ruleType)) {
      const promise = await this.prisma.runAsSystem(async (tx) =>
        tx.customerPromise.findFirst({
          where: { companyId: tenantId, delayRiskScore: { lt: 1 } },
        }),
      );
      if (!promise) return;

      const newRisk = Math.min(1, promise.delayRiskScore + 0.1);
      await this.prisma.runAsSystem(async (tx) =>
        tx.customerPromise.update({
          where: { id: promise.id },
          data: {
            delayRiskScore: newRisk,
            confidenceScore: Math.max(0, promise.confidenceScore - 0.05),
            reasonCode: payload.ruleType,
            lastUpdatedAt: new Date(),
          },
        }),
      );
      this.logger.debug(
        `CustomerPromise for load ${promise.loadId} delay risk → ${newRisk}`,
      );
    }
  }
}
