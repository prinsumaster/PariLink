import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('dispatch')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('board')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get aggregated dispatch board data' })
  getBoardData(@GetUser() user: AuthenticatedUser) {
    return this.dispatchService.getBoardData(user.companyId);
  }

  @Put('board/move')
  @RequirePermissions('dispatch:update')
  @ApiOperation({ summary: 'Update load status via Kanban drag and drop' })
  moveBoardCard(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { loadId: string; status: string; boardPosition: number },
  ) {
    return this.dispatchService.moveBoardCard(
      user.companyId,
      body.loadId,
      body.status,
      body.boardPosition,
    );
  }
}
