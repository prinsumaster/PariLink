import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BruteForceProtectionService } from '../platform/security/brute-force/brute-force-protection.service';
import { MfaService } from './mfa.service';
import { IntegrationsModule } from '../integrations/integrations.module';

import * as crypto from 'crypto';

let ephemeralPrivateKey: string | null = null;
let ephemeralPublicKey: string | null = null;

function resolveJwtKeys(): { privateKey: string; publicKey: string } {
  if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
    let privateKey = process.env.JWT_PRIVATE_KEY;
    let publicKey = process.env.JWT_PUBLIC_KEY;
    if (!privateKey.includes('-----BEGIN')) {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
    }
    if (!publicKey.includes('-----BEGIN')) {
      publicKey = Buffer.from(publicKey, 'base64').toString('utf8');
    }
    return {
      privateKey,
      publicKey,
    };
  }

  // Abort unconditionally unless ALLOW_EPHEMERAL_JWT_KEYS=true is set explicitly.
  // This catches staging/preview envs that omit NODE_ENV=production but still
  // run multiple replicas — intermittent 401s from key mismatch are hard to debug.
  if (process.env.ALLOW_EPHEMERAL_JWT_KEYS !== 'true') {
    throw new Error(
      '[AUTH] CRITICAL: JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are missing. ' +
      'Set ALLOW_EPHEMERAL_JWT_KEYS=true to allow ephemeral keys in development, ' +
      'or provide real keys via environment variables.'
    );
  }

  if (!ephemeralPrivateKey || !ephemeralPublicKey) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    ephemeralPrivateKey = privateKey;
    ephemeralPublicKey = publicKey;

    const fingerprint = crypto
      .createHash('sha256')
      .update(ephemeralPublicKey)
      .digest('hex')
      .substring(0, 8);

    console.warn(
      `[AUTH] WARN: Using EPHEMERAL RS256 keypair (fingerprint: ${fingerprint}). ` +
      'Tokens will be invalidated on restart. ' +
      'Multi-replica deployments will have intermittent 401s. ' +
      'Set JWT_PRIVATE_KEY and JWT_PUBLIC_KEY for stable operation.'
    );
  }

  return {
    privateKey: ephemeralPrivateKey,
    publicKey: ephemeralPublicKey,
  };
}

export function getJwtPublicKey(): string {
  return resolveJwtKeys().publicKey;
}

export function getJwtPrivateKey(): string {
  return resolveJwtKeys().privateKey;
}

@Module({
  imports: [
    PassportModule,
    IntegrationsModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const keys = resolveJwtKeys();
        return {
          privateKey: keys.privateKey,
          publicKey: keys.publicKey,
          signOptions: {
            expiresIn: '15m',
            algorithm: 'RS256',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    BruteForceProtectionService,
    MfaService,
  ],
  exports: [AuthService, MfaService],
})
export class AuthModule {}
