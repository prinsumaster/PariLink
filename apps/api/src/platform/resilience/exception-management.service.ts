import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventStoreService } from '../digital-twin/event-store.service';
import { LifecycleEngineService } from '../lifecycle/lifecycle-engine.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExceptionManagementService {
  private readonly logger = new Logger(ExceptionManagementService.name);

  constructor(
    private readonly eventStore: EventStoreService,
    private readonly lifecycle: LifecycleEngineService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Registers a high-priority operational incident and links it to an entity.
   */
  async reportIncident(
    companyId: string,
    entityType: string,
    entityId: string,
    exceptionType: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    details: Record<string, unknown>,
    reportedBy: string,
  ) {
    this.logger.warn(
      `Incident Reported: [${severity}] ${exceptionType} on ${entityType} ${entityId}`,
    );

    // Create an incident tracking event
    await this.eventStore.append({
      tenantId: companyId,
      streamId: entityId,
      streamType: entityType.toUpperCase(),
      eventType: 'IncidentReported',
      payload: { exceptionType, severity, details, status: 'OPEN' },
      userId: reportedBy,
    });

    // Auto-triage: if CRITICAL, pause or block the entity
    if (severity === 'CRITICAL') {
      try {
        // Fetch current status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const model = (this.prisma as any)[entityType.toLowerCase()];
        const entity = await model.findUnique({
          where: { id: entityId },
          select: { status: true },
        });

        if (entity && entity.status === 'IN_PROGRESS') {
          await this.lifecycle.transitionState({
            companyId,
            entityType,
            entityId,
            fromState: entity.status,
            toState: 'BLOCKED',
            userId: reportedBy,
            reason: `Auto-blocked due to CRITICAL incident: ${exceptionType}`,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `Failed to auto-triage entity block: ${errorMessage}`,
        );
      }
    }

    return { status: 'OPEN' };
  }

  async resolveIncident(
    companyId: string,
    entityType: string,
    entityId: string,
    resolutionDetails: string,
    resolvedBy: string,
  ) {
    await this.eventStore.append({
      tenantId: companyId,
      streamId: entityId,
      streamType: entityType.toUpperCase(),
      eventType: 'IncidentResolved',
      payload: { resolutionDetails, status: 'RESOLVED' },
      userId: resolvedBy,
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const model = (this.prisma as any)[entityType.toLowerCase()];
      const entity = await model.findUnique({
        where: { id: entityId },
        select: { status: true },
      });

      if (
        entity &&
        (entity.status === 'BLOCKED' || entity.status === 'PAUSED')
      ) {
        await this.lifecycle.transitionState({
          companyId,
          entityType,
          entityId,
          fromState: entity.status,
          toState: 'IN_PROGRESS',
          userId: resolvedBy,
          reason: `Incident resolved: ${resolutionDetails}`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to auto-resume entity: ${errorMessage}`);
    }

    return { status: 'RESOLVED' };
  }
}
