import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { CreatePartDto } from './dto/create-part.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateTyreLogDto } from './dto/create-tyre-log.dto';
import { CreateJobPartDto } from './dto/create-job-part.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('workshop')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Post('job-cards')
  @RequirePermissions('fleet:write')
  async createJobCard(@GetUser() user: AuthenticatedUser, @Body() data: CreateJobCardDto) {
    return this.workshopService.createJobCard(user.companyId, data);
  }

  @Get('job-cards')
  @RequirePermissions('fleet:read')
  async getAllJobCards(@GetUser() user: AuthenticatedUser) {
    return this.workshopService.getAllJobCards(user.companyId);
  }

  @Get('job-cards/:id')
  @RequirePermissions('fleet:read')
  async getJobCard(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workshopService.getJobCard(user.companyId, id);
  }

  @Post('parts')
  @RequirePermissions('fleet:write')
  async createPart(@GetUser() user: AuthenticatedUser, @Body() data: CreatePartDto) {
    return this.workshopService.createPart(user.companyId, data);
  }

  @Get('parts')
  @RequirePermissions('fleet:read')
  async getAllParts(@GetUser() user: AuthenticatedUser) {
    return this.workshopService.getAllParts(user.companyId);
  }

  @Get('parts/:id')
  @RequirePermissions('fleet:read')
  async getPart(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workshopService.getPart(user.companyId, id);
  }

  @Get('vendors')
  @RequirePermissions('fleet:read')
  async getAllVendors(@GetUser() user: AuthenticatedUser) {
    return this.workshopService.getAllVendors(user.companyId);
  }

  @Post('vendors')
  @RequirePermissions('fleet:write')
  async createVendor(@GetUser() user: AuthenticatedUser, @Body() data: CreateVendorDto) {
    return this.workshopService.createVendor(user.companyId, data);
  }

  @Get('tyre-logs')
  @RequirePermissions('fleet:read')
  async getAllTyreLogs(@GetUser() user: AuthenticatedUser) {
    return this.workshopService.getAllTyreLogs(user.companyId);
  }

  @Post('tyre-logs')
  @RequirePermissions('fleet:write')
  async createTyreLog(@GetUser() user: AuthenticatedUser, @Body() data: CreateTyreLogDto) {
    return this.workshopService.createTyreLog(user.companyId, data);
  }

  @Post('job-parts')
  @RequirePermissions('fleet:write')
  async createJobPart(@GetUser() user: AuthenticatedUser, @Body() data: CreateJobPartDto) {
    return this.workshopService.createJobPart(user.companyId, data);
  }

  @Get('job-parts')
  @RequirePermissions('fleet:read')
  async getAllJobParts(@GetUser() user: AuthenticatedUser) {
    return this.workshopService.getAllJobParts(user.companyId);
  }

  @Get('job-parts/:id')
  @RequirePermissions('fleet:read')
  async getJobPart(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workshopService.getJobPart(user.companyId, id);
  }
}
