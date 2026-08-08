import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocalizationService } from './localization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('localization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('localization')
export class LocalizationController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Post('locales')
  @RequirePermissions('admin:write')
  @ApiOperation({ summary: 'Create a new locale' })
  async createLocale(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.localizationService.createLocale(user.companyId, data);
  }

  @Get('locales')
  @RequirePermissions('admin:read')
  @ApiOperation({ summary: 'List all locales' })
  async getLocales(@GetUser() user: AuthenticatedUser) {
    return this.localizationService.getLocales(user.companyId);
  }

  @Put('translations/:localeId')
  @RequirePermissions('admin:write')
  @ApiOperation({ summary: 'Add or update a translation' })
  async upsertTranslation(
    @GetUser() user: AuthenticatedUser,
    @Param('localeId') localeId: string,
    @Body() data: { namespace?: string; key: string; value: string },
  ) {
    return this.localizationService.upsertTranslation(
      user.companyId,
      localeId,
      data,
    );
  }

  @Get('translations/:localeCode')
  @ApiOperation({ summary: 'Get translations for a locale' })
  async getTranslations(
    @GetUser() user: AuthenticatedUser,
    @Param('localeCode') localeCode: string,
    @Query('namespace') namespace?: string,
  ) {
    return this.localizationService.getTranslations(
      user.companyId,
      localeCode,
      namespace,
    );
  }
}
