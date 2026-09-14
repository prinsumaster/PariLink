import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { TripDesksService } from './trip-desks.service';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trip-desks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class TripDesksController {
  constructor(private readonly tripDesksService: TripDesksService) {}

  @Get('desks/my')
  @ApiOperation({ summary: 'Get pending desks for the current user' })
  getMyPendingDesks(@GetUser() user: AuthenticatedUser) {
    return this.tripDesksService.getMyPendingDesks(user);
  }

  @Get('trips/:id/desks')
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'Get all desks for a trip' })
  getTripDesks(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tripDesksService.getDesks(user.companyId, id);
  }

  @Post('trips/:id/desks/:desk/complete')
  @RequirePermissions('trips:update')
  @ApiOperation({ summary: 'Mark a desk as complete for a trip' })
  completeDesk(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('desk') desk: string,
    @Body('notes') notes?: string,
  ) {
    return this.tripDesksService.completeDesk(user.companyId, id, desk, user, notes);
  }
}
