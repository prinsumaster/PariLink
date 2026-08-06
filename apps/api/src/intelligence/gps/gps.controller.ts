import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GpsService } from './gps.service';
import { GpsPingDto } from './gps.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('intelligence/gps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('intelligence/gps')
export class GpsController {
  constructor(private readonly gpsService: GpsService) {}

  @Post('ingest')
  @RequirePermissions('gps:write')
  @ApiOperation({
    summary: 'Ingest a normalized GPS ping from telematics hardware',
  })
  ingestPing(@GetUser() user: AuthenticatedUser, @Body() payload: GpsPingDto) {
    return this.gpsService.ingestPing(user.companyId, payload);
  }
}
