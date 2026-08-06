import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Exports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  @ApiOperation({ summary: 'Request a new data export' })
  async requestExport(
    @GetUser() user: AuthenticatedUser,
    @Body('entityType') entityType: string,
  ) {
    return this.exportsService.generateExport(
      user.companyId,
      user.userId,
      entityType,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all export jobs for the current user' })
  async getExports(@GetUser() user: AuthenticatedUser) {
    return this.exportsService.getExports(user.companyId, user.userId);
  }
}
