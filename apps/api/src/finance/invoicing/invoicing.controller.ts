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
import { InvoicingService } from './invoicing.service';

@ApiTags('finance/invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('finance/invoices')
export class InvoicingController {
  constructor(private readonly invoicingService: InvoicingService) {}

  @RequirePermissions('invoices:read')
  @Get()
  @ApiOperation({ summary: 'Get all AR Invoices' })
  getInvoices(@GetUser() user: AuthenticatedUser) {
    return this.invoicingService.getInvoices(user.companyId);
  }

  @RequirePermissions('invoices:write')
  @Post()
  @ApiOperation({ summary: 'Generate a new invoice' })
  generateInvoice(
    @GetUser() user: AuthenticatedUser,
    @Body('customerId') customerId: string,
    @Body('amount') amount: string,
    @Body('invoiceNumber') invoiceNumber: string,
  ) {
    return this.invoicingService.generateInvoice(
      user.companyId,
      customerId,
      amount,
      invoiceNumber,
    );
  }
}
