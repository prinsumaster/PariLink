import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import type { Response } from 'express';

@Controller('data')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DataController {
  constructor(
    private readonly exportService: ExportService,
    private readonly importService: ImportService,
  ) {}

  @Post('export')
  @RequirePermissions('data:export')
  async exportData(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { modules: string[]; format: string },
    @Res() res: Response,
  ) {
    return this.exportService.exportCompanyData(
      user.companyId,
      body.modules,
      body.format,
      res,
    );
  }

  @Post('import')
  @RequirePermissions('data:import')
  async importData(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { moduleType: string; data: any[] },
  ) {
    return this.exportService.exportCompanyData(
      user.companyId,
      [body.moduleType],
      'json',
      {} as any,
    ); // stub
  }
}
