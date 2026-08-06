import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiPlatformService } from './api-platform.service';
import { CreateApiKeyDto, CreateWebhookDto } from './dto/api-platform.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('api-platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api-platform')
export class ApiPlatformController {
  constructor(private readonly apiPlatformService: ApiPlatformService) {}

  @Post('keys')
  @RequirePermissions('api:write')
  @ApiOperation({ summary: 'Generate a new API key' })
  createApiKey(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.apiPlatformService.createApiKey(user.companyId, dto);
  }

  @Get('keys')
  @RequirePermissions('api:read')
  @ApiOperation({ summary: 'Get active API keys' })
  getApiKeys(@GetUser() user: AuthenticatedUser) {
    return this.apiPlatformService.getApiKeys(user.companyId);
  }

  @Post('webhooks')
  @RequirePermissions('api:write')
  @ApiOperation({ summary: 'Register a webhook endpoint' })
  registerWebhook(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateWebhookDto,
  ) {
    return this.apiPlatformService.registerWebhook(user.companyId, dto);
  }

  @Get('webhooks')
  @RequirePermissions('api:read')
  @ApiOperation({ summary: 'Get registered webhooks' })
  getWebhooks(@GetUser() user: AuthenticatedUser) {
    return this.apiPlatformService.getWebhooks(user.companyId);
  }
}
