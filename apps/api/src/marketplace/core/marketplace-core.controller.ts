import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MarketplaceCoreService } from './marketplace-core.service';
import { InstallAppDto } from './dto/install-app.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// In a real application, you would also use a CompanyGuard or RolesGuard

@ApiTags('Enterprise Plugins')
@ApiBearerAuth()
@Controller('admin/marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceCoreController {
  constructor(private readonly marketplaceService: MarketplaceCoreService) {}

  /**
   * Get marketplace catalog (Phase 6 & 7)
   */
  @Get('apps')
  @ApiOperation({ summary: 'Get marketplace catalog' })
  async getCatalog(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.marketplaceService.getCatalog({ search, category });
  }

  /**
   * Get installed apps for a company (Phase 5)
   */
  @Get('installed')
  @ApiOperation({ summary: 'Get installed apps for a company' })
  async getInstalledApps(@Req() req: any) {
    // Assuming req.user contains the user's company context
    const companyId = req.user.companyId || req.user.currentWorkspaceId;
    return this.marketplaceService.getInstalledApps(companyId);
  }

  /**
   * Get specific app details (Phase 6)
   */
  @Get('apps/:id')
  @ApiOperation({ summary: 'Get specific app details' })
  async getAppDetails(@Param('id') id: string) {
    return this.marketplaceService.getAppDetails(id);
  }

  /**
   * Get specific installation details (Phase 5)
   */
  @Get('installed/:id')
  @ApiOperation({ summary: 'Get specific installation details' })
  async getInstallationDetails(@Param('id') appId: string, @Req() req: any) {
    const companyId = req.user.companyId || req.user.currentWorkspaceId;
    return this.marketplaceService.getInstallationDetails(companyId, appId);
  }

  /**
   * Install an App (Phase 2 & 3)
   */
  @Post('apps/:id/install')
  @ApiOperation({ summary: 'Install an App' })
  async installApp(
    @Param('id') appId: string,
    @Body() dto: Partial<InstallAppDto>,
    @Req() req: any,
  ) {
    const companyId = req.user.companyId || req.user.currentWorkspaceId;

    const installDto: InstallAppDto = {
      appId,
      ...dto,
    };

    return this.marketplaceService.installApp(
      companyId,
      req.user.id,
      installDto,
    );
  }

  /**
   * Uninstall an App (Phase 3)
   */
  @Delete('apps/:id')
  async uninstallApp(@Param('id') appId: string, @Req() req: any) {
    const companyId = req.user.companyId || req.user.currentWorkspaceId;
    return this.marketplaceService.uninstallApp(companyId, appId);
  }

  /**
   * Disable an App (Phase 3)
   */
  @Patch('apps/:id/disable')
  async disableApp(@Param('id') appId: string, @Req() req: any) {
    const companyId = req.user.companyId || req.user.currentWorkspaceId;
    return this.marketplaceService.toggleAppStatus(
      companyId,
      appId,
      'SUSPENDED',
    );
  }

  /**
   * Enable an App (Phase 3)
   */
  @Patch('apps/:id/enable')
  async enableApp(@Param('id') appId: string, @Req() req: any) {
    const companyId = req.user.companyId || req.user.currentWorkspaceId;
    return this.marketplaceService.toggleAppStatus(companyId, appId, 'ACTIVE');
  }
}
