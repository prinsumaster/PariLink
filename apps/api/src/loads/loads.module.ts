import { Module } from '@nestjs/common';
import { WorkflowModule } from '../workflow/workflow.module';
import { LoadsService } from './loads.service';
import { LoadsController } from './loads.controller';

@Module({
  imports: [WorkflowModule],
  controllers: [LoadsController],
  providers: [LoadsService],
  exports: [LoadsService],
})
export class LoadsModule {}
