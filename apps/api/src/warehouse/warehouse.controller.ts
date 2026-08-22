import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray, IsDateString } from 'class-validator';

import { WarehouseMasterService } from './engine/warehouse-master.service';
import { InventoryService } from './engine/inventory.service';
import { InboundService } from './engine/inbound.service';
import { OutboundService } from './engine/outbound.service';
import { DockSchedulerService } from './engine/dock-scheduler.service';
import { InventoryOptimizerService } from './engine/inventory-optimizer.service';

export class CreateWarehouseDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsOptional() @IsString() location?: string;
}

export class CreateAsnDto {
  @IsString() @IsNotEmpty() warehouseId!: string;
  @IsString() @IsNotEmpty() reference!: string;
  @IsArray() @IsNotEmpty() items!: unknown[];
}

export class ReceiveGoodsDto {
  @IsString() @IsNotEmpty() stagingBinId!: string;
  @IsArray() @IsNotEmpty() items!: unknown[];
}

export class CreateOutboundDto {
  @IsString() @IsNotEmpty() loadId!: string;
  @IsString() @IsNotEmpty() orderNumber!: string;
  @IsArray() @IsNotEmpty() items!: unknown[];
}

export class PickOrderDto {
  @IsArray() @IsNotEmpty() picks!: unknown[];
}

export class ScheduleDockDto {
  @IsString() @IsNotEmpty() dockId!: string;
  @IsString() @IsNotEmpty() type!: string;
  @IsDateString() @IsNotEmpty() start!: string;
  @IsDateString() @IsNotEmpty() end!: string;
}

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
    return this.masterData.getWarehouses(user.companyId);
  }

  @Post()
  @RequirePermissions('warehouse:write')
  createWarehouse(
    @GetUser() user: AuthenticatedUser,
    @Body() data: CreateWarehouseDto,
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
    @Body() data: CreateAsnDto,
  ) {
    return this.inbound.createASN(
      user.companyId,
      data.warehouseId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data as any,
    );
  }

  @Post('inbound/:id/receive')
  @RequirePermissions('warehouse:write')
  receiveGoods(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: ReceiveGoodsDto,
  ) {
    return this.inbound.receiveGoods(
      user.companyId,
      id,
      data.stagingBinId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items as any,
      user.userId,
    );
  }

  @Post('outbound/order')
  @RequirePermissions('warehouse:write')
  createOutbound(
    @GetUser() user: AuthenticatedUser,
    @Body() data: CreateOutboundDto,
  ) {
    return this.outbound.createOutboundOrder(
      user.companyId,
      data.loadId,
      data.orderNumber,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items as any,
    );
  }

  @Post('outbound/:id/pick')
  @RequirePermissions('warehouse:write')
  pickOrder(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: PickOrderDto,
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
    @Body() data: ScheduleDockDto,
  ) {
    return this.dockScheduler.scheduleAppointment(
      user.companyId,
      data.dockId,
      user.userId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.type as any) || 'INBOUND',
      new Date(data.start),
      new Date(data.end),
      user.userId,
    );
  }

  @Get(':id/inventory/abc')
  @RequirePermissions('warehouse:read')
  runAbcAnalysis(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.optimizer.runAbcAnalysis(user.companyId, id);
  }
}
