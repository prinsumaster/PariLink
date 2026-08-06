import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiV2AuthGuard } from '../guards/api-v2-auth.guard';
import { WebhookService } from '../../webhooks/webhook.service';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';

@ApiTags('Webhooks')
@ApiBearerAuth('JWT-Auth')
@ApiSecurity('API-Key')
@ApiSecurity('OAuth2')
@UseGuards(ApiV2AuthGuard)
@Controller({ path: 'webhooks', version: '2' })
export class WebhooksV2Controller {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiOperation({ summary: 'Register a webhook endpoint' })
  async createWebhook(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { url: string; events: string[] },
  ) {
    return this.webhookService.createWebhook(user.companyId, user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered webhooks' })
  async getWebhooks(@GetUser() user: AuthenticatedUser) {
    return this.webhookService.getWebhooks(user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook endpoint' })
  async deleteWebhook(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.webhookService.deleteWebhook(user.companyId, user.userId, id);
  }
}
