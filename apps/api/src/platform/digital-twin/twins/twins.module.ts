import { Module } from '@nestjs/common';
import { VehicleTwinService } from './vehicle.twin.service';

@Module({
  providers: [VehicleTwinService],
  exports: [VehicleTwinService],
})
export class TwinsModule {}
