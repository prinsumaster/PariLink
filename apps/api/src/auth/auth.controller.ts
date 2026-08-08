import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    roleId?: string;
    companyId?: string;
  };
  cookies: Record<string, string>;
}
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  // Enterprise Security: Prevent Brute Force Attacks. Max 500 attempts per IP per minute.
  @Throttle({ default: { limit: process.env.NODE_ENV === 'test' ? 1000 : 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Return JWT access token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const ip = request.ip || '0.0.0.0';
    const userAgent = request.headers['user-agent'] || 'Unknown Device';
    const result = await this.authService.login(loginDto, ip, userAgent);

    if ('requiresMfa' in result) {
      return result;
    }

    response.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    response.cookie('logged_in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  // Enterprise Security: Rate limit registration endpoint
  @Throttle({ default: { limit: process.env.NODE_ENV === 'test' ? 1000 : 5, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 201, description: 'Return JWT access token.' })
  @ApiResponse({ status: 403, description: 'User already exists.' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const ip = request.ip || '0.0.0.0';
    const userAgent = request.headers['user-agent'] || 'Unknown Device';
    const result = await this.authService.register(registerDto, ip, userAgent);

    if ('requiresMfa' in result) {
      return result;
    }

    response.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('logged_in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using HttpOnly cookie' })
  @ApiResponse({ status: 200, description: 'Return new JWT access token.' })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing refresh token.',
  })
  async refresh(
    @Req() request: Request,
    @Body() refreshDto: RefreshDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    const ip = request.ip || '0.0.0.0';
    const userAgent = request.headers['user-agent'] || 'Unknown Device';

    const result = await this.authService.refreshToken(
      refreshToken,
      ip,
      userAgent,
      refreshDto?.deviceFingerprint,
    );

    response.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    response.cookie('logged_in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { refresh_token, access_token, ...safeResult } = result;
    return safeResult;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear refresh token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out.' })
  async logout(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    await this.authService.logout(refreshToken, request.user.id);
    response.clearCookie('refresh_token');
    response.clearCookie('access_token');
    response.clearCookie('logged_in');
    return { success: true };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all active sessions' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out of all sessions.',
  })
  async logoutAll(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logoutAllSessions(request.user.id);
    response.clearCookie('refresh_token');
    response.clearCookie('access_token');
    response.clearCookie('logged_in');
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // WebAuthn / Passkeys
  // -------------------------------------------------------------------------

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('webauthn/register/generate-options')
  @ApiOperation({ summary: 'Generate WebAuthn Registration Options' })
  async generateRegistrationOptions(@Body('email') email: string) {
    return this.authService.generateWebAuthnRegistrationOptions(email);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('webauthn/register/verify')
  @ApiOperation({ summary: 'Verify WebAuthn Registration Response' })
  async verifyRegistration(
    @Body('email') email: string,
    @Body('response') response: unknown,
  ) {
    return this.authService.verifyWebAuthnRegistration(email, response);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('webauthn/authenticate/generate-options')
  @ApiOperation({ summary: 'Generate WebAuthn Authentication Options' })
  async generateAuthenticationOptions(@Body('email') email: string) {
    return this.authService.generateWebAuthnAuthenticationOptions(email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('webauthn/authenticate/verify')
  @ApiOperation({ summary: 'Verify WebAuthn Authentication Response' })
  async verifyAuthentication(
    @Body('email') email: string,
    @Body('response') responseBody: unknown,
    @Body('deviceFingerprint') deviceFingerprint: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const ip = request.ip || '0.0.0.0';
    const userAgent = request.headers['user-agent'] || 'Unknown Device';

    const result = await this.authService.verifyWebAuthnAuthentication(
      email,
      responseBody,
      ip,
      userAgent,
      deviceFingerprint,
    );

    response.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { refresh_token, ...safeResult } = result;
    return safeResult;
  }

  // -------------------------------------------------------------------------
  // Session Management
  // -------------------------------------------------------------------------

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active sessions for current user' })
  async getSessions(@Req() req: RequestWithUser) {
    return this.authService.getActiveSessions(req.user.id);
  }

  @Post('sessions/:id/revoke')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a specific session' })
  async revokeSession(
    @Req() req: RequestWithUser,
    @Param('id') sessionId: string,
  ) {
    return this.authService.revokeSession(req.user.id, sessionId);
  }

  // -------------------------------------------------------------------------
  // Multi-Factor Authentication
  // -------------------------------------------------------------------------

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate MFA Setup (TOTP)' })
  async setupMfa(@Req() req: RequestWithUser) {
    return this.mfaService.generateTotpSecret(req.user.id, req.user.email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('mfa/verify-setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify and enable MFA' })
  async verifyMfaSetup(
    @Req() req: RequestWithUser,
    @Body('token') token: string,
  ) {
    return this.mfaService.verifyTotpSetup(req.user.id, token);
  }
}
