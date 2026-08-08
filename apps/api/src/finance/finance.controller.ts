import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import {
  CreateExpenseDto,
  CreateSettlementDto,
  CreateVendorBillDto,
  CreatePaymentDto,
} from './dto/finance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('invoices')
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get invoices' })
  getInvoices(@GetUser() user: AuthenticatedUser, @Request() req: any) {
    return this.financeService.getInvoices(user.companyId, req.query);
  }

  @Get('expenses')
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get expenses' })
  getExpenses(@GetUser() user: AuthenticatedUser, @Request() req: any) {
    return this.financeService.getExpenses(user.companyId, req.query);
  }

  @Post('expenses')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Log an expense' })
  createExpense(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.financeService.createExpense(user.companyId, dto, user.id);
  }

  @Post('settlements')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Create driver settlement' })
  createSettlement(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateSettlementDto,
  ) {
    return this.financeService.createSettlement(user.companyId, dto, user.id);
  }

  @Post('vendor-bills')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Create vendor bill' })
  createVendorBill(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateVendorBillDto,
  ) {
    return this.financeService.createVendorBill(user.companyId, dto, user.id);
  }

  @Post('payments')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Record customer payment and post to ledger' })
  recordPayment(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.financeService.recordPayment(user.companyId, dto, user.id);
  }
}
