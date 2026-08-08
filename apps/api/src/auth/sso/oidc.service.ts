import { Injectable, BadRequestException } from '@nestjs/common';
import { Issuer, Client, TokenSet } from 'openid-client';
import type { Request } from 'express';
import * as crypto from 'crypto';

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

    // Generate cryptographically secure nonce — stored in session for validation
    const nonce = crypto.randomUUID();
    const state = (req.query.state as string) || crypto.randomUUID();

    // Store nonce and state in session for callback validation
    (req as any).session = (req as any).session || {};
    (req as any).session.oidcNonce = nonce;
    (req as any).session.oidcState = state;

    const url = client.authorizationUrl({
      scope: 'openid email profile',
      state,
      nonce,
    });

    return url;
  }

  async validateCallback(idp: any, input: any, req: Request) {
    const client = await this.getClient(idp);
    const params = client.callbackParams(req);

    // Retrieve nonce from session — prevents replay and CSRF
    const sessionNonce = (req as any).session?.oidcNonce;
    if (!sessionNonce) {
      throw new BadRequestException(
        'OIDC session state missing — possible CSRF',
      );
    }

    const tokenSet: TokenSet = await client.callback(
      `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/sso/callback/oidc/${idp.id}`,
      params,
      { nonce: sessionNonce },
    );

    // Clear session nonce after use (one-time use)
    delete (req as any).session.oidcNonce;
    delete (req as any).session.oidcState;

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
