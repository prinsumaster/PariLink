import { Injectable, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { SecretsService } from '../platform/security/secrets/secrets.service';

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);

  constructor(private readonly secretsService: SecretsService) {}

  private async getClient(): Promise<any> {
    const key_id = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'RAZORPAY',
      'KEY_ID',
    );
    const key_secret = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'RAZORPAY',
      'KEY_SECRET',
    );

    if (!key_id || !key_secret) {
      this.logger.warn(
        'Razorpay API keys missing from SecretsService. Billing disabled.',
      );
      return null;
    }

    return new Razorpay({
      key_id,
      key_secret,
    });
  }

  async createSubscription(
    planId: string,
    customerId: string,
    totalCount = 12,
  ) {
    const razorpay = await this.getClient();
    if (!razorpay) throw new Error('Razorpay not configured');
    try {
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: totalCount,
      });
      return subscription;
    } catch (error) {
      this.logger.error('Failed to create Razorpay subscription', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    const razorpay = await this.getClient();
    if (!razorpay) throw new Error('Razorpay not configured');
    return await razorpay.subscriptions.cancel(subscriptionId);
  }

  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    return expectedSignature === signature;
  }
}
