import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DriverWalletService } from './driver-wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('finance/wallet')
export class DriverWalletController {
  constructor(private readonly walletService: DriverWalletService) {}

  @Get('balance')
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get Driver Wallet Balance' })
  async getWalletBalance(
    @GetUser() user: AuthenticatedUser,
    @Query('driverId') driverId: string,
  ) {
    return this.walletService.getWalletBalance(user.companyId, driverId);
  }

  @Post('expenses')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Submit Driver Expense' })
  async submitExpense(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.walletService.submitExpense(
      user.companyId,
      data,
      data.driverId,
    );
  }

  @Get('expenses')
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get Driver Expenses' })
  async getExpenses(
    @GetUser() user: AuthenticatedUser,
    @Query('driverId') driverId?: string,
    @Query('status') status?: string,
  ) {
    return this.walletService.getExpenses(user.companyId, driverId, status);
  }

  @Put('expenses/:id/approve')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Approve Driver Expense' })
  async approveExpense(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.walletService.approveExpense(user.companyId, id);
  }

  @Post('settlements/generate')
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Generate Settlement' })
  async generateSettlement(
    @GetUser() user: AuthenticatedUser,
    @Body() data: { driverId: string; periodStart: string; periodEnd: string },
  ) {
    return this.walletService.generateSettlement(
      user.companyId,
      data.driverId,
      new Date(data.periodStart),
      new Date(data.periodEnd),
    );
  }

  @Get('settlements')
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get Settlements' })
  async getSettlements(
    @GetUser() user: AuthenticatedUser,
    @Query('driverId') driverId?: string,
  ) {
    return this.walletService.getSettlements(user.companyId, driverId);
  }
}
