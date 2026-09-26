import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { DemoService } from './demo.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Demo SaaS')
@ApiBearerAuth()
@Controller('saas/demo')
@UseGuards(JwtAuthGuard)
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post('seed')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Provision a demo tenant' })
  async provisionDemoTenant() {
    return this.demoService.provisionDemoTenant();
  }

  @Delete(':tenantId')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Destroy a demo tenant' })
  async destroyDemoTenant(@Param('tenantId') tenantId: string) {
    return this.demoService.destroyDemoTenant(tenantId);
  }
}
