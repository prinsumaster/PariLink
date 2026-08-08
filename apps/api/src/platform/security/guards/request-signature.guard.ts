import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisManagerService } from '../../../common/redis/redis-manager.service';

// ---------------------------------------------------------------------------
// API Request Signature Verification Guard
//
// Provides replay attack protection and request integrity verification
// for external API consumers (webhooks, partner integrations, SDK calls).
//
// Headers required for signed requests:
//   X-Signature       — HMAC-SHA256(secret, canonical_string)
//   X-Timestamp       — ISO 8601 or Unix epoch (ms)
//   X-Nonce           — UUID v4 or random string (unique per request)
//
// Security Controls:
//   1. Clock drift validation — rejects requests older than 5 minutes
//   2. Nonce replay detection — stores nonces in Redis with 10min TTL
//   3. HMAC signature verification — constant-time comparison
//
// Compliance:
//   • SOC 2 CC6.6 — System boundary protection
//   • ISO 27001 A.14.1 — Security of communication
// ---------------------------------------------------------------------------

/** Max allowed clock drift in milliseconds (5 minutes). */
const MAX_CLOCK_DRIFT_MS = 5 * 60 * 1000;

/** Nonce TTL in Redis (10 minutes — covers clock drift + processing time). */
const NONCE_TTL_SECONDS = 600;

@Injectable()
export class RequestSignatureGuard implements CanActivate {
  private readonly logger = new Logger(RequestSignatureGuard.name);

  // In-memory fallback for environments without Redis
  private readonly nonceCache = new Map<string, number>();

  constructor(private readonly redisManager: RedisManagerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    const nonce = request.headers['x-nonce'] as string;

    // If no signature headers, skip — this guard is opt-in via @UseGuards
    if (!signature || !timestamp || !nonce) {
      throw new UnauthorizedException(
        'Missing required headers: X-Signature, X-Timestamp, X-Nonce',
      );
    }

    // 1. Clock drift validation
    const requestTime = this.parseTimestamp(timestamp);
    const now = Date.now();
    const drift = Math.abs(now - requestTime);

    if (drift > MAX_CLOCK_DRIFT_MS) {
      this.logger.warn(
        `[SignatureGuard] Clock drift too large: ${drift}ms from ${request.ip}`,
      );
      throw new UnauthorizedException(
        'Request timestamp is too old or too far in the future',
      );
    }

    // 2. Nonce replay detection
    const isReplay = await this.checkNonce(nonce);
    if (isReplay) {
      this.logger.warn(
        `[SignatureGuard] Nonce replay detected: ${nonce} from ${request.ip}`,
      );
      throw new UnauthorizedException(
        'Duplicate nonce — possible replay attack',
      );
    }

    // 3. Signature verification
    // The API key/secret must be resolved from the request context.
    // For now, we use the tenant's API secret from the request user context
    // or from a header. This integrates with the existing ApiKey auth system.
    const apiSecret = this.resolveApiSecret(request);
    if (!apiSecret) {
      throw new UnauthorizedException(
        'Cannot resolve API secret for signature verification',
      );
    }

    const canonicalString = this.buildCanonicalString(
      request,
      timestamp,
      nonce,
    );
    const expectedSignature = crypto
      .createHmac('sha256', apiSecret)
      .update(canonicalString)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );

    if (!isValid) {
      this.logger.warn(
        `[SignatureGuard] Invalid signature from ${request.ip} for path ${request.url}`,
      );
      throw new UnauthorizedException('Invalid request signature');
    }

    // Store nonce to prevent replay
    await this.storeNonce(nonce);

    return true;
  }

  private parseTimestamp(ts: string): number {
    const asNum = Number(ts);
    // If it's a Unix epoch in milliseconds
    if (!isNaN(asNum) && asNum > 1e12) return asNum;
    // If it's a Unix epoch in seconds
    if (!isNaN(asNum) && asNum > 1e9) return asNum * 1000;
    // Try ISO 8601
    const parsed = Date.parse(ts);
    if (!isNaN(parsed)) return parsed;
    throw new UnauthorizedException('Invalid X-Timestamp format');
  }

  private buildCanonicalString(
    request: any,
    timestamp: string,
    nonce: string,
  ): string {
    const method = request.method.toUpperCase();
    const path = request.originalUrl || request.url;
    // Canonical: METHOD\nPATH\nTIMESTAMP\nNONCE\nBODY_HASH
    const bodyHash = request.body
      ? crypto
          .createHash('sha256')
          .update(JSON.stringify(request.body))
          .digest('hex')
      : crypto.createHash('sha256').update('').digest('hex');
    return `${method}\n${path}\n${timestamp}\n${nonce}\n${bodyHash}`;
  }

  private resolveApiSecret(request: any): string | null {
    // Priority 1: From authenticated API key context
    if (request.user?.apiSecret) return request.user.apiSecret;
    // Priority 2: From header (for webhook verification)
    const headerSecret = request.headers['x-api-secret'] as string;
    if (headerSecret) return headerSecret;
    // Priority 3: Platform-level signing key from environment
    return process.env.API_SIGNING_SECRET || null;
  }

  private async checkNonce(nonce: string): Promise<boolean> {
    const redis = this.redisManager.getClient();
    if (redis) {
      const key = `nonce:${nonce}`;
      const exists = await redis.exists(key);
      return exists === 1;
    }
    // Memory fallback
    const expiry = this.nonceCache.get(nonce);
    if (expiry && expiry > Date.now()) return true;
    return false;
  }

  private async storeNonce(nonce: string): Promise<void> {
    const redis = this.redisManager.getClient();
    if (redis) {
      await redis.set(`nonce:${nonce}`, '1', 'EX', NONCE_TTL_SECONDS);
    } else {
      this.nonceCache.set(nonce, Date.now() + NONCE_TTL_SECONDS * 1000);
      // Clean up old nonces periodically
      if (this.nonceCache.size > 10000) {
        const now = Date.now();
        for (const [key, exp] of this.nonceCache) {
          if (exp < now) this.nonceCache.delete(key);
        }
      }
    }
  }
}
