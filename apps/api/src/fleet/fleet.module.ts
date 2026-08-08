import { Module } from '@nestjs/common';
import { VehicleLifecycleController } from './lifecycle/vehicle-lifecycle.controller';
import { VehicleLifecycleService } from './lifecycle/vehicle-lifecycle.service';
import { FleetMaintenanceController } from './maintenance/fleet-maintenance.controller';
import { FleetMaintenanceService } from './maintenance/fleet-maintenance.service';
import { IoTController } from './iot/iot.controller';
import { IoTService } from './iot/iot.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [
    VehicleLifecycleController,
    FleetMaintenanceController,
    IoTController,
  ],
  providers: [VehicleLifecycleService, FleetMaintenanceService, IoTService],
  exports: [VehicleLifecycleService, FleetMaintenanceService, IoTService],
})
export class FleetModule {}
