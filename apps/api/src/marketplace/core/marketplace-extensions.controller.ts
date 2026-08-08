import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { MarketplaceCoreService } from './marketplace-core.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('admin/marketplace/extensions')
@UseGuards(JwtAuthGuard)
export class MarketplaceExtensionsController {
  constructor(
    private readonly marketplaceCoreService: MarketplaceCoreService,
  ) {}

  @Get(':slotId')
  async getExtensionsForSlot(
    @Request() req: any,
    @Param('slotId') slotId: string,
  ) {
    if (!req.user || !req.user.companyId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    const companyId = req.user.companyId;
    return this.marketplaceCoreService.getExtensionsBySlot(companyId, slotId);
  }
}
