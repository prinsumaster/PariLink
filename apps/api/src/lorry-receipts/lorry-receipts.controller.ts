import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Header,
} from '@nestjs/common';
import { LorryReceiptsService } from './lorry-receipts.service';
import { CreateLorryReceiptDto } from './dto/create-lorry-receipt.dto';
import { LorryReceiptQueryDto } from './dto/lorry-receipt-query.dto';
import { UpdateLorryReceiptStatusDto } from './dto/update-lorry-receipt-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('lorry-receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('lorry-receipts')
export class LorryReceiptsController {
  constructor(private readonly lorryReceiptsService: LorryReceiptsService) {}

  @Post()
  @RequirePermissions('documents:create')
  @ApiOperation({ summary: 'Generate a Lorry Receipt (LR / Bilty) from a booking' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateLorryReceiptDto,
  ) {
    return this.lorryReceiptsService.create(user.companyId, dto);
  }

  @Get()
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'List Lorry Receipts for current company' })
  findAll(
    @GetUser() user: AuthenticatedUser,
    @Query() query: LorryReceiptQueryDto,
  ) {
    return this.lorryReceiptsService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get a Lorry Receipt by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.lorryReceiptsService.findOne(user.companyId, id);
  }

  @Get(':id/print')
  @RequirePermissions('documents:read')
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'Printable LR (HTML → browser Print gives a PDF)' })
  print(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.lorryReceiptsService.renderPrintable(user.companyId, id);
  }

  @Patch(':id/status')
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Update LR status (ISSUED→IN_TRANSIT→DELIVERED)' })
  updateStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLorryReceiptStatusDto,
  ) {
    return this.lorryReceiptsService.updateStatus(user.companyId, id, dto);
  }
}
