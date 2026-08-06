import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SsoService } from './sso.service';
import type { Request } from 'express';

@ApiTags('admin-sso')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies/:companyId/idps')
export class AdminSsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Get()
  @ApiOperation({ summary: 'List Identity Providers for a company' })
  async listProviders(@Param('companyId') companyId: string) {
    return this.ssoService.listProviders(companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an Identity Provider' })
  async createProvider(
    @Param('companyId') companyId: string,
    @Body() payload: Record<string, unknown>,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.id;
    return this.ssoService.createProvider(companyId, payload, userId);
  }

  @Patch(':idpId')
  @ApiOperation({ summary: 'Update an Identity Provider' })
  async updateProvider(
    @Param('companyId') companyId: string,
    @Param('idpId') idpId: string,
    @Body() payload: Record<string, unknown>,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.id;
    return this.ssoService.updateProvider(companyId, idpId, payload, userId);
  }

  @Delete(':idpId')
  @ApiOperation({ summary: 'Delete/Disable an Identity Provider' })
  async deleteProvider(
    @Param('companyId') companyId: string,
    @Param('idpId') idpId: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.id;
    return this.ssoService.deleteProvider(companyId, idpId, userId);
  }
}
