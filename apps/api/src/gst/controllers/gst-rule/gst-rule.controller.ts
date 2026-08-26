import { CreateGstRuleDto, UpdateGstRuleDto } from '../dto/gst-rule.dto';
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
import { GstEngineService } from '../../services/gst-engine/gst-engine.service';

@Controller('gst/rules')
@UseGuards(JwtAuthGuard)
export class GstRuleController {
  constructor(private readonly service: GstEngineService) {}

  @Post()
  @RequirePermissions('finance:write')
  create(@Req() req: any, @Body() data: CreateGstRuleDto) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  @RequirePermissions('finance:read')
  findAll(@Req() req: any, @Query() query: any) {
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
    @Body() data: CreateGstRuleDto,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @Delete(':id')
  @RequirePermissions('finance:write')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
