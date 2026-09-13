import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('toll-estimate')
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'Get toll cost estimate for a route' })
  getTollEstimate(
    @GetUser() user: AuthenticatedUser,
    @Query('originCity') originCity: string,
    @Query('destinationCity') destinationCity: string,
  ) {
    return this.routesService.getTollEstimate(user.companyId, originCity, destinationCity);
  }
}
