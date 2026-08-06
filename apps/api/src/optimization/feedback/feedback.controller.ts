import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FeedbackService, FeedbackAction } from './feedback.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('optimization-feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('optimization/recommendations')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':id/feedback')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Record feedback for a specific recommendation' })
  async recordFeedback(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { action: FeedbackAction; reason?: string },
  ) {
    return this.feedbackService.recordFeedback(
      user.companyId,
      id,
      user.userId,
      body.action,
      body.reason,
    );
  }
}
