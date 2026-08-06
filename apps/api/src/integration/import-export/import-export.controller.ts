import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ImportExportService } from './import-export.service';

@ApiTags('Import & Export Console')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integration')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Post('import/preview')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'Preview bulk data import with validation and duplicate detection',
  })
  async previewImport(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { entityType: string; format: string; rows: any[] },
  ) {
    return this.importExportService.previewImport(
      user.companyId,
      dto.entityType,
      dto.format,
      dto.rows,
    );
  }

  @Post('import/execute')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary: 'Execute bulk data import in transaction with rollback on error',
  })
  async executeImport(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: {
      entityType: string;
      format: string;
      rows: any[];
      rollbackOnError?: boolean;
    },
  ) {
    return this.importExportService.executeImport(
      user.companyId,
      user.userId,
      dto.entityType,
      dto.format,
      dto.rows,
      dto.rollbackOnError !== false,
    );
  }

  @Post('export/execute')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'Execute bulk data export into CSV, XML, JSON, or Excel format',
  })
  async executeExport(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { entityType: string; format: string; filter?: any },
  ) {
    return this.importExportService.executeExport(
      user.companyId,
      user.userId,
      dto.entityType,
      dto.format,
      dto.filter,
    );
  }

  @Get('jobs')
  @RequirePermissions('integrations:read')
  @ApiOperation({ summary: 'List background sync, import, and export jobs' })
  async listJobs(
    @GetUser() user: AuthenticatedUser,
    @Query('type') type?: string,
  ) {
    return this.importExportService.listJobs(user.companyId, type);
  }

  @Get('jobs/:id')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'Get status and results of a background import/export job',
  })
  async getJobStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    return this.importExportService.getJobStatus(user.companyId, jobId);
  }
}
