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
  Request,
  Query,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateRateCardDto } from './dto/create-rate-card.dto';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
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
    return this.billingService.createRateCard(user.companyId, dto);
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
    return this.billingService.generateInvoice(user.companyId, dto);
  }

  @Patch('invoices/:id/approve')
  @RequirePermissions('billing:write')
  @ApiOperation({ summary: 'Approve an invoice and post to ledger' })
  approveInvoice(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.billingService.approveInvoice(user.companyId, id);
  }
}
