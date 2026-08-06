import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiKeyService } from '../services/api-keys.service';
import { OAuth2Service } from '../services/oauth2.service';
import { PatService } from '../services/pat.service';
import {
  CreateApiKeyDto,
  CreateOAuthClientDto,
  CreatePatDto,
} from '../dto/iam.dto';
import type { Request } from 'express';
import { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Enterprise IAM')
@Controller('iam')
export class IamController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly oauth2Service: OAuth2Service,
    private readonly patService: PatService,
  ) {}

  @Post('api-keys')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new API Key' })
  async createApiKey(@Body() dto: CreateApiKeyDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.apiKeyService.createApiKey(
      user.companyId,
      dto.name,
      dto.scopes,
      dto.userId,
      dto.environment,
      dto.expiresInDays,
    );
  }

  @Delete('api-keys/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke an API Key' })
  async revokeApiKey(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.apiKeyService.revokeApiKey(id, user.companyId, user.userId);
  }

  @Post('oauth-clients')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register a new OAuth2 Client' })
  async createOAuthClient(
    @Body() dto: CreateOAuthClientDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.oauth2Service.registerClient(
      user.companyId,
      dto.name,
      dto.description,
      dto.scopes,
    );
  }

  @Post('pats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Personal Access Token' })
  async createPat(@Body() dto: CreatePatDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.patService.createPat(
      user.userId,
      user.companyId,
      dto.name,
      dto.scopes,
      dto.expiresInDays,
    );
  }

  @Delete('pats/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke a Personal Access Token' })
  async revokePat(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.patService.revokePat(id, user.userId, user.companyId);
  }

  @Post('oauth/token')
  @ApiOperation({ summary: 'Get an OAuth2 Client Credentials Token' })
  async issueToken(
    @Body()
    body: {
      client_id: string;
      client_secret: string;
      scope?: string;
      grant_type?: string;
    },
  ) {
    // In a real OAuth2 flow, this would parse grant_type=client_credentials and auth headers
    const { client_id, client_secret, scope } = body;
    const requestedScopes = scope ? scope.split(' ') : [];
    return this.oauth2Service.issueClientCredentialsToken(
      client_id,
      client_secret,
      requestedScopes,
    );
  }
}
