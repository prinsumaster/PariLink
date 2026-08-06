import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { DataMappingService, MappingRule } from './mapping.service';

@ApiTags('Data Mapping Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integration/mapping')
export class DataMappingController {
  constructor(private readonly mappingService: DataMappingService) {}

  @Post('templates')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary: 'Create a new visual data mapping and transformation template',
  })
  async createTemplate(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: {
      name: string;
      sourceEntity: string;
      targetEntity: string;
      mappingRules: MappingRule[];
      isActive?: boolean;
    },
  ) {
    return this.mappingService.createTemplate(user.companyId, user.userId, dto);
  }

  @Get('templates')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'List all data mapping templates for the current tenant',
  })
  async getTemplates(@GetUser() user: AuthenticatedUser) {
    return this.mappingService.getTemplates(user.companyId);
  }

  @Get('templates/:id')
  @RequirePermissions('integrations:read')
  @ApiOperation({ summary: 'Get details of a specific data mapping template' })
  async getTemplate(
    @GetUser() user: AuthenticatedUser,
    @Param('id') templateId: string,
  ) {
    return this.mappingService.getTemplate(user.companyId, templateId);
  }

  @Post('preview')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary:
      'Preview payload transformation using a mapping template and sample data',
  })
  async previewMapping(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { templateIdOrName: string; samplePayload: any },
  ) {
    return this.mappingService.previewMapping(
      user.companyId,
      dto.templateIdOrName,
      dto.samplePayload,
    );
  }
}
