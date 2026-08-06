import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectQueue('webhooks') private readonly webhookQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Dispatches an event to all installed apps that subscribe to this event type
   */
  async dispatchEvent(companyId: string, eventType: string, data: any) {
    this.logger.log(`Dispatching event ${eventType} for company ${companyId}`);

    // Find all active apps for this company
    const installations = await this.prisma.runAsSystem(async (tx) =>
      tx.appInstallation.findMany({
        where: {
          companyId,
          status: 'ACTIVE',
        },
        include: {
          app: true,
        },
      }),
    );

    const jobs = [];

    for (const installation of installations) {
      // Find webhooks registered by this app
      const webhooks = await this.prisma.runAsSystem(async (tx) =>
        tx.marketplaceWebhook.findMany({
          where: {
            appId: installation.appId,
            isActive: true,
          },
        }),
      );

      for (const webhook of webhooks) {
        const events = webhook.events as string[];
        if (events.includes('*') || events.includes(eventType)) {
          // Retrieve credentials/secrets for HMAC signing
          // In a real scenario, this would be the decrypted API key from marketplaceCoreService
          const secret =
            (installation.settings as any)?.apiKey || 'default_secret';

          jobs.push({
            name: 'dispatch',
            data: {
              url: webhook.url,
              payload: {
                eventId: crypto.randomUUID(),
                eventType,
                timestamp: new Date().toISOString(),
                companyId,
                data,
              },
              secret,
              installationId: installation.id,
              webhookId: webhook.id,
            },
            opts: {
              attempts: 5,
              backoff: { type: 'exponential', delay: 1000 },
              removeOnComplete: true,
            },
          });
        }
      }
    }

    if (jobs.length > 0) {
      await this.webhookQueue.addBulk(jobs);
      this.logger.log(
        `Queued ${jobs.length} webhook deliveries for event ${eventType}`,
      );
    }
  }
}
