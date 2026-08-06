import { Controller, Post, Req, Res, Headers, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('billing/stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  @Post('webhook')
  async handleWebhook(
    @Req() req: any,
    @Res() res: any,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Received Stripe Webhook');
    // Scaffolded: Needs Stripe library and Endpoint Secret to verify signature
    // const event = this.stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    // Fake event for scaffolding
    const event = req.body;

    switch (event.type) {
      case 'invoice.paid':
        this.logger.log('Invoice paid event processed');
        break;
      case 'invoice.payment_failed':
        this.logger.log('Invoice payment failed event processed');
        break;
      case 'customer.subscription.updated':
        this.logger.log('Subscription updated event processed');
        break;
      case 'customer.subscription.deleted':
        this.logger.log('Subscription deleted event processed');
        break;
      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
    }

    return res.status(200).send({ received: true });
  }
}
