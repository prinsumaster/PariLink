import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { VendorMarketplaceService } from './vendor-marketplace.service';

@ApiTags('vendor-portal/marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendor-portal/marketplace')
export class VendorMarketplaceController {
  constructor(
    private readonly vendorMarketplaceService: VendorMarketplaceService,
  ) {}

  @Get('tenders')
  @ApiOperation({ summary: 'Get open load tenders for bidding' })
  getOpenTenders(@GetUser() user: AuthenticatedUser) {
    if (!user.vendorId)
      throw new UnauthorizedException(
        'User is not associated with a Vendor account',
      );
    return this.vendorMarketplaceService.getOpenTenders(
      user.companyId,
      user.vendorId,
    );
  }

  @Post('tenders/:id/bid')
  @ApiOperation({ summary: 'Submit a bid on a tender' })
  submitBid(
    @GetUser() user: AuthenticatedUser,
    @Param('id') tenderId: string,
    @Body('amount') amount: number,
  ) {
    if (!user.vendorId)
      throw new UnauthorizedException(
        'User is not associated with a Vendor account',
      );
    return this.vendorMarketplaceService.submitBid(
      user.companyId,
      user.vendorId,
      tenderId,
      amount,
    );
  }
}
