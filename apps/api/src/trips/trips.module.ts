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

import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [WorkflowModule, PlatformModule],
  controllers: [
    TripDesksController,
    LoadingEventsController,
    FuelEntriesController,
    TripsController,
  ],
  providers: [
    TripsService,
    TripDesksService,
    LoadingEventsService,
    FuelEntriesService,
  ],
  exports: [
    TripsService,
    TripDesksService,
    LoadingEventsService,
    FuelEntriesService,
  ],
})
export class TripsModule {}
