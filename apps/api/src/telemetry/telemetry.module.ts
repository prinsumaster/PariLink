import { Module } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway';
import { CommandGateway } from './command.gateway';

@Module({
  providers: [TelemetryGateway, CommandGateway],
  exports: [TelemetryGateway, CommandGateway],
})
export class TelemetryModule {}
