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
import { GetUser } from '../../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../../auth/decorators/get-user.decorator';
import { PermitComplianceService } from '../../services/permit-compliance/permit-compliance.service';

@Controller('vehicles/permits')
@UseGuards(JwtAuthGuard)
export class PermitController {
  constructor(private readonly service: PermitComplianceService) {}

  @Post()
  create(@GetUser() user: AuthenticatedUser, @Body() data: Record<string, unknown>) {
    return this.service.create(user.companyId, user.id, data);
  }

  @Get()
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: any) {
    return this.service.findAll(user.companyId, query);
  }

  @Get(':id')
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.service.findOne(user.companyId, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.service.update(user.companyId, id, user.id, data);
  }

  @Delete(':id')
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.service.remove(user.companyId, id, user.id);
  }
}
