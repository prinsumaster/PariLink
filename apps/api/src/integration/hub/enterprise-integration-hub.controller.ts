import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { EnterpriseIntegrationHubService } from './enterprise-integration-hub.service';

@ApiTags('Enterprise Integration Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integration/hub')
export class EnterpriseIntegrationHubController {
  constructor(private readonly hubService: EnterpriseIntegrationHubService) {}

  @Get('catalog')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'Get full catalog of enterprise integrations and ERP connectors',
  })
  async getCatalog() {
    return this.hubService.getCatalog();
  }

  @Get('installed')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'Get active installed integration connections for current tenant',
  })
  async getInstalledIntegrations(@GetUser() user: AuthenticatedUser) {
    return this.hubService.getInstalledIntegrations(user.companyId);
  }

  @Post('configure')
  @RequirePermissions('integrations:write')
  @ApiOperation({
    summary:
      'Configure or update an integration connection with encrypted secrets',
  })
  async configureIntegration(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: {
      provider: string;
      credentials: any;
      settings?: any;
      isActive?: boolean;
    },
  ) {
    return this.hubService.configureIntegration(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Post('connections/:id/enable')
  @RequirePermissions('integrations:write')
  @ApiOperation({ summary: 'Enable an existing integration connection' })
  async enableIntegration(
    @GetUser() user: AuthenticatedUser,
    @Param('id') connectionId: string,
  ) {
    return this.hubService.enableIntegration(
      user.companyId,
      connectionId,
      user.userId,
    );
  }

  @Post('connections/:id/disable')
  @RequirePermissions('integrations:write')
  @ApiOperation({ summary: 'Disable an existing integration connection' })
  async disableIntegration(
    @GetUser() user: AuthenticatedUser,
    @Param('id') connectionId: string,
  ) {
    return this.hubService.disableIntegration(
      user.companyId,
      connectionId,
      user.userId,
    );
  }

  @Put('connections/:id/version')
  @RequirePermissions('integrations:write')
  @ApiOperation({ summary: 'Upgrade integration connector version' })
  async updateVersion(
    @GetUser() user: AuthenticatedUser,
    @Param('id') connectionId: string,
    @Body('version') version: string,
  ) {
    return this.hubService.updateVersion(
      user.companyId,
      connectionId,
      version,
      user.userId,
    );
  }

  @Get('connections/:id/health')
  @RequirePermissions('integrations:read')
  @ApiOperation({
    summary: 'Check real-time health and latency of integration provider',
  })
  async checkHealth(
    @GetUser() user: AuthenticatedUser,
    @Param('id') connectionId: string,
  ) {
    return this.hubService.checkHealth(user.companyId, connectionId);
  }
}
