import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('reporting')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post('templates')
  async createTemplate(@Req() req: any, @Body() dto: any) {
    return this.reportingService.createTemplate(
      req.user.companyId,
      dto,
      req.user.id,
    );
  }

  @Get('templates')
  async listTemplates(@Req() req: any) {
    return this.reportingService.listTemplates(req.user.companyId);
  }

  @Post('templates/:id/execute')
  async executeReport(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.reportingService.enqueueReportExecution(
      req.user.companyId,
      id,
      dto,
      req.user.id,
    );
  }

  @Post('schedules')
  async createSchedule(@Req() req: any, @Body() dto: any) {
    return this.reportingService.createSchedule(
      req.user.companyId,
      dto,
      req.user.id,
    );
  }

  @Get('executions')
  async listExecutions(@Req() req: any) {
    return this.reportingService.listExecutions(req.user.companyId);
  }
}
