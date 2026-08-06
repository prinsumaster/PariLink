import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiKeyService } from '../../../iam/services/api-keys.service';
import { PatService } from '../../../iam/services/pat.service';
import { OAuth2Service } from '../../../iam/services/oauth2.service';
import { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';

/**
 * ApiV2AuthGuard acts as a facade for Public API Authentication.
 * It natively handles API Keys, PATs, OAuth2 Client Credentials,
 * and falls back to standard JWT authentication.
 */
@Injectable()
export class ApiV2AuthGuard extends JwtAuthGuard {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly patService: PatService,
    private readonly oauth2Service: OAuth2Service,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      if (token.startsWith('pk_')) {
        const key = await this.apiKeyService.validateApiKey(token);
        request.user = {
          userId: key.userId || 'api-key-user',
          companyId: key.companyId,
          email: 'api-key@system.local',
          roleId: 'system-role',
          roles: [],
          scopes: JSON.parse(key.scopes as string) || [],
          type: 'api_key',
        } as AuthenticatedUser;
        return true;
      }

      if (token.startsWith('pat_')) {
        const pat = await this.patService.validatePat(token);
        request.user = {
          userId: pat.userId,
          companyId: pat.companyId,
          email: pat.user?.email || 'pat@system.local',
          roleId: pat.user?.roleId || 'system-role',
          roles: [],
          scopes: JSON.parse(pat.scopes as string) || [],
          type: 'pat',
        } as AuthenticatedUser;
        return true;
      }

      // Try OAuth2 token first if it's not a standard PariLink JWT
      try {
        const oauthToken = await this.oauth2Service.validateToken(token);
        request.user = {
          userId: oauthToken.client.clientId,
          companyId: oauthToken.client.companyId,
          email: 'oauth2-client@system.local',
          roleId: 'system-role',
          roles: [],
          scopes: JSON.parse(oauthToken.scopes as string) || [],
          type: 'oauth2_client',
        } as AuthenticatedUser;
        return true;
      } catch (e) {
        // Fallback to internal JWT
        const result = await super.canActivate(context);
        return result as boolean;
      }
    } catch (err) {
      throw new UnauthorizedException(
        err.message || 'Invalid API Key or Bearer Token',
      );
    }
  }
}
