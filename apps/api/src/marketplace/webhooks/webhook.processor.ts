import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { validateSsrfSafeUrl } from '../../platform/security/ssrf-protector.util';
import { PrismaService } from '../../prisma/prisma.service';
import { URL } from 'url';

function validateWebhookUrl(targetUrl: string) {
  const parsed = new URL(targetUrl);
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '169.254.169.254',
    '::1',
  ];
  if (
    blockedHosts.includes(parsed.hostname) ||
    parsed.hostname.endsWith('.internal')
  ) {
    throw new Error(
      'SSRF Blocked: Cannot dispatch webhooks to internal infrastructure.',
    );
  }
}

@Processor('webhooks', { concurrency: 50 })
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { url, payload, secret, installationId, webhookId } = job.data;
    this.logger.log(
      `Processing webhook delivery to ${url} (Job ID: ${job.id})`,
    );

    const payloadString = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    const startTime = Date.now();
    let status = 0;
    let success = false;
    let errorMessage = '';

    try {
      if (!(await validateSsrfSafeUrl(url))) {
        throw new Error(
          'SSRF attempt blocked: Webhook URL is invalid or targets restricted internal IPs',
        );
      }

      const response = await axios.post(url, payloadString, {
        headers: {
          'Content-Type': 'application/json',
          'X-PariLink-Signature': signature,
          'X-PariLink-Event': payload.eventType,
          'X-PariLink-Delivery': job.id,
        },
        timeout: 10000, // 10 second timeout for webhooks
        maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects
      });
      status = response.status;
      success = status >= 200 && status < 300;
    } catch (error: any) {
      status = error.response?.status || 0;
      errorMessage = error.message;
      this.logger.error(`Webhook delivery failed for ${url}: ${errorMessage}`);

      // If it's a 4xx error (except 429), don't retry as it's a client issue
      if (status >= 400 && status < 500 && status !== 429) {
        throw new UnrecoverableError(
          `Client error ${status}, aborting retries.`,
        );
      }

      // For 5xx, timeouts, or network issues, throw to trigger BullMQ retry
      throw error;
    } finally {
      const duration = Date.now() - startTime;

      // Log the delivery attempt in the database
      await this.prisma.runAsSystem(async (tx) =>
        tx.marketplaceWebhookDelivery.create({
          data: {
            webhookId,
            eventId: payload.eventId,
            status,
            success,
            duration,
            error: errorMessage || null,
            payload: payload,
          },
        }),
      );

      // Update app usage stats (API calls metric)
      if (success) {
        await this.prisma.runAsSystem(async (tx) =>
          tx.marketplaceUsageStats.upsert({
            where: {
              appId_companyId_periodStart: {
                appId: installationId.split('_')[1] || 'unknown', // Workaround for missing direct appId reference
                companyId: payload.companyId,
                periodStart: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
            update: {
              apiCallsCount: { increment: 1 },
            },
            create: {
              appId: installationId.split('_')[1] || 'unknown',
              companyId: payload.companyId,
              periodStart: new Date(new Date().setHours(0, 0, 0, 0)),
              apiCallsCount: 1,
              bandwidthBytes: Buffer.byteLength(payloadString, 'utf8'),
            },
          }),
        );
      }
    }

    return { success, status };
  }
}
