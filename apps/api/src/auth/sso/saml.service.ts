import { Injectable, BadRequestException } from '@nestjs/common';
import { SAML } from 'passport-saml/lib/node-saml';
import type { Request } from 'express';

@Injectable()
export class SamlService {
  getSamlStrategy(idp: any): SAML {
    if (!idp.entryPoint || !idp.cert) {
      throw new BadRequestException('SAML configuration incomplete');
    }

    return new SAML({
      callbackUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/sso/callback/saml/${idp.id}`,
      entryPoint: idp.entryPoint,
      issuer: process.env.APP_URL || 'http://localhost:3000',
      cert: idp.cert, // The IdP public certificate
      identifierFormat:
        idp.identifierFormat ||
        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      authnContext: idp.authnContext
        ? [idp.authnContext]
        : ['urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'],
    });
  }

  async generateLoginUrl(idp: any, req: Request): Promise<string> {
    const saml = this.getSamlStrategy(idp);
    try {
      return await saml.getAuthorizeUrlAsync(
        (req.query.state as string) || '',
        undefined,
        {},
      );
    } catch (err: any) {
      throw err instanceof Error
        ? err
        : new Error(err?.message || 'Failed to generate SAML authorize URL');
    }
  }

  async validateResponse(idp: any, samlResponse: string, req: Request) {
    const saml = this.getSamlStrategy(idp);
    const proxyReq = {
      body: { SAMLResponse: samlResponse },
    };

    try {
      const { profile } = await saml.validatePostResponseAsync(proxyReq.body);
      if (!profile) {
        throw new Error('No profile in SAML response');
      }
      return {
        id: profile.nameID || profile.nameIDFormat,
        email: profile.email || profile.nameID,
        firstName: profile.firstName || profile.givenName,
        lastName: profile.lastName || profile.surname,
        sessionId: profile.sessionIndex,
        groups: profile.groups || profile.role,
      };
    } catch (err: any) {
      throw err instanceof Error
        ? err
        : new Error(err?.message || 'SAML Validation Failed');
    }
  }
}
