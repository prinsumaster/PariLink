import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ApprovalEngineService {
  private readonly logger = new Logger(ApprovalEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('workflow_execution') private workflowQueue: Queue,
  ) {}

  /**
   * Spawns an approval request and pauses the execution
   */
  async requestApproval(
    companyId: string,
    executionId: string,
    nodeConfig: any,
    entityType: string,
    entityId: string,
  ) {
    const request = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.approvalRequest.create({
        data: {
          companyId,
          executionId,
          entityType,
          entityId,
          status: 'PENDING',
          steps: {
            create: nodeConfig.approvers.map((approver: any) => ({
              approverUserId: approver.userId,
              approverRoleId: approver.roleId,
            })),
          },
        },
      }),
    );

    this.logger.log(
      `Created Approval Request ${request.id} for Execution ${executionId}`,
    );
    return request;
  }

  /**
   * Process a human approval/rejection
   */
  async processDecision(
    companyId: string,
    requestId: string,
    stepId: string,
    userId: string,
    decision: 'APPROVED' | 'REJECTED',
    comments?: string,
  ) {
    const step = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.approvalStep.findUnique({
        where: { id: stepId },
        include: { request: true },
      }),
    );

    if (!step || step.request.companyId !== companyId) {
      throw new NotFoundException('Approval step not found');
    }

    if (step.status !== 'PENDING') {
      throw new BadRequestException('Approval step already processed');
    }

    // 1. Update step
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.approvalStep.update({
        where: { id: stepId },
        data: {
          status: decision,
          comments,
          decidedAt: new Date(),
        },
      }),
    );

    // 2. Check overall request status
    const allSteps = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.approvalStep.findMany({
        where: { requestId },
      }),
    );
    const allApproved = allSteps.every((s) =>
      s.id === stepId ? decision === 'APPROVED' : s.status === 'APPROVED',
    );
    const anyRejected = allSteps.some((s) =>
      s.id === stepId ? decision === 'REJECTED' : s.status === 'REJECTED',
    );

    let overallDecision = 'PENDING';
    if (anyRejected) overallDecision = 'REJECTED';
    else if (allApproved) overallDecision = 'APPROVED';

    if (overallDecision !== 'PENDING') {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.approvalRequest.update({
          where: { id: requestId },
          data: { status: overallDecision },
        }),
      );

      // 3. Resume Workflow Execution
      this.logger.log(
        `Approval Request ${requestId} resolved to ${overallDecision}. Resuming Workflow...`,
      );
      await this.workflowQueue.add('RESUME_EXECUTION', {
        companyId,
        executionId: step.request.executionId,
        resumeContext: { approvalResult: overallDecision },
      });
    }

    return { status: overallDecision };
  }
}
