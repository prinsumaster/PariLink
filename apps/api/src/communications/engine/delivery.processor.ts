import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailProvider } from '../channels/email.provider';
import { SmsProvider } from '../channels/sms.provider';
import { SlackProvider } from '../channels/slack.provider';

export interface DeliveryJobPayload {
  deliveryId: string;
}

@Processor('notification-delivery', { concurrency: 100 })
export class DeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(DeliveryProcessor.name);

  constructor(
    private prisma: PrismaService,
    private emailProvider: EmailProvider,
    private smsProvider: SmsProvider,
    private slackProvider: SlackProvider,
  ) {
    super();
  }

  async process(job: Job<DeliveryJobPayload, any, string>): Promise<any> {
    const deliveryId = job.data.deliveryId;
    this.logger.log(
      `Processing delivery job ${job.id} for delivery ${deliveryId}`,
    );

    const delivery = await this.prisma.runAsSystem(async (tx) =>
      tx.notificationDelivery.findUnique({
        where: { id: deliveryId },
      }),
    );

    if (!delivery || delivery.status !== 'PENDING') {
      return; // Already processed or doesn't exist
    }

    try {
      let success = false;
      let providerResponse = null;

      if (delivery.channel === 'EMAIL') {
        providerResponse = await this.emailProvider.send(
          delivery.recipient,
          delivery.payload,
        );
        success = true;
      } else if (delivery.channel === 'SMS') {
        providerResponse = await this.smsProvider.send(
          delivery.recipient,
          delivery.payload,
        );
        success = true;
      } else if (delivery.channel === 'SLACK') {
        providerResponse = await this.slackProvider.send(
          delivery.recipient,
          delivery.payload,
        );
        success = true;
      } else {
        throw new Error(`Unsupported channel: ${delivery.channel}`);
      }

      await this.prisma.runAsSystem(async (tx) =>
        tx.notificationDelivery.update({
          where: { id: delivery.id },
          data: {
            status: 'DELIVERED',
            sentAt: new Date(),
            providerId: providerResponse?.id || 'mock_id',
          },
        }),
      );

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Delivery failed: ${errorMessage}`);

      const retryCount = delivery.retryCount + 1;
      const newStatus = retryCount >= 3 ? 'FAILED' : 'PENDING';

      await this.prisma.runAsSystem(async (tx) =>
        tx.notificationDelivery.update({
          where: { id: delivery.id },
          data: {
            status: newStatus,
            errorMessage,
            retryCount,
          },
        }),
      );

      if (newStatus === 'PENDING') {
        throw error; // Let BullMQ handle retry
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }
}
