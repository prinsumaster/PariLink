import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { AccountsPayableService } from './accounts-payable.service';

@ApiTags('finance/payables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/payables')
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all AP Payments' })
  getPayments(@GetUser() user: AuthenticatedUser) {
    return this.accountsPayableService.getPayments(user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Process a new payment settlement' })
  processPayment(
    @GetUser() user: AuthenticatedUser,
    @Body('invoiceId') invoiceId: string,
    @Body('amount') amount: string,
    @Body('method') method: string,
  ) {
    return this.accountsPayableService.processPayment(
      user.companyId,
      invoiceId,
      amount,
      method,
    );
  }
}
