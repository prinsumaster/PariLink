import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('maintenance/work-orders')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @RequirePermissions('maintenance:write')
  @ApiOperation({ summary: 'Create a new maintenance work order' })
  async createWorkOrder(
    @GetUser() user: AuthenticatedUser,
    @Body()
    body: {
      vehicleId: string;
      type: string;
      scheduledDate: string;
      items: { description: string; cost: number }[];
    },
  ) {
    return this.maintenanceService.createWorkOrder(
      user.companyId,
      body.vehicleId,
      {
        type: body.type,
        scheduledDate: new Date(body.scheduledDate),
        items: body.items,
      },
    );
  }

  @Get()
  @RequirePermissions('maintenance:read')
  @ApiOperation({ summary: 'List maintenance work orders' })
  @ApiQuery({ name: 'vehicleId', required: false })
  async getWorkOrders(
    @GetUser() user: AuthenticatedUser,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.maintenanceService.getWorkOrders(user.companyId, vehicleId);
  }

  @Patch(':id/complete')
  @RequirePermissions('maintenance:write')
  @ApiOperation({ summary: 'Mark work order as complete' })
  async completeWorkOrder(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.maintenanceService.completeWorkOrder(user.companyId, id);
  }
}
