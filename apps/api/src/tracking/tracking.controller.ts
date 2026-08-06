import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogLocationDto } from './dto/log-location.dto';

@ApiTags('tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('live')
  @RequirePermissions('tracking:read')
  @ApiOperation({ summary: 'Get live tracking data for all active trips' })
  getLiveTracking(@GetUser() user: AuthenticatedUser) {
    return this.trackingService.getLiveTracking(user.companyId);
  }

  @Post('location')
  @RequirePermissions('tracking:create')
  @ApiOperation({ summary: 'Log GPS locations (supports offline sync arrays)' })
  logLocation(
    @GetUser() user: AuthenticatedUser,
    @Body() logLocationDto: LogLocationDto,
  ) {
    return this.trackingService.logLocation(user.companyId, logLocationDto);
  }
}
