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
import { CryptoService } from '../security/crypto.service';

@ApiTags('webhooks')
@Controller('webhooks/v1')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  @Post('incoming/:provider/:connectionId')
  @ApiOperation({
    summary: 'Receive incoming webhooks from external providers',
  })
  async receiveWebhook(
    @Param('provider') provider: string,
    @Param('connectionId') connectionId: string,
    @Headers('x-webhook-signature') signature: string,
    @Body() payload: Record<string, unknown>,
    @Req() req: any,
  ) {
    this.logger.log(
      `Received webhook from ${provider} for connection ${connectionId}`,
    );

    // Verify connection exists
    const connection = await this.prisma.runAsSystem(async (tx) =>
      tx.integrationConnection.findUnique({
        where: { id: connectionId },
        include: { connector: true },
      }),
    );

    if (!connection) {
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);
    }

    // In a production scenario, we would validate the `signature` against
    // the provider's specific hashing logic using our ConnectionSecret.

    // Log Delivery
    await this.prisma.runAsSystem(async (tx) =>
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
