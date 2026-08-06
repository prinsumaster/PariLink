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
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { InvoicingService } from './invoicing.service';

@ApiTags('finance/invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/invoices')
export class InvoicingController {
  constructor(private readonly invoicingService: InvoicingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AR Invoices' })
  getInvoices(@GetUser() user: AuthenticatedUser) {
    return this.invoicingService.getInvoices(user.companyId);
  }

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
