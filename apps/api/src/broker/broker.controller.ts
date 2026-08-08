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
import { BrokerService } from './broker.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('broker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('broker')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Post('carriers')
  @RequirePermissions('broker:write')
  @ApiOperation({ summary: 'Register external carrier' })
  async createCarrier(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.brokerService.createCarrier(user.companyId, data, user.id);
  }

  @Get('carriers')
  @RequirePermissions('broker:read')
  @ApiOperation({ summary: 'List external carriers' })
  async getCarriers(@GetUser() user: AuthenticatedUser) {
    return this.brokerService.getCarriers(user.companyId);
  }

  @Post('load-board/:tripId')
  @RequirePermissions('broker:write')
  @ApiOperation({ summary: 'Post a trip to the load board' })
  async postToLoadBoard(
    @GetUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() data: any,
  ) {
    return this.brokerService.postToLoadBoard(
      user.companyId,
      tripId,
      data,
      user.id,
    );
  }

  @Get('load-board')
  @RequirePermissions('broker:read')
  @ApiOperation({ summary: 'Get load board items' })
  async getLoadBoard(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.brokerService.getLoadBoard(
      user.companyId,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Post('load-board/:loadId/bids')
  @RequirePermissions('broker:write')
  @ApiOperation({ summary: 'Submit a carrier bid for a load' })
  async submitBid(
    @GetUser() user: AuthenticatedUser,
    @Param('loadId') loadId: string,
    @Body() data: { carrierId: string; bidAmount: number; notes?: string },
  ) {
    return this.brokerService.submitBid(
      user.companyId,
      loadId,
      data.carrierId,
      data,
      user.id,
    );
  }

  @Put('bids/:bidId/accept')
  @RequirePermissions('broker:write')
  @ApiOperation({ summary: 'Accept a carrier bid' })
  async acceptBid(
    @GetUser() user: AuthenticatedUser,
    @Param('bidId') bidId: string,
  ) {
    return this.brokerService.acceptBid(user.companyId, bidId, user.id);
  }
}
