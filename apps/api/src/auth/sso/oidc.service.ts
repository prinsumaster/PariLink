import { Injectable, BadRequestException } from '@nestjs/common';
import { Issuer, Client, TokenSet } from 'openid-client';
import type { Request } from 'express';

@Injectable()
export class OidcService {
  async getClient(idp: any): Promise<Client> {
    if (!idp.issuer || !idp.clientId || !idp.clientSecret) {
      throw new BadRequestException('OIDC configuration incomplete');
    }

    const issuer = await Issuer.discover(idp.issuer).catch(() => {
      // Fallback if discovery fails but endpoints are provided manually
      return new Issuer({
        issuer: idp.issuer,
        authorization_endpoint: idp.authorizationEndpoint,
        token_endpoint: idp.tokenEndpoint,
        userinfo_endpoint: idp.userinfoEndpoint,
        jwks_uri: idp.jwksUri,
      });
    });

    return new issuer.Client({
      client_id: idp.clientId,
      client_secret: idp.clientSecret,
      redirect_uris: [
        `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/sso/callback/oidc/${idp.id}`,
      ],
      response_types: ['code'],
    });
  }

  async generateLoginUrl(idp: any, req: Request): Promise<string> {
    const client = await this.getClient(idp);

    const url = client.authorizationUrl({
      scope: 'openid email profile',
      state: (req.query.state as string) || undefined,
      nonce: 'static-nonce', // In production, generate securely and store in session
    });

    return url;
  }

  async validateCallback(idp: any, input: any, req: Request) {
    const client = await this.getClient(idp);
    const params = client.callbackParams(req);

    // In production, validate state and nonce against stored session values
    const tokenSet: TokenSet = await client.callback(
      `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/sso/callback/oidc/${idp.id}`,
      params,
      { nonce: 'static-nonce' }, // Use dynamic nonce stored in session
    );

    const claims = tokenSet.claims();

    return {
      id: claims.sub,
      email: claims.email,
      firstName: claims.given_name || claims.name?.split(' ')[0],
      lastName: claims.family_name || claims.name?.split(' ')[1],
      sessionId: claims.sid || tokenSet.session_state,
      groups: claims.groups || claims.roles, // Entra ID/Okta usually puts this in roles or groups claim
    };
  }
}
