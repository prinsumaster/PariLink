import { Module } from '@nestjs/common';
import { WorkflowModule } from '../workflow/workflow.module';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TripDesksService } from './trip-desks.service';
import { TripDesksController } from './trip-desks.controller';
import { LoadingEventsService } from './loading-events.service';
import { LoadingEventsController } from './loading-events.controller';
import { FuelEntriesController } from './fuel-entries.controller';
import { FuelEntriesService } from './fuel-entries.service';

@Module({
  imports: [WorkflowModule],
  controllers: [TripsController, TripDesksController, LoadingEventsController, FuelEntriesController],
  providers: [TripsService, TripDesksService, LoadingEventsService, FuelEntriesService],
  exports: [TripsService, TripDesksService, LoadingEventsService, FuelEntriesService],
})
export class TripsModule {}
