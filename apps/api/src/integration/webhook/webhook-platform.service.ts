import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import axios from 'axios';
import { validateSsrfSafeUrl } from '../../platform/security/ssrf-protector.util';
import * as crypto from 'crypto';

@Injectable()
export class WebhookPlatformService {
  private readonly logger = new Logger(WebhookPlatformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getDeliveryHistory(
    companyId: string,
    query: {
      direction?: string;
      status?: string;
      eventTopic?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = { companyId };
    if (query.direction) where.direction = query.direction;
    if (query.status) where.status = query.status;
    if (query.eventTopic) where.eventTopic = query.eventTopic;

    const [deliveries, total] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.findMany({
          where,
          take: query.limit || 50,
          skip: query.offset || 0,
          orderBy: { createdAt: 'desc' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.count({ where }),
      ),
    ]);

    return {
      deliveries,
      total,
      limit: query.limit || 50,
      offset: query.offset || 0,
    };
  }

  async getDeliveryDetails(companyId: string, deliveryId: string) {
    const delivery = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.webhookDelivery.findUnique({
        where: { id: deliveryId },
      }),
    );
    if (!delivery || delivery.companyId !== companyId) {
      throw new NotFoundException('Webhook delivery record not found');
    }
    return delivery;
  }

  async replayDelivery(companyId: string, deliveryId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const delivery = await tx.webhookDelivery.findUnique({
        where: { id: deliveryId },
      });

      if (!delivery || delivery.companyId !== companyId) {
        throw new NotFoundException('Webhook delivery record not found');
      }

      if (delivery.direction !== 'OUTGOING') {
        throw new BadRequestException(
          'Only OUTGOING webhooks can be replayed from the developer platform',
        );
      }

      this.logger.log(
        `Replaying webhook delivery ${deliveryId} to ${delivery.endpointUrl}`,
      );

      const newDelivery = await tx.webhookDelivery.create({
        data: {
          companyId,
          direction: 'OUTGOING',
          endpointUrl: delivery.endpointUrl,
          eventTopic: delivery.eventTopic,
          payload: delivery.payload as any,
          status: 'PENDING',
          retryCount: delivery.retryCount + 1,
        },
      });

      try {
        const payloadStr = JSON.stringify(delivery.payload);
        const secret = process.env.WEBHOOK_SECRET || 'whsec_replay_secret';
        const signature = crypto
          .createHmac('sha256', secret)
          .update(payloadStr)
          .digest('hex');

        if (!(await validateSsrfSafeUrl(delivery.endpointUrl))) {
          throw new Error(
            'Invalid or restricted webhook URL (SSRF prevention).',
          );
        }

        const res = await axios.post(delivery.endpointUrl, delivery.payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-PariLink-Signature': signature,
            'X-PariLink-Delivery': newDelivery.id,
            'X-PariLink-Event': delivery.eventTopic,
            'X-PariLink-Replay-Of': delivery.id,
          },
          timeout: 10000,
          maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects
        });

        await tx.webhookDelivery.update({
          where: { id: newDelivery.id },
          data: {
            status: 'SUCCESS',
            httpStatus: res.status,
            responseBody: JSON.stringify(res.data).substring(0, 1000),
          },
        });
      } catch (err: any) {
        const httpStatus = err.response?.status || 500;
        const responseBody = err.response?.data
          ? JSON.stringify(err.response.data)
          : err.message;
        await tx.webhookDelivery.update({
          where: { id: newDelivery.id },
          data: {
            status: 'FAILED',
            httpStatus,
            responseBody: responseBody.substring(0, 1000),
          },
        });
      }

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'WebhookDelivery',
        entityId: delivery.id,
        action: 'REPLAY_WEBHOOK',
        details: {
          newDeliveryId: newDelivery.id,
          endpointUrl: delivery.endpointUrl,
        },
      });

      return tx.webhookDelivery.findUnique({ where: { id: newDelivery.id } });
    });
  }

  async getWebhookMetrics(companyId: string) {
    const [
      totalIncoming,
      totalOutgoing,
      successCount,
      failedCount,
      deadLetterCount,
    ] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.count({
          where: { companyId, direction: 'INCOMING' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.count({
          where: { companyId, direction: 'OUTGOING' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.count({ where: { companyId, status: 'SUCCESS' } }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.count({ where: { companyId, status: 'FAILED' } }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.webhookDelivery.count({
          where: { companyId, status: 'DEAD_LETTER' },
        }),
      ),
    ]);

    return {
      totalIncoming,
      totalOutgoing,
      successCount,
      failedCount,
      deadLetterCount,
      successRate:
        totalOutgoing + totalIncoming > 0
          ? ((successCount / (totalOutgoing + totalIncoming)) * 100).toFixed(
              2,
            ) + '%'
          : '100%',
    };
  }
}
