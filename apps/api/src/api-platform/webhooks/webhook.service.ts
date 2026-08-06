import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { AuditService } from '../../platform/audit/audit.service';

const SUPPORTED_EVENTS = [
  'load.created',
  'load.updated',
  'load.completed',
  'trip.created',
  'trip.started',
  'trip.completed',
  'driver.created',
  'driver.updated',
  'invoice.created',
  'invoice.paid',
  'workflow.rule.passed',
  'workflow.rule.failed',
  'dispatch.created',
  'dispatch.updated',
];

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectQueue('webhooks_v2') private readonly webhookQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @OnEvent('**')
  async handleDomainEvent(event: string, payload: any) {
    if (!SUPPORTED_EVENTS.includes(event)) {
      return;
    }

    const companyId = payload?.companyId || payload?.data?.companyId;
    if (!companyId) {
      this.logger.warn(
        `Event ${event} missing companyId, cannot dispatch webhooks.`,
      );
      return;
    }

    this.logger.log(`Dispatching event ${event} for company ${companyId}`);

    const endpoints = await this.prisma.runAsSystem(async (tx) =>
      tx.webhookEndpoint.findMany({
        where: {
          companyId,
          isActive: true,
        },
      }),
    );

    const jobs = [];

    for (const endpoint of endpoints) {
      const subscribedEvents = endpoint.events as string[];
      if (subscribedEvents.includes('*') || subscribedEvents.includes(event)) {
        // Construct the Payload
        const webhookPayload = {
          eventId: crypto.randomUUID(),
          eventType: event,
          timestamp: new Date().toISOString(),
          companyId,
          data: payload,
        };

        jobs.push({
          name: 'deliver_webhook',
          data: {
            endpointId: endpoint.id,
            url: endpoint.url,
            secret: endpoint.secret,
            payload: webhookPayload,
            companyId,
          },
          opts: {
            attempts: endpoint.retryCount > 0 ? endpoint.retryCount : 5,
            backoff: { type: 'exponential', delay: 2000 },
          },
        });
      }
    }

    if (jobs.length > 0) {
      await this.webhookQueue.addBulk(jobs);
      this.logger.log(
        `Queued ${jobs.length} webhook deliveries for event ${event}`,
      );
    }
  }

  // --- CRUD Operations ---

  async createWebhook(
    companyId: string,
    userId: string,
    data: { url: string; events: string[] },
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

      const endpoint = await tx.webhookEndpoint.create({
        data: {
          companyId,
          url: data.url,
          secret,
          events: data.events,
        },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'WebhookEndpoint',
        entityId: endpoint.id,
        action: 'CREATE',
        afterValue: endpoint,
      });

      return endpoint;
    });
  }

  async getWebhooks(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.webhookEndpoint.findMany({
        where: { companyId },
      }),
    );
  }

  async deleteWebhook(companyId: string, userId: string, endpointId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const endpoint = await tx.webhookEndpoint.update({
        where: { id: endpointId },
        data: { isActive: false },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'WebhookEndpoint',
        entityId: endpoint.id,
        action: 'DELETE',
        afterValue: { isActive: false },
      });

      return endpoint;
    });
  }
}
