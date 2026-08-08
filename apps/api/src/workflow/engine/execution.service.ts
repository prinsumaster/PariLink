import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionEngineService } from './action.service';
import { ApprovalEngineService } from './approval.service';
import { ConditionEngineService } from './condition.service';
import { SchedulerEngineService } from './scheduler.service';
import { ModuleRef } from '@nestjs/core';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ExecutionEngineService {
  private readonly logger = new Logger(ExecutionEngineService.name);

  private approvalEngine!: ApprovalEngineService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly actionEngine: ActionEngineService,
    private readonly conditionEngine: ConditionEngineService,
    @Inject(forwardRef(() => SchedulerEngineService))
    private readonly schedulerEngine: SchedulerEngineService,
    private moduleRef: ModuleRef,
    @InjectQueue('workflow_execution') private workflowQueue: Queue,
  ) {}

  onModuleInit() {
    this.approvalEngine = this.moduleRef.get(ApprovalEngineService, {
      strict: false,
    });
  }

  /**
   * Starts a new workflow execution
   */
  async startExecution(
    companyId: string,
    workflowId: string,
    triggerPayload: Record<string, unknown>,
    graph: {
      nodes: Array<Record<string, unknown>>;
      edges: Array<Record<string, unknown>>;
    },
  ) {
    const execution = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowExecution.create({
        data: {
          companyId,
          workflowId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          triggerPayload: triggerPayload as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context: { ...triggerPayload } as any, // Initial context is the trigger event payload
          status: 'RUNNING',
        },
      }),
    );

    // Find the first node (usually connected to TRIGGER node)
    const triggerNode = graph.nodes.find((n) => n.type === 'TRIGGER');
    if (triggerNode) {
      await this.processNextNodes(
        companyId,
        execution.id,
        triggerNode.id as string,
        graph,
        execution.context as Record<string, unknown>,
      );
    }

    return execution;
  }

  /**
   * Resumes execution after a Wait, Delay, or Approval node
   */
  async resumeExecution(
    companyId: string,
    executionId: string,
    resumeContext: Record<string, unknown>,
  ) {
    const execution = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowExecution.findUnique({
        where: { id: executionId, companyId },
        include: { workflow: true },
      }),
    );

    if (
      !execution ||
      (execution.status !== 'WAITING_APPROVAL' &&
        execution.status !== 'RUNNING')
    )
      return;

    // Update execution context with the new data
    const updatedContext = {
      ...(execution.context as object),
      ...resumeContext,
    };
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowExecution.update({
        where: { id: executionId },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { context: updatedContext as any, status: 'RUNNING' },
      }),
    );

    // In a real system, we must track which node we paused at. For this V1,
    // we assume the resume context tells us the node to resume from
    const nodeId = resumeContext.resumedFromNodeId as string | undefined;
    if (nodeId && execution.workflow.graphPayload) {
      await this.processNextNodes(
        companyId,
        executionId,
        nodeId,
        execution.workflow.graphPayload as {
          nodes: Array<Record<string, unknown>>;
          edges: Array<Record<string, unknown>>;
        },
        updatedContext,
      );
    }

    this.logger.log(`Resumed Execution ${executionId}`);
  }

  /**
   * Processes outbound edges from a node and queues the next nodes for execution
   */
  public async processNextNodes(
    companyId: string,
    executionId: string,
    currentNodeId: string,
    graph: {
      nodes: Array<Record<string, unknown>>;
      edges: Array<Record<string, unknown>>;
    },
    context: Record<string, unknown>,
  ) {
    // Find outbound edges
    const edges = graph.edges.filter((e) => e.source === currentNodeId);

    const jobs = [];

    for (const edge of edges) {
      // Evaluate edge condition if any (for Decision nodes)
      if (
        edge.condition &&
        !this.conditionEngine.evaluate(edge.condition, context)
      ) {
        continue; // Condition not met, skip this edge
      }

      const nextNode = graph.nodes.find((n) => n.id === edge.target);
      if (nextNode) {
        jobs.push({
          name: 'EXECUTE_NODE',
          data: {
            companyId,
            executionId,
            node: nextNode,
            graph,
            context,
          },
          opts: {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
          },
        });
      }
    }

    if (jobs.length > 0) {
      await this.workflowQueue.addBulk(jobs);
    } else {
      // No more edges. Mark execution completed if not waiting.
      const exec = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.workflowExecution.findUnique({
          where: { id: executionId },
        }),
      );
      if (exec?.status === 'RUNNING') {
        await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.workflowExecution.update({
            where: { id: executionId },
            data: { status: 'COMPLETED', completedAt: new Date() },
          }),
        );
      }
    }
  }

  /**
   * Executes a specific node logic - Called from BullMQ Processor!
   */
  public async executeNode(
    companyId: string,
    executionId: string,
    node: Record<string, unknown>,
    graph: {
      nodes: Array<Record<string, unknown>>;
      edges: Array<Record<string, unknown>>;
    },
    context: Record<string, unknown>,
  ) {
    this.logger.log(`Executing Node ${node.id} (${node.type})`);

    const step = await this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Verify tenant ownership (IDOR protection for background workers)
      const exec = await tx.workflowExecution.findFirst({
        where: { id: executionId, companyId },
      });
      if (!exec) {
        throw new Error(
          `Unauthorized: Execution ${executionId} does not belong to company ${companyId}`,
        );
      }

      return tx.workflowExecutionStep.create({
        data: {
          executionId,
          nodeId: node.id as string,
          nodeType: node.type as string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputs: context as any,
        },
      });
    });

    try {
      let outputContext = {};
      let pauseExecution = false;

      switch (node.type) {
        case 'ACTION':
          const result = await this.actionEngine.executeAction(
            companyId,
            node.data as Record<string, unknown>,
            context,
          );
          outputContext = { [`${node.id}_result`]: result };
          break;

        case 'APPROVAL':
          await this.approvalEngine.requestApproval(
            companyId,
            executionId,
            node.data,
            context.entityType as string,
            context.entityId as string,
          );
          pauseExecution = true;
          break;

        case 'DELAY':
          await this.schedulerEngine.scheduleDelay(
            companyId,
            executionId,
            node.id as string,
            (node.data as Record<string, unknown>).delayMs as number,
          );
          pauseExecution = true;
          break;

        case 'END':
          await this.prisma.runAsTenant(companyId, async (tx) =>
            tx.workflowExecution.update({
              where: { id: executionId },
              data: { status: 'COMPLETED', completedAt: new Date() },
            }),
          );
          pauseExecution = true;
          break;

        default:
          // Condition/Decision nodes just pass through context
          break;
      }

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.workflowExecutionStep.update({
          where: { id: step.id },
          data: { status: 'SUCCESS', outputs: outputContext },
        }),
      );

      // Update global context
      const newContext = { ...context, ...outputContext };
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.workflowExecution.update({
          where: { id: executionId },
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            context: newContext as any,
            status: pauseExecution ? 'WAITING_APPROVAL' : 'RUNNING',
          },
        }),
      );

      if (!pauseExecution) {
        await this.processNextNodes(
          companyId,
          executionId,
          node.id as string,
          graph,
          newContext,
        );
      }
    } catch (e: unknown) {
      const err = e as Error;
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.workflowExecutionStep.update({
          where: { id: step.id },
          data: { status: 'FAILED', error: err.message },
        }),
      );
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.workflowExecution.update({
          where: { id: executionId },
          data: { status: 'FAILED', error: err.message },
        }),
      );
      throw err; // Throw so BullMQ retries
    }
  }
}
