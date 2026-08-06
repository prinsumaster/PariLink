import { Module } from '@nestjs/common';
import { VendorMarketplaceController } from './marketplace/vendor-marketplace.controller';
import { VendorMarketplaceService } from './marketplace/vendor-marketplace.service';
import { VendorOperationsController } from './operations/vendor-operations.controller';
import { VendorOperationsService } from './operations/vendor-operations.service';
import { VendorSettlementsController } from './settlements/vendor-settlements.controller';
import { VendorSettlementsService } from './settlements/vendor-settlements.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    VendorMarketplaceController,
    VendorOperationsController,
    VendorSettlementsController,
  ],
  providers: [
    VendorMarketplaceService,
    VendorOperationsService,
    VendorSettlementsService,
  ],
  exports: [
    VendorMarketplaceService,
    VendorOperationsService,
    VendorSettlementsService,
  ],
})
export class VendorPortalModule {}
