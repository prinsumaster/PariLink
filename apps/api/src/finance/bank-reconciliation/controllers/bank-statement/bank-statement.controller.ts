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
import { BankSyncService } from '../../services/bank-sync/bank-sync.service';
import { CreateBankStatementDto, UpdateBankStatementDto } from '../../dto/bank-statement.dto';

@Controller('finance/bank-statements')
@UseGuards(JwtAuthGuard)
export class BankStatementController {
  constructor(private readonly service: BankSyncService) {}

  @Post()
  create(@Req() req: any, @Body() data: CreateBankStatementDto) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.companyId, query);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.companyId, id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: UpdateBankStatementDto,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
