import { CreateWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto';
import {
  Controller,
  Post,
  Body,
  Param,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationAuthService } from '../../integration/auth/auth.service';
import * as crypto from 'crypto';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks/v1')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private prisma: PrismaService,
    private authService: IntegrationAuthService,
  ) {}

  @Post('incoming/:provider/:connectionId')
  @ApiOperation({
    summary: 'Receive incoming webhooks from external providers',
  })
  async receiveWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Param('provider') provider: string,
    @Param('connectionId') connectionId: string,
    @Headers('x-webhook-signature') signature: string,
    @Body() payload: CreateWebhookDto,
  ) {
    this.logger.log(
      `Received webhook from ${provider} for connection ${connectionId}`,
    );

    // Verify connection exists
    const connection = await this.prisma.runAsSystem('[WebhookController.receiveWebhook] Webhook handler bypass', async (tx) =>
      tx.integrationConnection.findUnique({
        where: { id: connectionId },
        include: { connector: true },
      }),
    );

    if (!connection || !connection.credentials) {
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);
    }

    let secret = '';
    try {
      const credsString = typeof connection.credentials === 'string' 
        ? connection.credentials 
        : JSON.stringify(connection.credentials);
      const credentials = this.authService.decryptCredentials(credsString);
      secret = credentials?.webhookSecret;
    } catch (e: any) {
      throw new HttpException('Invalid credentials state', HttpStatus.UNAUTHORIZED);
    }

    if (!secret) {
      throw new HttpException('Webhook secret not configured', HttpStatus.UNAUTHORIZED);
    }

    if (!signature) {
      throw new HttpException('Missing signature', HttpStatus.UNAUTHORIZED);
    }

    const payloadBuffer = req.rawBody || Buffer.from(JSON.stringify(payload));
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadBuffer)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(signature);

    if (
      expectedBuffer.length !== actualBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    // Log Delivery
    await this.prisma.runAsSystem('[WebhookController.receiveWebhook] Webhook handler bypass', async (tx) =>
      tx.webhookDelivery.create({
        data: {
          companyId: connection.companyId,
          direction: 'INCOMING',
          endpointUrl: req.url,
          eventTopic: (payload as any).event_type || 'unknown_event',
          payload: payload as any,
        },
      }),
    );

    // We would then push this to the EventBus/BullMQ for asynchronous processing.
    // e.g. this.eventBus.publish('integration.webhook.received', { connectionId, payload })

    return { status: 'Received', timestamp: new Date() };
  }
}
