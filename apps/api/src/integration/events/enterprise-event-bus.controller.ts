import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { EnterpriseEventBusService } from './enterprise-event-bus.service';

@ApiTags('Enterprise Event Bus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integration/events')
export class EnterpriseEventBusController {
  constructor(private readonly eventBus: EnterpriseEventBusService) {}

  @Post('publish')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary: 'Publish a structured domain event to the enterprise event bus',
  })
  async publishEvent(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: {
      streamId: string;
      streamType: string;
      eventType: string;
      payload: any;
      metadata?: any;
      correlationId?: string;
    },
  ) {
    return this.eventBus.publishEvent(user.companyId, user.userId, dto);
  }

  @Get('history')
  @RequirePermissions('integrations:read')
  @ApiOperation({ summary: 'List chronological domain event stream history' })
  async getEventHistory(
    @GetUser() user: AuthenticatedUser,
    @Query('streamType') streamType?: string,
    @Query('streamId') streamId?: string,
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.eventBus.getEventHistory(user.companyId, {
      streamType,
      streamId,
      eventType,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Post('replay')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary:
      'Replay a sequence of domain events for state reconstruction or synchronization',
  })
  async replayEvents(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { streamId: string; fromVersion: number; toVersion: number },
  ) {
    return this.eventBus.replayEvents(
      user.companyId,
      dto.streamId,
      dto.fromVersion,
      dto.toVersion,
      user.userId,
    );
  }
}
