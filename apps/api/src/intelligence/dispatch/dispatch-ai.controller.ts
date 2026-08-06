import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { DispatchAiService } from './dispatch-ai.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../platform/security/tenant.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

@Controller('intelligence/dispatch')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(TenantInterceptor)
export class DispatchAiController {
  constructor(private readonly dispatchAiService: DispatchAiService) {}

  @Post(':loadId/recommend')
  @RequirePermissions('dispatch:ai:read')
  async requestRecommendation(
    @Param('loadId') loadId: string,
    @Req() req: any,
  ) {
    const { companyId, id: userId } = req.user;
    return this.dispatchAiService.requestRecommendation(
      companyId,
      loadId,
      userId,
    );
  }
}
