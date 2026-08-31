import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LoadingEventsService } from './loading-events.service';
import { CreateLoadingEventDto } from './dto/create-loading-event.dto';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('loading-events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('trips')
export class LoadingEventsController {
  constructor(private readonly loadingEventsService: LoadingEventsService) {}

  @Get(':id/loading')
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'Get all loading events for a trip' })
  getEvents(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.loadingEventsService.getEvents(user.companyId, id);
  }

  @Post(':id/loading')
  @RequirePermissions('trips:update')
  @ApiOperation({ summary: 'Add a loading/unloading event to a trip' })
  addEvent(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() createDto: CreateLoadingEventDto,
  ) {
    return this.loadingEventsService.addEvent(user.companyId, id, createDto, user);
  }
}
