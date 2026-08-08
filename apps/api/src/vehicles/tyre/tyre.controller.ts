import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TyreService } from './tyre.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tyres')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vehicles/tyres')
export class TyreController {
  constructor(private readonly tyreService: TyreService) {}

  @Post()
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create a new tyre' })
  async createTyre(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.tyreService.createTyre(user.companyId, data, user.id);
  }

  @Get()
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'List tyres' })
  async getTyres(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.tyreService.getTyres(user.companyId, status);
  }

  @Put(':id/install')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Install tyre on a vehicle' })
  async installTyre(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.tyreService.installTyre(user.companyId, id, data, user.id);
  }

  @Put(':id/rotate')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Rotate tyre to a new position' })
  async rotateTyre(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.tyreService.rotateTyre(user.companyId, id, data, user.id);
  }

  @Put(':id/scrap')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Scrap a tyre' })
  async scrapTyre(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.tyreService.scrapTyre(user.companyId, id, data, user.id);
  }
}
