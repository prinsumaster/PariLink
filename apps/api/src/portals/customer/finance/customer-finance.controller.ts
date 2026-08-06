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
import { CustomerFinanceService } from './customer-finance.service';

@ApiTags('customer-portal/finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-portal/finance')
export class CustomerFinanceController {
  constructor(
    private readonly customerFinanceService: CustomerFinanceService,
  ) {}

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices for the logged-in customer' })
  getInvoices(@GetUser() user: AuthenticatedUser) {
    if (!user.customerId)
      throw new UnauthorizedException(
        'User is not associated with a Customer account',
      );
    return this.customerFinanceService.getInvoices(
      user.companyId,
      user.customerId,
    );
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get account financial summary for the customer' })
  getAccountSummary(@GetUser() user: AuthenticatedUser) {
    if (!user.customerId)
      throw new UnauthorizedException(
        'User is not associated with a Customer account',
      );
    return this.customerFinanceService.getAccountSummary(
      user.companyId,
      user.customerId,
    );
  }
}
