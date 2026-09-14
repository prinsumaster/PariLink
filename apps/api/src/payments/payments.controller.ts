import { CreatePaymentsDto } from '../dto/payments.dto';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get all payments' })
  getAllPayments(
    @GetUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getPayments(
      user.companyId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('invoices/:invoiceId')
  @RequirePermissions('finance:read')
  @ApiOperation({ summary: 'Get payments for an invoice' })
  getInvoicePayments(
    @GetUser() user: AuthenticatedUser,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.paymentsService.getPaymentsByInvoice(user.companyId, invoiceId);
  }

  @Post()
  @RequirePermissions('finance:write')
  @ApiOperation({ summary: 'Record a new payment' })
  recordPayment(
    @GetUser() user: AuthenticatedUser,
    @Body() payload: CreatePaymentsDto,
  ) {
    return this.paymentsService.recordPayment(user.companyId, payload);
  }
}
