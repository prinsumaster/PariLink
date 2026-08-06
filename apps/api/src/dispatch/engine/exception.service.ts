import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import type { PlatformEvent } from '../../platform/events/event.service';

@Injectable()
export class ExceptionService {
  private readonly logger = new Logger(ExceptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Handle a driver rejecting a dispatch assignment.
   * Recommendation: auto-find next best candidate from existing plan.
   */
  async handleDriverRejection(
    companyId: string,
    planId: string,
    driverId: string,
    reason: string,
  ): Promise<void> {
    this.logger.warn(
      `Driver ${driverId} rejected plan ${planId}. Reason: ${reason}`,
    );

    // Find next best candidate (excluding rejected driver)
    const nextCandidate = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchCandidate.findFirst({
        where: {
          planId,
          companyId,
          driverId: { not: driverId },
          isSelected: false,
        },
        orderBy: { totalScore: 'desc' },
      }),
    );

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dispatchPlan.update({
        where: { id: planId },
        data: {
          status: 'PLANNED', // revert to planned for re-assignment
          assignedDriverId: null,
          assignedVehicleId: null,
          dispatchedAt: null,
          selectedCandidateId: nextCandidate?.id ?? null,
          notes: `Driver ${driverId} rejected. Reason: ${reason}`,
        },
      }),
    );

    if (nextCandidate) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.dispatchCandidate.update({
          where: { id: nextCandidate.id },
          data: { isSelected: true },
        }),
      );
    }

    await this.eventStore.append({
      tenantId: companyId,
      streamId: planId,
      streamType: 'DISPATCH_PLAN',
      eventType: 'DriverRejected',
      payload: { driverId, reason, nextCandidateId: nextCandidate?.id },
    });
  }

  /**
   * React to GPS-lost alerts — flag the plan for manual intervention.
   */
  @OnEvent('Alert.Triggered')
  onAlertTriggered(event: PlatformEvent) {
    const { tenantId } = event;
    const payload = event.payload as { ruleType?: string };
    if (!payload?.ruleType) return;

    if (payload.ruleType === 'GPS_LOST') {
      this.logger.warn(
        `GPS lost alert received for company ${tenantId}. Manual intervention required.`,
      );
      // In production: look up active plans using the vehicleId in the alert and escalate.
    }
  }
}
