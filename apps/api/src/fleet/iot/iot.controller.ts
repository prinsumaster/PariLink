import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import * as crypto from 'crypto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IoTService } from './iot.service';
import { ApiKeyService } from '../../iam/services/api-keys.service';
import { SecretsService } from '../../platform/security/secrets/secrets.service';

@ApiTags('fleet/iot')
@Controller('fleet/iot')
export class IoTController {
  constructor(
    private readonly iotService: IoTService,
    private readonly apiKeyService: ApiKeyService,
    private readonly secretsService: SecretsService,
  ) {}

  @Post('webhook/:providerId')
  @ApiOperation({ summary: 'Receive webhook payloads from IoT providers' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
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

    if (!signature) {
      throw new UnauthorizedException('Missing x-provider-signature header');
    }

    const secret = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'IOT_PROVIDER',
      'WEBHOOK_SECRET',
    );
    if (!secret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new UnauthorizedException('Missing raw body');
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    // Ensure the incoming signature is valid hex to prevent Buffer.from throwing
    const signatureBuffer = Buffer.from(
      /^[0-9a-fA-F]+$/.test(signature) ? signature : '',
      'hex',
    );

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      throw new UnauthorizedException('Invalid signature');
    }

    return this.iotService.ingestTelemetry('generic', payload);
  }
}
