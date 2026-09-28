import { CreatePermitDto } from '../dto/permit.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../../../auth/decorators/permissions.decorator';
import { GetUser } from '../../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../../auth/decorators/get-user.decorator';
import { PermitComplianceService } from '../../services/permit-compliance/permit-compliance.service';

@Controller('vehicles/permits')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermitController {
  constructor(private readonly service: PermitComplianceService) {}

  @Post()
  @RequirePermissions('vehicles:update')
  create(@GetUser() user: AuthenticatedUser, @Body() data: CreatePermitDto) {
    return this.service.create(user.companyId, user.id, data.payload);
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
  @RequirePermissions('vehicles:update')
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: CreatePermitDto,
  ) {
    return this.service.update(user.companyId, id, user.id, data.payload);
  }

  @Delete(':id')
  @RequirePermissions('vehicles:update')
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.service.remove(user.companyId, id, user.id);
  }
}
