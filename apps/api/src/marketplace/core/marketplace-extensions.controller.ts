import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { MarketplaceCoreService } from './marketplace-core.service';

@Controller('admin/marketplace/extensions')
export class MarketplaceExtensionsController {
  constructor(
    private readonly marketplaceCoreService: MarketplaceCoreService,
  ) {}

  @Get(':slotId')
  async getExtensionsForSlot(
    @Request() req: any,
    @Param('slotId') slotId: string,
  ) {
    // Note: User Auth Guard is assumed at the global or controller level based on architecture.
    // For V31.0 demo purposes, we fallback to a hardcoded companyId if req.user is undefined
    const companyId = req.user?.companyId || 'company-1';
    return this.marketplaceCoreService.getExtensionsBySlot(companyId, slotId);
  }
}
