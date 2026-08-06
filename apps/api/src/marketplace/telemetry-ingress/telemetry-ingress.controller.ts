import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TelemetryIngressService } from './telemetry-ingress.service';
import type { StandardTelemetryPayload } from './telemetry-ingress.service';

@Controller('ingress/telemetry')
export class TelemetryIngressController {
  constructor(private readonly ingressService: TelemetryIngressService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestTelemetry(@Body() payload: StandardTelemetryPayload) {
    // In a high-scale production app, this would just drop the payload onto Kafka
    // and return 202 Accepted instantly. The processing would happen async.
    // For V4.2 MVP, we'll process synchronously via the service to prove the flow.
    const result = await this.ingressService.processIncomingTelemetry(payload);
    return {
      status: 'success',
      ...result,
    };
  }
}
