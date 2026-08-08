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
import { PurchaseOrderService } from './purchase-order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vendors/purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly poService: PurchaseOrderService) {}

  @Post()
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Create Purchase Order' })
  async createPurchaseOrder(
    @GetUser() user: AuthenticatedUser,
    @Body() data: any,
  ) {
    return this.poService.createPurchaseOrder(user.companyId, data);
  }

  @Get()
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get Purchase Orders' })
  async getPurchaseOrders(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.poService.getPurchaseOrders(user.companyId, status);
  }

  @Put(':id/receive')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Receive Items for Purchase Order' })
  async receivePurchaseOrderItems(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: { items: any[] },
  ) {
    return this.poService.receivePurchaseOrderItems(
      user.companyId,
      id,
      data.items,
    );
  }
}
