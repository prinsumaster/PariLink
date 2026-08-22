/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CrmLeadService } from '../../services/crm-lead/crm-lead.service';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateLeadDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() status!: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsObject() data?: Record<string, unknown>;
}

export class UpdateLeadDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsObject() data?: Record<string, unknown>;
}

@Controller('crm/leads')
@UseGuards(JwtAuthGuard)
export class CrmLeadController {
  constructor(private readonly service: CrmLeadService) {}

  @Post()
  create(@Req() req: any, @Body() data: CreateLeadDto) {
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
    @Body() data: UpdateLeadDto,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
