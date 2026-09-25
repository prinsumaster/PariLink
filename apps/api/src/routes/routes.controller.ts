import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RequireAuth } from '../auth/decorators/require-auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('routes')
@RequireAuth()
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
    return this.routesService.getTollEstimate(
      user.companyId,
      originCity,
      destinationCity,
    );
  }

  @Get()
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'List all routes' })
  getRoutes(@GetUser() user: AuthenticatedUser) {
    return this.routesService.getRoutes(user.companyId);
  }

  @Post()
  @RequirePermissions('trips:write')
  @ApiOperation({ summary: 'Create a new route' })
  createRoute(
    @GetUser() user: AuthenticatedUser,
    @Body()
    body: {
      origin: string;
      destination: string;
      distance?: number;
      estimatedTolls?: number;
    },
  ) {
    return this.routesService.createRoute(
      user.companyId,
      body.origin,
      body.destination,
      body.distance,
      body.estimatedTolls,
    );
  }

  @Post(':id/attach-to-trip')
  @RequirePermissions('trips:write')
  @ApiOperation({ summary: 'Attach a route to a trip' })
  attachToTrip(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { tripId: string },
  ) {
    return this.routesService.attachRouteToTrip(
      user.companyId,
      body.tripId,
      id,
    );
  }
}
