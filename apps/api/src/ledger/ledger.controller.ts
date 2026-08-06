import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('chart-of-accounts')
  @RequirePermissions('ledger:read')
  @ApiOperation({ summary: 'Get Chart of Accounts' })
  getChartOfAccounts(@GetUser() user: AuthenticatedUser) {
    return this.ledgerService.getChartOfAccounts(user.companyId);
  }

  @Get('trial-balance')
  @RequirePermissions('ledger:read')
  @ApiOperation({ summary: 'Get Trial Balance for all accounts' })
  getTrialBalance(@GetUser() user: AuthenticatedUser) {
    return this.ledgerService.getTrialBalance(user.companyId);
  }

  @Get('profit-and-loss')
  @RequirePermissions('ledger:read')
  @ApiOperation({ summary: 'Get Profit and Loss report' })
  getProfitAndLoss(
    @GetUser() user: AuthenticatedUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ledgerService.getProfitAndLoss(
      user.companyId,
      startDate,
      endDate,
    );
  }
}
