import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { WebhookPlatformService } from './webhook-platform.service';

@ApiTags('Webhook Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integration/webhook')
export class WebhookPlatformController {
  constructor(private readonly webhookPlatform: WebhookPlatformService) {}

  @Get('deliveries')
  @RequirePermissions('webhooks:read')
  @ApiOperation({
    summary: 'List webhook deliveries with filtering and pagination',
  })
  async getDeliveryHistory(
    @GetUser() user: AuthenticatedUser,
    @Query('direction') direction?: string,
    @Query('status') status?: string,
    @Query('eventTopic') eventTopic?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.webhookPlatform.getDeliveryHistory(user.companyId, {
      direction,
      status,
      eventTopic,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Get('deliveries/:id')
  @RequirePermissions('webhooks:read')
  @ApiOperation({ summary: 'Get full details of a specific webhook delivery' })
  async getDeliveryDetails(
    @GetUser() user: AuthenticatedUser,
    @Param('id') deliveryId: string,
  ) {
    return this.webhookPlatform.getDeliveryDetails(user.companyId, deliveryId);
  }

  @Post('deliveries/:id/replay')
  @RequirePermissions('webhooks:write')
  @ApiOperation({
    summary: 'Replay a failed or dead-letter outgoing webhook delivery',
  })
  async replayDelivery(
    @GetUser() user: AuthenticatedUser,
    @Param('id') deliveryId: string,
  ) {
    return this.webhookPlatform.replayDelivery(
      user.companyId,
      deliveryId,
      user.userId,
    );
  }

  @Get('metrics')
  @RequirePermissions('webhooks:read')
  @ApiOperation({
    summary: 'Get webhook delivery telemetry metrics and success rates',
  })
  async getMetrics(@GetUser() user: AuthenticatedUser) {
    return this.webhookPlatform.getWebhookMetrics(user.companyId);
  }
}
