import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Injectable()
@Processor('background_jobs', { concurrency: 10 })
export class WorkflowExecutorService extends WorkerHost {
  private readonly logger = new Logger(WorkflowExecutorService.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing workflow job ${job.id} of type ${job.name}`);

    try {
      switch (job.name) {
        case 'EXECUTE_DAG':
          return await this.executeDag(job.data);
        case 'WEBHOOK_TRIGGER':
          return await this.handleWebhookTrigger(job.data);
        default:
          this.logger.warn(`Unknown workflow job name: ${job.name}`);
          return { status: 'ignored' };
      }
    } catch (error) {
      this.logger.error(
        `Workflow execution failed: ${error.message}`,
        error.stack,
      );
      throw error; // Will be sent to Dead Letter Queue (DLQ) automatically by BullMQ
    }
  }

  private async executeDag(data: any) {
    // Scaffolded: DAG traversal and node execution
    this.logger.debug('Executing Workflow DAG with nodes and edges...');
    return { status: 'success', executedNodes: 2 };
  }

  private async handleWebhookTrigger(data: any) {
    this.logger.debug('Handling Webhook Trigger...');
    return { status: 'success' };
  }
}
