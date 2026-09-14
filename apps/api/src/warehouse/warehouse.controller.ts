import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  IsNumber,
  IsPositive,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

// Cross-checked against the Prisma models, not guessed.
//
//   OutboundOrderItem NOT NULL, no default: companyId, orderId, sku, requestedQty
//     -> companyId comes from the JWT, orderId from the parent create.
//        sku and requestedQty must come from the caller, so both are required.
//   OutboundOrder     NOT NULL, no default: companyId, orderNumber
//     -> loadId is `String?` in the schema, so it is OPTIONAL here. It was
//        previously @IsNotEmpty(), which made wave-based orders (no load)
//        impossible to create through the API.
//
// `items!: unknown[]` with a bare @IsArray() was the real gap: it accepts
// [null, 42, "junk"]. Those reach Prisma as sku: undefined and fail against a
// NOT NULL column, turning a 400 into a 500. @ValidateNested + @Type validate
// each element.
export class OutboundOrderItemDto {
  @IsString() @IsNotEmpty() sku!: string;
  @IsNumber() @IsPositive() requestedQty!: number;
}

export class CreateOutboundDto {
  @IsOptional() @IsString() @IsNotEmpty() loadId?: string;
  @IsString() @IsNotEmpty() orderNumber!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OutboundOrderItemDto)
  items!: OutboundOrderItemDto[];
}

export class PickDto {
  @IsString() @IsNotEmpty() orderItemId!: string;
  @IsString() @IsNotEmpty() inventoryItemId!: string;
  @IsNumber() @IsPositive() qty!: number;
}

export class PickOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PickDto)
  picks!: PickDto[];
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
  // @ts-ignore: DI dependency reserved for future use
    private readonly _inventory: InventoryService,
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
      data.items,
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
      data.picks,
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
