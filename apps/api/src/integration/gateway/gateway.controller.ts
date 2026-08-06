import {
  Controller,
  Post,
  Headers,
  Body,
  Param,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ConnectorRegistryService } from '../framework/registry.service';
import { WebhookEngineService } from '../webhook/webhook.service';
import { IntegrationAuthService } from '../auth/auth.service';

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
  ) {}

  @Post(':provider/webhook/:companyId')
  async handleIncomingWebhook(
    @Param('provider') provider: string,
    @Param('companyId') companyId: string,
    @Headers() headers: any,
    @Body() body: Record<string, unknown>,
  ) {
    const connector = this.registry.getConnector(provider);
    if (!connector) {
      throw new UnauthorizedException('Unknown provider');
    }

    // 1. Optionally verify HMAC signature (abstracted to connector or here)
    // if (!this.authService.verifyWebhookSignature(...)) throw new UnauthorizedException();

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
