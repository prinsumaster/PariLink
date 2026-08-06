import { Module } from '@nestjs/common';
import { WorkflowModule } from '../workflow/workflow.module';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';

@Module({
  imports: [WorkflowModule],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
