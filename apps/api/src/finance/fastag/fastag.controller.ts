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
import { FastagService } from './fastag.service';

@ApiTags('finance/fastag')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('finance/fastag')
export class FastagController {
  constructor(private readonly fastagService: FastagService) {}

  @RequirePermissions('fastag:read')
  @Get()
  @ApiOperation({ summary: 'Get recent FASTag toll transactions' })
  getTransactions(@GetUser() user: AuthenticatedUser) {
    return this.fastagService.getTransactions(user.companyId);
  }

  @RequirePermissions('fastag:write')
  @Post('sync')
  @ApiOperation({ summary: 'Sync transactions from FASTag provider' })
  syncTollTransactions(
    @GetUser() user: AuthenticatedUser,
    @Body('accountId') accountId: string,
    @Body() payload: any,
  ) {
    return this.fastagService.syncTollTransactions(
      user.companyId,
      accountId,
      payload,
    );
  }
}
