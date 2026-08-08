import { Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { VendorsService } from './vendors.service';

@Module({
  controllers: [VendorsController, PurchaseOrderController],
  providers: [VendorsService, PurchaseOrderService],
  exports: [VendorsService, PurchaseOrderService],
})
export class VendorsModule {}
