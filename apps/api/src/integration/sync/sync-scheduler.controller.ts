import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { SyncEngineService } from './sync.service';

@ApiTags('Synchronization Scheduler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integration/sync')
export class SyncSchedulerController {
  constructor(private readonly syncEngine: SyncEngineService) {}

  @Post('schedules')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary: 'Schedule an automated recurring sync job using cron expression',
  })
  async scheduleSync(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: { connectionId: string; cronExpression: string; isActive?: boolean },
  ) {
    return this.syncEngine.scheduleSync(user.companyId, user.userId, dto);
  }

  @Get('schedules')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'List all active and inactive recurring sync schedules',
  })
  async listSchedules(@GetUser() user: AuthenticatedUser) {
    return this.syncEngine.listSchedules(user.companyId);
  }

  @Post('trigger')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary:
      'Manually trigger an immediate full or incremental synchronization',
  })
  async triggerSync(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { connectionId: string; entityType: string; payload?: any },
  ) {
    return this.syncEngine.triggerSync(
      user.companyId,
      dto.connectionId,
      dto.entityType,
      dto.payload,
    );
  }

  @Get('history')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'List sync job execution history and processed record counts',
  })
  async getSyncHistory(
    @GetUser() user: AuthenticatedUser,
    @Query('connectionId') connectionId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    return this.syncEngine.getSyncHistory(user.companyId, {
      connectionId,
      status,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Get('errors')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'List synchronization failure logs and exception stack traces',
  })
  async getSyncErrors(
    @GetUser() user: AuthenticatedUser,
    @Query('connectionId') connectionId?: string,
  ) {
    return this.syncEngine.getSyncErrors(user.companyId, connectionId);
  }

  @Post('errors/:id/resolve')
  @RequirePermissions('integrations:write')
  @ApiOperation({ summary: 'Mark a synchronization error as resolved' })
  async resolveError(
    @GetUser() user: AuthenticatedUser,
    @Param('id') errorId: string,
  ) {
    return this.syncEngine.resolveError(user.companyId, errorId, user.userId);
  }
}
