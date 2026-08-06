import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';

import { PricingService } from './engine/pricing.service';
import { ContractService } from './engine/contract.service';
import { TenderService } from './engine/tender.service';
import { ProfitabilityService } from './engine/profitability.service';
import { SlaTrackerService } from './engine/sla-tracker.service';

@ApiTags('commercial')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('commercial')
export class CommercialController {
  constructor(
    private readonly pricing: PricingService,
    private readonly contract: ContractService,
    private readonly tender: TenderService,
    private readonly profitability: ProfitabilityService,
    private readonly slaTracker: SlaTrackerService,
  ) {}

  // ── Pricing & Quotations ──────────────────────────────────────────────

  @Post('rate-cards')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Create or update a customer Rate Card' })
  async createRateCard(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.pricing.createRateCard(user.companyId, dto);
  }

  @Post('quotes/:customerId')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Draft a new quotation' })
  async createQuote(
    @GetUser() user: AuthenticatedUser,
    @Param('customerId') customerId: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.pricing.createQuotation(user.companyId, customerId, dto);
  }

  @Post('quotes/:id/submit')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Submit a drafted quotation' })
  async submitQuote(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.pricing.submitQuotation(user.companyId, id);
  }

  @Post('quotes/:id/convert')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Convert an approved quote into a Rate Card' })
  async convertQuote(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.pricing.convertQuotationToRateCard(user.companyId, id);
  }

  // ── Contracts ─────────────────────────────────────────────────────────

  @Post('contracts')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Draft a new MSA or Carrier Agreement' })
  async createContract(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.contract.createContract(user.companyId, dto);
  }

  @Post('contracts/:id/activate')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Activate a drafted contract' })
  async activateContract(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.contract.activateContract(user.companyId, id);
  }

  // ── Tenders ───────────────────────────────────────────────────────────

  @Post('tenders')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Create a new carrier tender' })
  async createTender(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.tender.createTender(user.companyId, dto);
  }

  @Post('tenders/:tenderId/bids')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Submit a vendor bid to an open tender' })
  async submitBid(
    @GetUser() user: AuthenticatedUser,
    @Param('tenderId') tenderId: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.tender.submitBid(
      user.companyId,
      tenderId,
      (dto as any).vendorId,
      dto,
    );
  }

  @Post('tenders/:tenderId/award/:bidId')
  @RequirePermissions('commercial:write')
  @ApiOperation({ summary: 'Award a tender to a specific bid' })
  async awardTender(
    @GetUser() user: AuthenticatedUser,
    @Param('tenderId') tenderId: string,
    @Param('bidId') bidId: string,
  ) {
    return this.tender.awardTender(user.companyId, tenderId, bidId);
  }

  // ── Analytics & Profitability ─────────────────────────────────────────

  @Get('analytics/trip/:tripId/profitability')
  @RequirePermissions('commercial:read')
  @ApiOperation({ summary: 'Calculate profitability for a specific trip' })
  async getTripProfitability(
    @GetUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
  ) {
    return this.profitability.calculateTripProfitability(
      user.companyId,
      tripId,
    );
  }

  @Get('analytics/customer/:customerId/profitability')
  @RequirePermissions('commercial:read')
  @ApiOperation({ summary: 'Calculate aggregate customer profitability' })
  async getCustomerProfitability(
    @GetUser() user: AuthenticatedUser,
    @Param('customerId') customerId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = from ? new Date(from) : new Date(0);
    const toDate = to ? new Date(to) : new Date();
    return this.profitability.calculateCustomerProfitability(
      user.companyId,
      customerId,
      fromDate,
      toDate,
    );
  }

  @Get('analytics/customer/:customerId/sla')
  @RequirePermissions('commercial:read')
  @ApiOperation({ summary: 'Evaluate customer SLA performance' })
  async getCustomerSLA(
    @GetUser() user: AuthenticatedUser,
    @Param('customerId') customerId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = from ? new Date(from) : new Date(0);
    const toDate = to ? new Date(to) : new Date();
    return this.slaTracker.evaluateCustomerSLA(
      user.companyId,
      customerId,
      fromDate,
      toDate,
    );
  }
}
