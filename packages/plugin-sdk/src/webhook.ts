import crypto from 'crypto';

export interface WebhookPayload {
  eventId: string;
  eventType: string;
  timestamp: string;
  companyId: string;
  data: any;
}

export class WebhookHelper {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  public verifySignature(payload: string, signature: string): boolean {
    const hash = crypto.createHmac('sha256', this.secret)
                       .update(payload)
                       .digest('hex');
    
    try {
      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
      );
    } catch {
      return false;
    }
  }

  public parse(payload: string, signature: string): WebhookPayload {
    if (!this.verifySignature(payload, signature)) {
      throw new Error("Invalid webhook signature");
    }
    return JSON.parse(payload) as WebhookPayload;
  }
}
