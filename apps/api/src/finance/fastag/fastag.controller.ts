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
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { FastagService } from './fastag.service';

@ApiTags('finance/fastag')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/fastag')
export class FastagController {
  constructor(private readonly fastagService: FastagService) {}

  @Get()
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get recent FASTag toll transactions' })
  getTransactions(@GetUser() user: AuthenticatedUser) {
    return this.fastagService.getTransactions(user.companyId);
  }

  @Post('sync')
  @RequirePermissions('finance:write')
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
