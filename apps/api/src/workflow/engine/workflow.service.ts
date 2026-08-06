import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new Workflow Definition
   * The graphPayload represents a Directed Graph of nodes and edges
   */
  async createWorkflow(companyId: string, data: any, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowDefinition.create({
        data: {
          companyId,
          name: data.name,
          description: data.description,
          triggerEvent: data.triggerEvent,
          graphPayload: data.graphPayload,
          status: 'DRAFT',
          createdBy: userId,
          updatedBy: userId,
        },
      }),
    );
  }

  /**
   * Publish a workflow
   */
  async publishWorkflow(companyId: string, workflowId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowDefinition.update({
        where: { id: workflowId, companyId },
        data: { status: 'PUBLISHED', updatedBy: userId },
      }),
    );
  }

  /**
   * Archive a workflow
   */
  async archiveWorkflow(companyId: string, workflowId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowDefinition.update({
        where: { id: workflowId, companyId },
        data: { status: 'ARCHIVED', updatedBy: userId },
      }),
    );
  }

  /**
   * Get workflow observability metrics
   */
  async getMetrics(companyId: string) {
    const totalExecutions = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.workflowExecution.count({
          where: { companyId },
        }),
    );
    const failedExecutions = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.workflowExecution.count({
          where: { companyId, status: 'FAILED' },
        }),
    );
    const completedExecutions = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.workflowExecution.count({
          where: { companyId, status: 'COMPLETED' },
        }),
    );

    return {
      total: totalExecutions,
      successRate: totalExecutions
        ? ((completedExecutions / totalExecutions) * 100).toFixed(2)
        : 0,
      failureRate: totalExecutions
        ? ((failedExecutions / totalExecutions) * 100).toFixed(2)
        : 0,
    };
  }

  /**
   * Get execution history for a specific workflow
   */
  async getExecutionHistory(companyId: string, workflowId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workflowExecution.findMany({
        where: { companyId, workflowId },
        include: { steps: true },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }
}
