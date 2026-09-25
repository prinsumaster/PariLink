import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateRateCardDto } from './dto/create-rate-card.dto';
import {
  GenerateInvoiceDto,
  GenerateInvoiceFromTripsDto,
} from './dto/generate-invoice.dto';
import { AddWorkshopCostsDto } from './dto/add-workshop-costs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('rate-cards')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Create a rate card for a customer' })
  createRateCard(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateRateCardDto,
  ) {
    return this.billingService.createRateCard(user.companyId, dto, user.id);
  }

  @Get('rate-cards')
  @RequirePermissions('billing:read')
  @ApiOperation({ summary: 'Get active rate cards' })
  getRateCards(
    @GetUser() user: AuthenticatedUser,
    @Query('customerId') customerId?: string,
  ) {
    return this.billingService.getRateCards(user.companyId, customerId);
  }

  @Post('invoices')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Generate a draft invoice from a delivered load' })
  generateInvoice(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: GenerateInvoiceDto,
  ) {
    return this.billingService.generateInvoice(user.companyId, dto, user.id);
  }

  @Post('invoices/generate-from-trips')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Generate a draft invoice from completed trips' })
  generateInvoiceFromTrips(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: GenerateInvoiceFromTripsDto,
  ) {
    return this.billingService.generateInvoiceFromTrips(
      user.companyId,
      dto,
      user.id,
    );
  }

  @Get('invoices/overdue')
  @RequirePermissions('billing:read')
  @ApiOperation({ summary: 'Get all overdue invoices' })
  getOverdueInvoices(@GetUser() user: AuthenticatedUser) {
    return this.billingService.getOverdueInvoices(user.companyId);
  }

  @Get('invoices')
  @RequirePermissions('billing:read')
  @ApiOperation({ summary: 'Get all invoices' })
  getInvoices(@GetUser() user: AuthenticatedUser, @Query() query: any) {
    return this.billingService.getInvoices(user.companyId, query);
  }

  @Get('invoices/:id')
  @RequirePermissions('billing:read')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  getInvoiceById(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.billingService.getInvoiceById(user.companyId, id);
  }

  @Patch('invoices/:id/status')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Update invoice status (SENT, PAID, CANCELLED)' })
  updateInvoiceStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { status: string; paymentRef?: string },
  ) {
    return this.billingService.updateInvoiceStatus(
      user.companyId,
      id,
      body.status,
      user.id,
      body.paymentRef,
    );
  }

  @Patch('invoices/:id/approve')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Approve an invoice and post to ledger' })
  approveInvoice(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.billingService.approveInvoice(user.companyId, id, user.id);
  }

  @Post('invoices/:id/add-workshop-costs')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Add workshop job card costs to an invoice' })
  addWorkshopCosts(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AddWorkshopCostsDto,
  ) {
    return this.billingService.addWorkshopCosts(user.companyId, id, dto);
  }

  @Get('invoices/:id/pdf')
  @RequirePermissions('billing:read')
  @ApiOperation({ summary: 'Generate Invoice PDF' })
  async getInvoicePdf(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Res() res: any, // using any to avoid express type issues if not imported
  ) {
    const stream = await this.billingService.generateInvoicePdf(
      user.companyId,
      id,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
    });
    stream.pipe(res);
  }
}
