import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DigitalWorkerRegistry } from './digital-worker.registry';
import { EventService } from '../../platform/events/event.service';

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: DigitalWorkerRegistry,
    private readonly eventService: EventService,
  ) {}

  /**
   * Initializes the execution of a Graph-based Workflow (AI Decision converted to Action)
   */
  async startExecution(executionId: string) {
    this.logger.log(`Starting WorkflowExecution: ${executionId}`);

    // In a real DAG, we would identify root nodes and execute them.
    // For MVP, we fetch PENDING steps and execute them sequentially or in parallel based on graph dependencies.
    const steps = await this.prisma.runAsSystem(async (tx) =>
      tx.workflowExecutionStep.findMany({
        where: { executionId, status: 'PENDING' },
        orderBy: { executedAt: 'asc' }, // Simplified execution order
      }),
    );

    for (const step of steps) {
      await this.executeStep(step.id);
    }
  }

  /**
   * Executes a single step using the assigned Digital Worker
   */
  private async executeStep(stepId: string) {
    const step = await this.prisma.runAsSystem(async (tx) =>
      tx.workflowExecutionStep.findUnique({
        where: { id: stepId },
        include: { execution: true },
      }),
    );

    if (!step) return;

    this.logger.log(`Executing step ${step.nodeId} for worker ${step.owner}`);

    try {
      // Find the specific AI Worker responsible for this node
      const worker = this.registry.getWorker(step.owner || 'System_Default');

      const outputs = await worker.executeTask(step.nodeId, step.inputs);

      await this.prisma.runAsSystem(async (tx) =>
        tx.workflowExecutionStep.update({
          where: { id: stepId },
          data: { status: 'SUCCESS', outputs },
        }),
      );

      // Realtime Progress Tracking update
      this.eventService.publish('Execution.StepUpdated', {
        tenantId: step.execution.companyId,
        payload: { stepId, status: 'SUCCESS', executionId: step.executionId },
      });
    } catch (error) {
      this.logger.error(
        `Execution failed for step ${step.nodeId}: ${error.message}`,
      );
      await this.handleStepFailure(step, error.message);
    }
  }

  /**
   * Handles failure through Retry limits, then cascades to Rollback Compensation
   */
  private async handleStepFailure(step: any, errorMessage: string) {
    // 1. Retry Strategy
    const maxRetries = 3;
    if (step.retryCount < maxRetries) {
      this.logger.warn(
        `Retrying step ${step.nodeId} (Attempt ${step.retryCount + 1})`,
      );
      await this.prisma.runAsSystem(async (tx) =>
        tx.workflowExecutionStep.update({
          where: { id: step.id },
          data: { retryCount: step.retryCount + 1, error: errorMessage },
        }),
      );
      // Exponential Backoff in real implementation, here we re-execute immediately
      return this.executeStep(step.id);
    }

    // 2. Rollback Strategy (Compensation)
    this.logger.error(
      `Max retries reached for step ${step.nodeId}. Initiating Rollback.`,
    );
    await this.prisma.runAsSystem(async (tx) =>
      tx.workflowExecutionStep.update({
        where: { id: step.id },
        data: { status: 'FAILED', error: errorMessage },
      }),
    );

    if (step.rollbackAction) {
      try {
        const worker = this.registry.getWorker(step.owner || 'System_Default');
        await worker.rollbackTask(step.nodeId, step.inputs);
        this.logger.log(`Successfully rolled back step ${step.nodeId}`);
      } catch (rollbackError) {
        this.logger.error(
          `CRITICAL: Rollback failed for ${step.nodeId}: ${rollbackError.message}`,
        );
      }
    }

    // Fail the entire execution
    await this.prisma.runAsSystem(async (tx) =>
      tx.workflowExecution.update({
        where: { id: step.executionId },
        data: { status: 'FAILED', error: errorMessage },
      }),
    );

    this.eventService.publish('Execution.StepUpdated', {
      tenantId: step.execution.companyId,
      payload: {
        stepId: step.id,
        status: 'FAILED',
        executionId: step.executionId,
      },
    });
  }
}
