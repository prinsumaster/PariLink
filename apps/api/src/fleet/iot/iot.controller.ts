import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IoTService } from './iot.service';

@ApiTags('fleet/iot')
@Controller('fleet/iot')
export class IoTController {
  constructor(private readonly iotService: IoTService) {}

  @Post('webhook/:providerId')
  @ApiOperation({ summary: 'Receive webhook payloads from IoT providers' })
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-api-key') apiKey: string,
    @Headers('x-provider-signature') signature: string,
  ) {
    // Basic API Key check for demonstration
    // In production, we'd validate the provider signature against a registered secret
    if (!apiKey) {
      throw new UnauthorizedException('Missing IoT API Key');
    }

    return this.iotService.ingestTelemetry('generic', payload);
  }
}
