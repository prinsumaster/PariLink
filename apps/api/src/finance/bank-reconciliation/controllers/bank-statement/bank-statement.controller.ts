import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../../../auth/decorators/permissions.decorator';

import { BankSyncService } from '../../services/bank-sync/bank-sync.service';
import { CreateBankStatementDto, UpdateBankStatementDto } from '../../dto/bank-statement.dto';

@Controller('finance/bank-statements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BankStatementController {
  constructor(private readonly service: BankSyncService) {}

  @RequirePermissions('finance:write')
  @Post()
  create(@Req() req: any, @Body() data: CreateBankStatementDto) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @RequirePermissions('finance:read')
  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.companyId, query);
  }

  @RequirePermissions('finance:read')
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.companyId, id);
  }

  @RequirePermissions('finance:write')
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: UpdateBankStatementDto,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @RequirePermissions('finance:delete')
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
