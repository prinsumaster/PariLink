import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ExecutionEngineService } from './execution.service';

@Processor('workflow_execution', { concurrency: 20 })
export class WorkflowExecutionProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowExecutionProcessor.name);

  constructor(private executionEngine: ExecutionEngineService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { name, data } = job;
    this.logger.log(`Processing Job ${name} for Execution ${data.executionId}`);

    if (name === 'EXECUTE_NODE') {
      await this.executionEngine.executeNode(
        data.companyId,
        data.executionId,
        data.node,
        data.graph,
        data.context,
      );
    } else if (name === 'RESUME_EXECUTION') {
      await this.executionEngine.resumeExecution(
        data.companyId,
        data.executionId,
        data.resumeContext,
      );
    }
  }
}
