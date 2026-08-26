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
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../../auth/decorators/permissions.decorator';
import { FastagWalletService } from '../../services/fastag-wallet/fastag-wallet.service';
import {
  CreateTollAccountDto,
  UpdateTollAccountDto,
  QueryTollAccountDto,
} from '../../dto/tollAccount.dto';

@Controller('fastag/accounts')
@UseGuards(JwtAuthGuard)
export class FastagWalletController {
  constructor(private readonly service: FastagWalletService) {}

  @Post()
  @RequirePermissions('finance:write')
  create(@Req() req: any, @Body() data: CreateTollAccountDto) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  @RequirePermissions('finance:read')
  findAll(@Req() req: any, @Query() query: QueryTollAccountDto) {
    return this.service.findAll(req.user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('finance:read')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('finance:write')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: UpdateTollAccountDto,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @Delete(':id')
  @RequirePermissions('finance:write')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
