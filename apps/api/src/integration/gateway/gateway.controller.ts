import {
  Controller,
  Post,
  Headers,
  Body,
  Param,
  Get,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ConnectorRegistryService } from '../framework/registry.service';
import { WebhookEngineService } from '../webhook/webhook.service';
import { IntegrationAuthService } from '../auth/auth.service';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Public facing API Gateway for incoming third-party webhooks.
 * This does not use standard JWT guards because it receives traffic from external systems.
 * It handles raw provider routing and signature verification.
 */
@Controller('integration/gateway')
export class IntegrationGatewayController {
  constructor(
    private readonly registry: ConnectorRegistryService,
    private readonly webhookService: WebhookEngineService,
    private readonly authService: IntegrationAuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post(':provider/webhook/:companyId')
  async handleIncomingWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Param('provider') provider: string,
    @Param('companyId') companyId: string,
    @Headers() headers: any,
    @Body() body: Record<string, unknown>,
  ) {
    const connector = this.registry.getConnector(provider);
    if (!connector) {
      throw new UnauthorizedException('Unknown provider');
    }

    // 1. Verify HMAC signature
    const connection = await this.prisma.runAsSystem('Webhook verification bypass', async (tx) => {
      return tx.integrationConnection.findFirst({
        where: { companyId, connector: { provider: provider } },
      });
    });
    if (!connection || !connection.credentials) {
      throw new UnauthorizedException('Integration not configured');
    }
    
    let secret = '';
    try {
      const credsString = typeof connection.credentials === 'string' 
        ? connection.credentials 
        : JSON.stringify(connection.credentials);
      const credentials = this.authService.decryptCredentials(credsString);
      secret = credentials?.webhookSecret;
    } catch (e: any) {
      throw new UnauthorizedException('Invalid credentials state: ' + e.message);
    }

    if (!secret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const signature = headers['x-webhook-signature'] || headers['x-provider-signature'] || headers['signature'] || headers['x-hub-signature'] || headers['stripe-signature'];
    if (!signature) {
      throw new UnauthorizedException('Missing webhook signature');
    }
    
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new UnauthorizedException('Missing raw body');
    }

    const isValid = this.authService.verifyWebhookSignature(rawBody, signature, secret);
    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // 2. Delegate parsing to the specific connector
    const parsedPayload = await connector.receiveWebhook(headers, body);

    // 3. Log the incoming delivery for replayability
    await this.webhookService.logIncomingWebhook(
      companyId,
      `/${provider}/webhook`,
      parsedPayload,
    );

    return { status: 'Received' };
  }
}
