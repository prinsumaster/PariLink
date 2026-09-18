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

import { PayrollEngineService } from '../../services/payroll-engine/payroll-engine.service';
import { CreatePayrollDto, UpdatePayrollDto } from '../../dto/payroll.dto';

@Controller('finance/payroll')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PayrollController {
  constructor(private readonly service: PayrollEngineService) {}

  @RequirePermissions('payroll:write')
  @Post()
  create(@Req() req: any, @Body() data: CreatePayrollDto) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @RequirePermissions('payroll:read')
  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.companyId, query);
  }

  @RequirePermissions('payroll:read')
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.companyId, id);
  }

  @RequirePermissions('payroll:write')
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: UpdatePayrollDto,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @RequirePermissions('payroll:delete')
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
