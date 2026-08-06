import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SchedulerEngineService {
  private readonly logger = new Logger(SchedulerEngineService.name);

  constructor(
    @InjectQueue('workflow_execution') private workflowQueue: Queue,
  ) {}

  /**
   * Schedules a delayed resumption of a workflow execution using BullMQ.
   */
  async scheduleDelay(
    companyId: string,
    executionId: string,
    nodeId: string,
    delayMs: number,
  ) {
    this.logger.log(
      `Execution ${executionId} pausing for ${delayMs}ms at Node ${nodeId}`,
    );

    await this.workflowQueue.add(
      'RESUME_EXECUTION',
      {
        companyId,
        executionId,
        resumeContext: { resumedFromNodeId: nodeId },
      },
      { delay: delayMs },
    );
  }
}
