import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebhookEngineService {
  private readonly logger = new Logger(WebhookEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log an incoming webhook for audit and replayability
   */
  async logIncomingWebhook(
    companyId: string,
    endpointUrl: string,
    payload: any,
    status: string = 'SUCCESS',
    httpStatus?: number,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.webhookDelivery.create({
        data: {
          companyId,
          direction: 'INCOMING',
          endpointUrl,
          eventTopic: payload?.event || 'UNKNOWN',
          payload,
          status,
          httpStatus,
        },
      }),
    );
  }

  /**
   * Dispatch an outgoing webhook (e.g. PariLink -> Customer System)
   * In a real system, this pushes to BullMQ for reliable delivery.
   * For V1, we simulate delivery and log it.
   */
  async dispatchOutgoingWebhook(
    companyId: string,
    endpointUrl: string,
    eventTopic: string,
    payload: any,
  ) {
    const delivery = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.webhookDelivery.create({
        data: {
          companyId,
          direction: 'OUTGOING',
          endpointUrl,
          eventTopic,
          payload,
          status: 'PENDING',
        },
      }),
    );

    try {
      this.logger.log(`Dispatching webhook to ${endpointUrl}`);

      // Simulate HTTP call
      // const response = await axios.post(endpointUrl, payload);

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            status: 'SUCCESS',
            httpStatus: 200,
            responseBody: '{"success": true}',
          },
        }),
      );
    } catch (e: any) {
      this.logger.error(`Webhook delivery failed: ${e.message}`);
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            status: 'FAILED',
            httpStatus: e.response?.status || 500,
            responseBody: e.message,
          },
        }),
      );
      // A cron job or queue would pick up FAILED deliveries and retry up to MAX_RETRIES
    }
  }
}
