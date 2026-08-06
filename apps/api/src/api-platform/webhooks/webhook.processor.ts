/* eslint-disable @typescript-eslint/no-explicit-any */
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';
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

@Processor('webhooks_v2', { concurrency: 50 })
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'deliver_webhook') {
      const { endpointId, url, secret, payload, companyId } = job.data;
      const signature = this.generateSignature(payload, secret);

      // 1. Create a WebhookDelivery record (or update if retrying)
      const deliveryId = await this.recordDeliveryAttempt(
        job,
        companyId,
        url,
        payload.eventType,
        payload,
      );

      try {
        validateWebhookUrl(url);
        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-PariLink-Signature': signature,
            'X-PariLink-Delivery': deliveryId,
            'X-PariLink-Event': payload.eventType,
            'X-PariLink-Retry-Count': job.attemptsMade,
          },
          timeout: 10000, // 10s timeout
        });

        // 2. Mark Delivery Success
        await this.prisma.runAsSystem(async (tx) =>
          tx.webhookDelivery.update({
            where: { id: deliveryId },
            data: {
              status: 'SUCCESS',
              httpStatus: response.status,
              responseBody: JSON.stringify(response.data).substring(0, 1000), // Trim body
            },
          }),
        );

        this.logger.log(`Webhook delivery ${deliveryId} SUCCESS to ${url}`);
        return { deliveryId, status: 'SUCCESS' };
      } catch (error: any) {
        // 3. Handle Failure and Retries
        const httpStatus = error.response?.status || 500;
        const responseBody = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;

        const isLastAttempt = job.attemptsMade >= job.opts.attempts! - 1;
        const newStatus = isLastAttempt ? 'DEAD_LETTER' : 'FAILED';

        await this.prisma.runAsSystem(async (tx) =>
          tx.webhookDelivery.update({
            where: { id: deliveryId },
            data: {
              status: newStatus,
              httpStatus,
              responseBody: responseBody.substring(0, 1000),
              retryCount: job.attemptsMade + 1,
            },
          }),
        );

        this.logger.error(
          `Webhook delivery ${deliveryId} FAILED to ${url}. Attempt ${job.attemptsMade + 1}`,
        );

        if (!isLastAttempt) {
          throw error; // Throwing triggers BullMQ to retry (Exponential Backoff)
        }
      }
    }
  }

  private generateSignature(payload: any, secret: string): string {
    const stringifiedPayload = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secret)
      .update(stringifiedPayload)
      .digest('hex');
  }

  private async recordDeliveryAttempt(
    job: Job,
    companyId: string,
    url: string,
    eventTopic: string,
    payload: any,
  ): Promise<string> {
    if (job.attemptsMade === 0) {
      // First attempt
      const delivery = await this.prisma.runAsSystem(async (tx) =>
        tx.webhookDelivery.create({
          data: {
            companyId,
            direction: 'OUTGOING',
            endpointUrl: url,
            eventTopic,
            payload,
            status: 'PENDING',
            retryCount: 0,
          },
        }),
      );
      // Store deliveryId in job data for retries
      await job.updateData({ ...job.data, deliveryId: delivery.id });
      return delivery.id;
    } else {
      // Retry attempt
      return job.data.deliveryId;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }
}
