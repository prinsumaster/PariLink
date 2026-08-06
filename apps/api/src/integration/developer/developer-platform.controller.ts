import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { DeveloperPlatformService } from './developer-platform.service';

@ApiTags('Developer Portal & API Platform')
@Controller('integration/developer')
export class DeveloperPlatformController {
  constructor(private readonly devPlatform: DeveloperPlatformService) {}

  @Get('openapi.json')
  @ApiOperation({
    summary:
      'Get OpenAPI 3.0 specification for PariLink Enterprise Integration Hub',
  })
  async getOpenApiSchema() {
    return this.devPlatform.getOpenApiSchema();
  }

  @Get('versions')
  @ApiOperation({
    summary:
      'List API versions, release dates, and deprecation lifecycle status',
  })
  async listApiVersions() {
    return this.devPlatform.listApiVersions();
  }

  @Get('sdk/:language')
  @ApiOperation({
    summary:
      'Generate client SDK code snippets in TypeScript, Python, cURL, etc.',
  })
  async generateSdkSnippet(@Param('language') language: string) {
    return this.devPlatform.generateSdkSnippet(language);
  }

  @Get('sample')
  @ApiOperation({
    summary: 'Generate sample JSON request payload and headers for testing',
  })
  async generateSampleRequest(
    @Query('endpoint') endpoint: string,
    @Query('method') method: string,
  ) {
    return this.devPlatform.generateSampleRequest(
      endpoint || '/integration/events/publish',
      method || 'POST',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('oauth/clients')
  @RequirePermissions('api:write')
  @ApiOperation({
    summary: 'Create an OAuth2 application client for third-party integration',
  })
  async createOAuthClient(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { name: string; redirectUris: string[]; scopes: string[] },
  ) {
    return this.devPlatform.createOAuthClient(user.companyId, user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('oauth/clients')
  @RequirePermissions('api:read')
  @ApiOperation({ summary: 'List registered OAuth2 application clients' })
  async listOAuthClients(@GetUser() user: AuthenticatedUser) {
    return this.devPlatform.listOAuthClients(user.companyId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete('oauth/clients/:id')
  @RequirePermissions('api:write')
  @ApiOperation({ summary: 'Revoke an OAuth2 application client' })
  async revokeOAuthClient(
    @GetUser() user: AuthenticatedUser,
    @Param('id') clientId: string,
  ) {
    return this.devPlatform.revokeOAuthClient(
      user.companyId,
      clientId,
      user.userId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('analytics')
  @RequirePermissions('api:read')
  @ApiOperation({
    summary:
      'Get API usage analytics, quotas, throttle rates, and error frequencies',
  })
  async getAnalytics(@GetUser() user: AuthenticatedUser) {
    return this.devPlatform.getApiUsageAnalytics(user.companyId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('keys/:id/rotate')
  @RequirePermissions('api:write')
  @ApiOperation({ summary: 'Rotate an API key securely without downtime' })
  async rotateApiKey(
    @GetUser() user: AuthenticatedUser,
    @Param('id') keyId: string,
  ) {
    return this.devPlatform.rotateApiKey(user.companyId, keyId, user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('webhook/test')
  @RequirePermissions('webhooks:write')
  @ApiOperation({
    summary:
      'Test webhook endpoint delivery in sandbox mode with live telemetry',
  })
  async testWebhook(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: { url: string; secret?: string; eventType: string; sampleData: any },
  ) {
    return this.devPlatform.testWebhookSandbox(user.companyId, dto);
  }
}
