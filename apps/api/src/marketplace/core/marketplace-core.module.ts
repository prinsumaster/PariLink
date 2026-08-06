import { Module } from '@nestjs/common';
import { MarketplaceCoreService } from './marketplace-core.service';
import { MarketplaceCoreController } from './marketplace-core.controller';
import { MarketplaceExtensionsController } from './marketplace-extensions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarketplaceCoreController, MarketplaceExtensionsController],
  providers: [MarketplaceCoreService],
  exports: [MarketplaceCoreService],
})
export class MarketplaceCoreModule {}
