import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { LifecycleEngineService } from '../../platform/lifecycle/lifecycle-engine.service';
import { ResourceOrchestratorService } from '../../platform/runtime/resource-orchestrator.service';
import { PredictionEngineService } from '../../ai/prediction/prediction.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InboundOutboundEngine {
  private readonly logger = new Logger(InboundOutboundEngine.name);

  constructor(
    private readonly eventStore: EventStoreService,
    // @ts-ignore: DI dependency reserved for future use
    private readonly _lifecycle: LifecycleEngineService,
    private readonly resourceOrchestrator: ResourceOrchestratorService,
    // @ts-ignore: DI dependency reserved for future use
    private readonly _aiPrediction: PredictionEngineService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Processes Advance Shipping Notice (ASN) for Inbound.
   */
  async processAsn(
    companyId: string,
    asnId: string,
    payload: any,
    userId: string,
  ) {
    this.logger.log(`Processing ASN ${asnId}`);

    const asn = await this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.inboundReceipt.findFirst({ where: { id: asnId, companyId } });
    });
    if (!asn) {
      throw new NotFoundException(`ASN ${asnId} not found in tenant`);
    }

    let isCrossDock = false;
    let crossDockAssignmentId: string | undefined;

    if (payload.priority === 'URGENT') {
      isCrossDock = true; // Simulated ML trigger
      const targetOutboundOrder = payload.targetOutboundOrder || 'ORD-1002';
      
      const assignment = await this.prisma.runAsTenant(companyId, async (tx) => {
        return tx.crossDockAssignment.create({
          data: {
            companyId,
            asnId,
            outboundOrderId: targetOutboundOrder,
            matchScore: 0.98,
            status: 'PENDING',
            dockId: payload.dockId,
          }
        });
      });
      crossDockAssignmentId = assignment.id;

      await this.eventStore.append({
        tenantId: companyId,
        streamId: asnId,
        streamType: 'ASN',
        eventType: 'CrossDockTriggered',
        payload: { matchScore: 0.98, targetOutboundOrder, crossDockAssignmentId },
        userId,
      });
    }

    // Schedule Dock
    await this.resourceOrchestrator.allocateResource({
      companyId,
      resourceType: 'DOCK',
      resourceId: payload.dockId || 'DOCK-1',
      entityType: 'ASN',
      entityId: asnId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hour block
    });

    await this.eventStore.append({
      tenantId: companyId,
      streamId: asnId,
      streamType: 'ASN',
      eventType: 'InventoryReceived',
      payload: { ...payload, isCrossDock },
      userId,
    });

    return { status: 'RECEIVED', isCrossDock, crossDockAssignmentId };
  }

  /**
   * Generates optimal pick waves for Outbound orders.
   */
  async generatePickWave(
    companyId: string,
    orderIds: string[],
    userId: string,
  ) {
    this.logger.log(`Generating Pick Wave for ${orderIds.length} orders`);

    await this.prisma.runAsTenant(companyId, async (tx) => {
      const orders = await tx.outboundOrder.findMany({
        where: { id: { in: orderIds }, companyId }
      });
      if (orders.length !== orderIds.length) {
        throw new NotFoundException(`One or more orders not found in tenant`);
      }
    });

    const waveNumber = `WAVE-${Date.now()}`;
    const estimatedTimeSec = 1200;

    const wave = await this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.pickWave.create({
        data: {
          companyId,
          waveNumber,
          orderIds,
          status: 'PLANNED',
          estimatedTimeSec,
        }
      });
    });

    // Assuming lifecycle engine transitions orders to ALLOCATED / IN_PROGRESS
    for (const orderId of orderIds) {
      // Mock Transition
      this.logger.log(`Routing ${orderId} to Wave ${waveNumber}`);
    }

    await this.eventStore.append({
      tenantId: companyId,
      streamId: wave.id,
      streamType: 'WAVE',
      eventType: 'WavePlanned',
      payload: { orderIds, estimatedTimeSec },
      userId,
    });

    return { waveId: wave.id, waveNumber, status: wave.status };
  }
}
