import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Support')
@Controller('support')
@UseGuards(JwtAuthGuard)
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
