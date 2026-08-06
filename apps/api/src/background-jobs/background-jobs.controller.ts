import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Background Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class BackgroundJobsController {
  constructor(private readonly jobsService: BackgroundJobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent background jobs for the user' })
  getJobs(@GetUser() user: AuthenticatedUser, @Query('limit') limit?: string) {
    return this.jobsService.getJobs(
      user.companyId,
      user.userId,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active background jobs for the user' })
  getActiveJobs(@GetUser() user: AuthenticatedUser) {
    return this.jobsService.getActiveJobs(user.companyId, user.userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending or processing background job' })
  cancelJob(@Param('id') id: string) {
    return this.jobsService.cancelJob(id);
  }
}
