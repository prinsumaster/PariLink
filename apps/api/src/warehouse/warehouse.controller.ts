import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';

import { WarehouseMasterService } from './engine/warehouse-master.service';
import { InventoryService } from './engine/inventory.service';
import { InboundService } from './engine/inbound.service';
import { OutboundService } from './engine/outbound.service';
import { DockSchedulerService } from './engine/dock-scheduler.service';
import { InventoryOptimizerService } from './engine/inventory-optimizer.service';

@Controller('warehouse')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehouseController {
  constructor(
    private readonly masterData: WarehouseMasterService,
    private readonly inventory: InventoryService,
    private readonly inbound: InboundService,
    private readonly outbound: OutboundService,
    private readonly dockScheduler: DockSchedulerService,
    private readonly optimizer: InventoryOptimizerService,
  ) {}

  @Get()
  @RequirePermissions('warehouse:read')
  getWarehouses(@GetUser() user: AuthenticatedUser) {
    // Assuming masterData has a getWarehouses or findAll method, we'll mock it if not
    return this.masterData.getWarehouses(user.companyId);
  }

  @Post()
  @RequirePermissions('warehouse:write')
  createWarehouse(
    @GetUser() user: AuthenticatedUser,
    @Body() data: Record<string, unknown>,
  ) {
    return this.masterData.createWarehouse(user.companyId, data);
  }

  @Get(':id/topology')
  @RequirePermissions('warehouse:read')
  getTopology(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.masterData.getTopology(id, user.companyId);
  }

  @Post('inbound/asn')
  @RequirePermissions('warehouse:write')
  createAsn(
    @GetUser() user: AuthenticatedUser,
    @Body() data: Record<string, unknown>,
  ) {
    return this.inbound.createASN(
      user.companyId,
      data.warehouseId as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data as any,
    );
  }

  @Post('inbound/:id/receive')
  @RequirePermissions('warehouse:write')
  receiveGoods(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.inbound.receiveGoods(
      user.companyId,
      id,
      data.stagingBinId as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items as any,
      user.userId,
    );
  }

  @Post('outbound/order')
  @RequirePermissions('warehouse:write')
  createOutbound(
    @GetUser() user: AuthenticatedUser,
    @Body() data: Record<string, unknown>,
  ) {
    return this.outbound.createOutboundOrder(
      user.companyId,
      data.loadId as string,
      data.orderNumber as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items as any,
    );
  }

  @Post('outbound/:id/pick')
  @RequirePermissions('warehouse:write')
  pickOrder(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.outbound.pickOrder(
      user.companyId,
      id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.picks as any,
      user.userId,
    );
  }

  @Post('docks/schedule')
  @RequirePermissions('warehouse:write')
  scheduleDock(
    @GetUser() user: AuthenticatedUser,
    @Body() data: Record<string, unknown>,
  ) {
    return this.dockScheduler.scheduleAppointment(
      user.companyId,
      data.dockId as string,
      user.userId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.type as any) || 'INBOUND',
      new Date(data.start as string),
      new Date(data.end as string),
      user.userId,
    );
  }

  @Get(':id/inventory/abc')
  @RequirePermissions('warehouse:read')
  runAbcAnalysis(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.optimizer.runAbcAnalysis(user.companyId, id);
  }
}
