import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Param,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SsoService } from './sso.service';
import type { Request, Response } from 'express';

@ApiTags('auth/sso')
@Controller('auth/sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Get('login/:idpId')
  @ApiOperation({ summary: 'Initiate SSO Login' })
  async initiateLogin(
    @Param('idpId') idpId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const redirectUrl = await this.ssoService.generateLoginUrl(idpId, req);
    return res.redirect(redirectUrl);
  }

  @Post('callback/saml/:idpId')
  @ApiOperation({ summary: 'SAML Callback URL' })
  async samlCallback(
    @Param('idpId') idpId: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.ssoService.handleSamlCallback(idpId, body, req);
    return this.handleAuthResult(result, res);
  }

  @Get('callback/oidc/:idpId')
  @ApiOperation({ summary: 'OIDC Callback URL' })
  async oidcCallback(
    @Param('idpId') idpId: string,
    @Query() query: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.ssoService.handleOidcCallback(idpId, query, req);
    return this.handleAuthResult(result, res);
  }

  @Post('callback/oidc/:idpId')
  @ApiOperation({ summary: 'OIDC Callback URL (POST)' })
  async oidcCallbackPost(
    @Param('idpId') idpId: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.ssoService.handleOidcCallback(idpId, body, req);
    return this.handleAuthResult(result, res);
  }

  private handleAuthResult(result: any, res: Response) {
    if (result.error) {
      return res.redirect(`/login?error=${encodeURIComponent(result.error)}`);
    }

    if (result.requiresMfa) {
      // Need a way to pass the partial token to frontend. Usually URL params or cookie.
      res.cookie('mfa_token', result.mfaToken, {
      domain: process.env.COOKIE_DOMAIN || undefined,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });
      return res.redirect(`/login/mfa?userId=${result.user.id}`);
    }

    // Set refresh token
    res.cookie('refresh_token', result.refresh_token, {
      domain: process.env.COOKIE_DOMAIN || undefined,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Pass access token in URL fragment or a secure cookie. Standard is returning to a success page.
    return res.redirect(`/sso-success?token=${result.access_token}`);
  }
}
