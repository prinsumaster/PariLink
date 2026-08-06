import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import {
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  DispatchNotificationDto,
} from '../dto/notification.dto';

import { NotificationOrchestratorService } from '../engine/notification-orchestrator.service';

@ApiTags('Enterprise Notification & Multi-Channel Alerting Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('notifications/enterprise')
export class EnterpriseNotificationController {
  constructor(private readonly orchestrator: NotificationOrchestratorService) {}

  @Post('templates')
  @RequirePermissions('notifications:create')
  @ApiOperation({ summary: 'Create a notification template rule' })
  async createTemplate(
    @Body() dto: CreateNotificationTemplateDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.orchestrator.createTemplate(user.companyId, user.userId, dto);
  }

  @Get('templates')
  @RequirePermissions('notifications:read')
  @ApiOperation({ summary: 'Get notification templates' })
  async getTemplates(
    @Query('eventType') eventType?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.orchestrator.getTemplates(user.companyId, eventType);
  }

  @Put('templates/:id')
  @RequirePermissions('notifications:update')
  @ApiOperation({ summary: 'Update notification template rule' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationTemplateDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.orchestrator.updateTemplate(
      user.companyId,
      id,
      user.userId,
      dto,
    );
  }

  @Delete('templates/:id')
  @RequirePermissions('notifications:delete')
  @ApiOperation({ summary: 'Delete notification template rule' })
  async deleteTemplate(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.orchestrator.deleteTemplate(user.companyId, id, user.userId);
  }

  @Post('dispatch')
  @RequirePermissions('notifications:create')
  @ApiOperation({
    summary: 'Dispatch multi-channel notification (In-App, SMS, Email, Slack)',
  })
  async dispatch(
    @Body() dto: DispatchNotificationDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.orchestrator.dispatchNotification(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Get('metrics')
  @RequirePermissions('notifications:read')
  @ApiOperation({
    summary: 'Get real-time notification delivery and channel metrics',
  })
  async getMetrics(@GetUser() user: AuthenticatedUser) {
    return this.orchestrator.getDeliveryMetrics(user.companyId);
  }

  @Post('retry-failed')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('notifications:update')
  @ApiOperation({ summary: 'Batch retry failed notification deliveries' })
  async retryFailed(@GetUser() user: AuthenticatedUser) {
    return this.orchestrator.retryFailedDeliveries(user.companyId, user.userId);
  }
}
