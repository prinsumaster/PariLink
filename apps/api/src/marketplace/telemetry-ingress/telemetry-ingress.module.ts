import { Module } from '@nestjs/common';
import { TelemetryIngressController } from './telemetry-ingress.controller';
import { TelemetryIngressService } from './telemetry-ingress.service';

@Module({
  controllers: [TelemetryIngressController],
  providers: [TelemetryIngressService],
  exports: [TelemetryIngressService],
})
export class TelemetryIngressModule {}
