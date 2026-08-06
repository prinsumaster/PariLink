import { Module } from '@nestjs/common';
import { PortalsController } from './portals.controller';
import { ClaimsService } from './claims/claims.service';
import { ClaimsController } from './claims/claims.controller';
import { PortalsService } from './portals.service';
import { CustomerPortalModule } from './customer/customer-portal.module';
import { VendorPortalModule } from './vendor/vendor-portal.module';
import { DriverPortalModule } from './driver/driver-portal.module';

@Module({
  imports: [CustomerPortalModule, VendorPortalModule, DriverPortalModule],
  controllers: [PortalsController, ClaimsController],
  providers: [PortalsService, ClaimsService],
})
export class PortalsModule {}
