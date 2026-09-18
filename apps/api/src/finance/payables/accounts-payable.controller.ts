import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { AccountsPayableService } from './accounts-payable.service';

@ApiTags('finance/payables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('finance/payables')
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @RequirePermissions('payables:read')
  @Get()
  @ApiOperation({ summary: 'Get all AP Payments' })
  getPayments(@GetUser() user: AuthenticatedUser) {
    return this.accountsPayableService.getPayments(user.companyId);
  }

  @RequirePermissions('payables:write')
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
