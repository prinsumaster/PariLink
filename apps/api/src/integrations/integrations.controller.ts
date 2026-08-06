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
import { IntegrationsService } from './integrations.service';
import {
  ConfigureIntegrationDto,
  SyncIntegrationDto,
} from './dto/integrations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('configure')
  @RequirePermissions('integrations:write')
  @ApiOperation({ summary: 'Configure a 3rd party integration' })
  configureIntegration(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: ConfigureIntegrationDto,
  ) {
    return this.integrationsService.configureIntegration(user.companyId, dto);
  }

  @Post('sync')
  @RequirePermissions('integrations:write')
  @ApiOperation({ summary: 'Sync an entity manually to connected ERPs' })
  syncEntity(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: SyncIntegrationDto,
  ) {
    return this.integrationsService.syncEntity(user.companyId, dto);
  }

  @Get()
  @RequirePermissions('integrations:read')
  @ApiOperation({ summary: 'Get connected integrations' })
  getIntegrations(@GetUser() user: AuthenticatedUser) {
    return this.integrationsService.getIntegrations(user.companyId);
  }
}
