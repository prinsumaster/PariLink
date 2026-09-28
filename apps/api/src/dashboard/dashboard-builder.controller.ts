import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DashboardBuilderService } from './dashboard-builder.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
@Controller('dashboard-builder')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardBuilderController {
  constructor(private builderService: DashboardBuilderService) {}

  @Post()
  @RequirePermissions('dashboard:write')
  async createDashboard(@Req() req: any, @Body() dto: any) {
    return this.builderService.createDashboard(
      req.user.companyId,
      dto,
      req.user.id,
    );
  }

  @Get()
  async listDashboards(@Req() req: any) {
    return this.builderService.listDashboards(req.user.companyId);
  }

  @Get(':id')
  async getDashboard(@Req() req: any, @Param('id') id: string) {
    return this.builderService.getDashboard(req.user.companyId, id);
  }

  @Post(':id/widgets')
  @RequirePermissions('dashboard:write')
  async addWidget(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.builderService.addWidget(req.user.companyId, id, dto);
  }

  @Put(':id/widgets/layout')
  @RequirePermissions('dashboard:write')
  async updateWidgetLayout(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: any, // array of layouts
  ) {
    return this.builderService.updateWidgetLayout(req.user.companyId, id, dto);
  }

  @Delete(':id/widgets/:widgetId')
  @RequirePermissions('dashboard:write')
  async deleteWidget(
    @Req() req: any,
    @Param('id') id: string,
    @Param('widgetId') widgetId: string,
  ) {
    return this.builderService.deleteWidget(req.user.companyId, id, widgetId);
  }
}
