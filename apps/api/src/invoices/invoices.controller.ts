import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @RequirePermissions('invoices:read')
  @ApiOperation({ summary: 'Get all invoices' })
  getInvoices(
    @GetUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.invoicesService.getInvoices(
      user.companyId,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      sort,
      order,
    );
  }

  @Get(':id')
  @RequirePermissions('invoices:read')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  getInvoiceById(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.invoicesService.getInvoiceById(user.companyId, id);
  }

  @Post()
  @RequirePermissions('invoices:write')
  @ApiOperation({ summary: 'Create a new invoice' })
  createInvoice(
    @GetUser() user: AuthenticatedUser,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.invoicesService.createInvoice(user.companyId, payload, user.id);
  }

  @Patch(':id/status')
  @RequirePermissions('invoices:write')
  @ApiOperation({ summary: 'Update invoice status' })
  updateStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.invoicesService.updateInvoiceStatus(
      user.companyId,
      id,
      body.status,
      user.id,
    );
  }
}
