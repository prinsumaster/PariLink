import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { VendorSettlementsService } from './vendor-settlements.service';

@ApiTags('vendor-portal/settlements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendor-portal/settlements')
export class VendorSettlementsController {
  constructor(
    private readonly vendorSettlementsService: VendorSettlementsService,
  ) {}

  @Get('bills')
  @ApiOperation({
    summary: 'Get all vendor bills (invoices submitted by vendor)',
  })
  getBills(@GetUser() user: AuthenticatedUser) {
    if (!user.vendorId)
      throw new UnauthorizedException(
        'User is not associated with a Vendor account',
      );
    return this.vendorSettlementsService.getBills(
      user.companyId,
      user.vendorId,
    );
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Get KPI summary for vendor settlements' })
  getDashboardKpis(@GetUser() user: AuthenticatedUser) {
    if (!user.vendorId)
      throw new UnauthorizedException(
        'User is not associated with a Vendor account',
      );
    return this.vendorSettlementsService.getDashboardKpis(
      user.companyId,
      user.vendorId,
    );
  }
}
