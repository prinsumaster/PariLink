import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../digital-twin/event-store.service';
import { AuditService } from '../audit/audit.service';

export type StandardState =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'ALLOCATED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'BLOCKED'
  | 'DELAYED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export interface TransitionContext {
  companyId: string;
  entityType: string;
  entityId: string;
  fromState: string;
  toState: StandardState;
  userId: string;
  reason?: string;
  metadata?: any;
}

@Injectable()
export class LifecycleEngineService {
  private readonly logger = new Logger(LifecycleEngineService.name);

  // Define valid standard transitions (Enterprise Lifecycle Model)
  private readonly allowedTransitions: Record<string, StandardState[]> = {
    DRAFT: ['PENDING_APPROVAL', 'APPROVED', 'CANCELLED'],
    PENDING_APPROVAL: ['APPROVED', 'CANCELLED', 'DRAFT'],
    APPROVED: ['SCHEDULED', 'ALLOCATED', 'IN_PROGRESS', 'CANCELLED'],
    SCHEDULED: ['ALLOCATED', 'IN_PROGRESS', 'DELAYED', 'CANCELLED'],
    ALLOCATED: ['IN_PROGRESS', 'DELAYED', 'CANCELLED'],
    IN_PROGRESS: ['PAUSED', 'BLOCKED', 'DELAYED', 'COMPLETED', 'CANCELLED'],
    PAUSED: ['IN_PROGRESS', 'CANCELLED'],
    BLOCKED: ['IN_PROGRESS', 'CANCELLED'],
    DELAYED: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    COMPLETED: ['ARCHIVED'],
    CANCELLED: ['ARCHIVED'],
    ARCHIVED: [],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Executes a validated state transition for an enterprise entity.
   */
  async transitionState(ctx: TransitionContext) {
    this.logger.log(
      `Attempting transition: ${ctx.entityType} ${ctx.entityId} from ${ctx.fromState} to ${ctx.toState}`,
    );

    // 1. Validate Transition
    const allowed = this.allowedTransitions[ctx.fromState] || [];
    if (!allowed.includes(ctx.toState)) {
      throw new BadRequestException(
        `Invalid state transition for ${ctx.entityType}: ${ctx.fromState} -> ${ctx.toState}`,
      );
    }

    // 2. Perform DB Update (Dynamic model update)
    const model = (this.prisma as any)[ctx.entityType.toLowerCase()];
    if (!model) {
      throw new BadRequestException(
        `Entity model ${ctx.entityType} not found in Prisma client.`,
      );
    }

    const updatedEntity = await model.update({
      where: { id: ctx.entityId },
      data: { status: ctx.toState },
    });

    // 3. Emit Platform Event
    await this.eventStore.append({
      tenantId: ctx.companyId,
      streamId: ctx.entityId,
      streamType: ctx.entityType.toUpperCase(),
      eventType: `LifecycleStateChangedTo${ctx.toState}`,
      payload: {
        from: ctx.fromState,
        to: ctx.toState,
        reason: ctx.reason,
        metadata: ctx.metadata,
      },
      userId: ctx.userId,
    });

    // 4. Record Strict Audit Trail
    await this.audit.logEvent({
      userId: ctx.userId,
      action: 'UPDATE_STATE',
      entity: ctx.entityType,
      entityId: ctx.entityId,
      details: {
        previousState: ctx.fromState,
        newState: ctx.toState,
        reason: ctx.reason,
      },
      companyId: ctx.companyId,
    });

    return updatedEntity;
  }
}
