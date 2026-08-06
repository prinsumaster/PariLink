import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../digital-twin/event-store.service';

export interface CreateTaskDto {
  companyId: string;
  processInstanceId: string;
  nodeId: string;
  assigneeId?: string; // If undefined, it goes to a Team Queue
  formId?: string;
  dueDate: Date;
  variables: Record<string, unknown>;
}

@Injectable()
export class TaskManagementService {
  private readonly logger = new Logger(TaskManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Dispatches a Human Task to an Inbox or Team Queue.
   */
  async createHumanTask(dto: CreateTaskDto, userId: string) {
    const taskId = `TASK-${Date.now()}`;
    this.logger.log(
      `Creating Human Task ${taskId} for Assignee: ${dto.assigneeId || 'TEAM'}`,
    );

    // In a real DB, save to a Task table. Here we use Event Sourcing.
    await this.eventStore.append({
      tenantId: dto.companyId,
      streamId: taskId,
      streamType: 'USER_TASK',
      eventType: 'TaskCreated',
      payload: dto,
      userId,
    });

    return { taskId, status: 'PENDING' };
  }

  /**
   * Completes a task and resumes the underlying Process Engine.
   */
  async completeTask(
    companyId: string,
    taskId: string,
    outputVariables: Record<string, unknown>,
    userId: string,
  ) {
    this.logger.log(`Completing Task ${taskId} by User ${userId}`);

    await this.eventStore.append({
      tenantId: companyId,
      streamId: taskId,
      streamType: 'USER_TASK',
      eventType: 'TaskCompleted',
      payload: { outputVariables },
      userId,
    });

    // An Event Listener (BpmOrchestrator) would pick this up and call processEngine.resumeProcess()
    return { status: 'COMPLETED' };
  }

  /**
   * Delegate a task to another user (e.g. Vacation Delegation).
   */
  async delegateTask(
    companyId: string,
    taskId: string,
    newAssigneeId: string,
    userId: string,
  ) {
    this.logger.log(`Delegating Task ${taskId} to ${newAssigneeId}`);

    await this.eventStore.append({
      tenantId: companyId,
      streamId: taskId,
      streamType: 'USER_TASK',
      eventType: 'TaskDelegated',
      payload: { previousAssignee: userId, newAssignee: newAssigneeId },
      userId,
    });
  }
}
