import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowExecutorService } from './engine/workflow-executor.service';
import { ConditionEngineService } from './engine/condition.service';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { WorkflowService as EngineWorkflowService } from './engine/workflow.service';
import { ApprovalEngineService } from './engine/approval.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'background_jobs' },
      { name: 'workflow_execution' }
    ),
  ],
  controllers: [WorkflowController],
  providers: [...(process.env.RUN_WORKERS === 'true' ? [WorkflowExecutorService] : []), WorkflowService, ConditionEngineService, EngineWorkflowService, ApprovalEngineService],
  exports: [...(process.env.RUN_WORKERS === 'true' ? [WorkflowExecutorService] : []), WorkflowService, ConditionEngineService],
})
export class WorkflowModule {}
