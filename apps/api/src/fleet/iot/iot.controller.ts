import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IoTService } from './iot.service';
import { ApiKeyService } from '../../iam/services/api-keys.service';

@ApiTags('fleet/iot')
@Controller('fleet/iot')
export class IoTController {
  constructor(
    private readonly iotService: IoTService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  @Post('webhook/:providerId')
  @ApiOperation({ summary: 'Receive webhook payloads from IoT providers' })
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-api-key') apiKey: string,
    @Headers('x-provider-signature') signature: string,
  ) {
    if (!apiKey) {
      throw new UnauthorizedException('Missing IoT API Key');
    }

    const validKey = await this.apiKeyService.validateApiKey(apiKey);
    if (!validKey) {
      throw new UnauthorizedException('Invalid IoT API Key');
    }

    return this.iotService.ingestTelemetry('generic', payload);
  }
}
