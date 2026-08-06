import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowExecutorService } from './engine/workflow-executor.service';
import { ConditionEngineService } from './engine/condition.service';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'background_jobs',
    }),
  ],
  providers: [WorkflowExecutorService, WorkflowService, ConditionEngineService],
  exports: [WorkflowExecutorService, WorkflowService, ConditionEngineService],
})
export class WorkflowModule {}
