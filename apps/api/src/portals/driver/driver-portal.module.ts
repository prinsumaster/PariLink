import { Module } from '@nestjs/common';
import { DriverTripsController } from './trips/driver-trips.controller';
import { DriverTripsService } from './trips/driver-trips.service';
import { DriverChecklistsController } from './checklist/driver-checklists.controller';
import { DriverChecklistsService } from './checklist/driver-checklists.service';
import { DriverExpensesController } from './expenses/driver-expenses.controller';
import { DriverExpensesService } from './expenses/driver-expenses.service';
import { DriverTelemetryController } from './telemetry/driver-telemetry.controller';
import { DriverTelemetryService } from './telemetry/driver-telemetry.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    DriverTripsController,
    DriverChecklistsController,
    DriverExpensesController,
    DriverTelemetryController,
  ],
  providers: [
    DriverTripsService,
    DriverChecklistsService,
    DriverExpensesService,
    DriverTelemetryService,
  ],
  exports: [
    DriverTripsService,
    DriverChecklistsService,
    DriverExpensesService,
    DriverTelemetryService,
  ],
})
export class DriverPortalModule {}
