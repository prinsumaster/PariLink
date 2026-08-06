import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  private readonly logger = new Logger(SupportController.name);

  @Post('ticket')
  async createTicket(
    @Body() payload: { subject: string; description: string; priority: string },
  ) {
    this.logger.log(`Received support ticket: ${payload.subject}`);
    // Scaffolded: Push to Zendesk or Linear API
    return { success: true, ticketId: 'TKT-1001', status: 'OPEN' };
  }
}
