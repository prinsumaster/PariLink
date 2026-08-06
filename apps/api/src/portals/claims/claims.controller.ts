import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('portals-customer-claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('portals/customer/claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @RequirePermissions('portals:write')
  @ApiOperation({ summary: 'Submit a new customer claim' })
  async createClaim(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { loadId?: string; amount: number; reason: string },
  ) {
    // Assuming the user token maps directly to a customer portal user
    // or we pass the customerId if acting as an internal user.
    // For V9 OS Customer Portal, we assume the user.sub or user.customerId is available.
    // We will use user.userId as customerId for demo purposes of the OS.
    return this.claimsService.createClaim(user.companyId, user.userId, body);
  }

  @Get()
  @RequirePermissions('portals:read')
  @ApiOperation({ summary: 'List all claims for the customer' })
  async getClaims(@GetUser() user: AuthenticatedUser) {
    return this.claimsService.getClaimsByCustomer(user.companyId, user.userId);
  }

  @Get(':id')
  @RequirePermissions('portals:read')
  @ApiOperation({ summary: 'Get details of a specific claim' })
  async getClaimDetails(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.claimsService.getClaimDetails(user.companyId, id);
  }

  @Patch(':id/status')
  @RequirePermissions('claims:write') // Internal permission to resolve claims
  @ApiOperation({ summary: 'Update claim status (Internal)' })
  async updateClaimStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.claimsService.updateClaimStatus(
      user.companyId,
      id,
      body.status,
    );
  }
}
