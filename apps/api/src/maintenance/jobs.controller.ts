import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
export class CreateJobDto {
  @IsString() @IsNotEmpty() description: string;
  @IsString() @IsOptional() assignedTo?: string;
  @IsNumber() @IsOptional() estimatedCost?: number;
}
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('workshop-jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('vehicles/:id/jobs')
  @RequirePermissions('maintenance:write')
  @ApiOperation({ summary: 'Open a maintenance job for a vehicle' })
  async createJob(
    @GetUser() user: AuthenticatedUser,
    @Param('id') vehicleId: string,
    @Body() body: CreateJobDto,
  ) {
    return this.jobsService.createJob(user.companyId, vehicleId, body);
  }

  @Post('jobs/:id/parts')
  @RequirePermissions('maintenance:write')
  @ApiOperation({ summary: 'Add a part to a maintenance job' })
  async addPart(
    @GetUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
    @Body() body: CreateJobDto,
  ) {
    return this.jobsService.addPart(user.companyId, jobId, body);
  }

  @Post('jobs/:id/close')
  @RequirePermissions('maintenance:write')
  @ApiOperation({ summary: 'Close a maintenance job' })
  async closeJob(
    @GetUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    return this.jobsService.closeJob(user.companyId, jobId);
  }

  @Get('vehicles/:id/jobs')
  @RequirePermissions('maintenance:read')
  @ApiOperation({ summary: 'Get all jobs for a vehicle' })
  async getJobsByVehicle(
    @GetUser() user: AuthenticatedUser,
    @Param('id') vehicleId: string,
  ) {
    return this.jobsService.getJobsByVehicle(user.companyId, vehicleId);
  }
}
