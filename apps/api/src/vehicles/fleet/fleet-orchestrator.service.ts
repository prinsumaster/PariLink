import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { MaintenanceEngine } from './maintenance.engine';
import { ComplianceEngine } from './compliance.engine';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { LifecycleEngineService } from '../../platform/lifecycle/lifecycle-engine.service';

/**
 * Enterprise Fleet Management System Orchestrator.
 * Connects operational events (Dispatch) to Asset Management workflows.
 */
@Injectable()
export class FleetOrchestratorService {
  private readonly logger = new Logger(FleetOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly maintenanceEngine: MaintenanceEngine,
    private readonly complianceEngine: ComplianceEngine,
    private readonly eventStore: EventStoreService,
    private readonly lifecycle: LifecycleEngineService,
  ) {}

  @OnEvent('EventStore.*')
  async handleFleetEvents(payload: any) {
    if (!payload || !payload.eventType) return;

    try {
      switch (payload.eventType) {
        // AI Integration: Predictive Maintenance
        case 'BreakdownPredicted':
        case 'MaintenanceRecommended':
          await this.handlePredictiveMaintenance(
            payload.tenantId,
            payload.streamId,
            payload.payload,
            payload.userId,
          );
          break;

        // Trip Completion: Triggers Preventive Maintenance Odometer Checks
        case 'LifecycleStateChangedToCOMPLETED':
          if (payload.streamType === 'TRIP') {
            await this.handleTripCompleted(
              payload.tenantId,
              payload.streamId,
              payload.userId,
            );
          }
          break;

        case 'VehicleYardEntry':
          // Entry triggers automated compliance scans (FASTag, Permits, Insurance)
          // Mock data passed from Yard Management
          const docs = payload.payload.documents || [];
          await this.complianceEngine.evaluateDocumentCompliance(
            payload.tenantId,
            'VEHICLE',
            payload.streamId,
            docs,
          );
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Fleet Orchestration Error: [${payload.eventType}] ${errorMessage}`,
      );
    }
  }

  private async handlePredictiveMaintenance(
    companyId: string,
    vehicleId: string,
    aiPayload: any,
    userId: string,
  ) {
    this.logger.warn(
      `AI Predicts Breakdown/Maintenance for Vehicle ${vehicleId}. Orchestrating response.`,
    );

    // 1. Log Event
    await this.eventStore.append({
      tenantId: companyId,
      streamId: vehicleId,
      streamType: 'VEHICLE',
      eventType: 'VehicleMaintenanceDue',
      payload: { reason: 'AI_PREDICTION', details: aiPayload },
      userId,
    });

    // 2. Transition Vehicle to PAUSED or UNDER_MAINTENANCE to prevent dispatch allocation
    if (aiPayload.severity === 'CRITICAL') {
      const vehicle = await (this.prisma as any).vehicle.findUnique({
        where: { id: vehicleId },
        select: { status: true },
      });
      if (vehicle && vehicle.status === 'ACTIVE') {
        await this.lifecycle.transitionState({
          companyId,
          entityType: 'Vehicle',
          entityId: vehicleId,
          fromState: vehicle.status,
          toState: 'BLOCKED',
          userId: 'SYSTEM',
          reason: 'AI Predicted Critical Breakdown',
        });
      }
    }
  }

  private async handleTripCompleted(
    companyId: string,
    tripId: string,
    userId: string,
  ) {
    // 1. Extract Trip Vehicle & Odometer
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId },
        select: { vehicleId: true, endOdometer: true },
      }),
    );

    if (trip && trip.vehicleId && trip.endOdometer) {
      // 2. Trigger Preventive Maintenance Checks
      await this.maintenanceEngine.checkPreventiveMaintenance(
        companyId,
        trip.vehicleId,
        trip.endOdometer,
      );
    }
  }
}
