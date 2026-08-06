import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import Redis from 'ioredis';

import { RedisManagerService } from '../redis/redis-manager.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly redis: Redis;
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(private readonly redisManager: RedisManagerService) {
    this.redis = this.redisManager.getClient();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Only apply idempotency to mutating endpoints (POST, PUT, PATCH, DELETE)
    if (request.method === 'GET' || request.method === 'OPTIONS') {
      return next.handle();
    }

    const idempotencyKey = request.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      // For global safety, we could enforce it, but to prevent breaking all existing clients, we make it optional but recommended.
      // However, if it IS provided, we strictly enforce it.
      return next.handle();
    }

    const cacheKey = `idempotency:${request.user?.companyId || 'global'}:${request.method}:${request.path}:${idempotencyKey}`;

    try {
      const cachedResponseStr = await this.redis.get(cacheKey);

      if (cachedResponseStr) {
        if (cachedResponseStr === 'IN_PROGRESS') {
          throw new HttpException(
            'Request is already being processed.',
            HttpStatus.CONFLICT,
          );
        }

        const cachedResponse = JSON.parse(cachedResponseStr);
        this.logger.log(
          `[Idempotency] Serving cached response for key: ${idempotencyKey}`,
        );

        // Ensure we send back the original status code
        response.status(cachedResponse.statusCode || HttpStatus.OK);
        return of(cachedResponse.data);
      }

      // Mark as in-progress (TTL 30s to match timeout interceptor)
      await this.redis.set(cacheKey, 'IN_PROGRESS', 'EX', 30);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error('Redis error in IdempotencyInterceptor', err);
      // Proceed gracefully if Redis fails
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (data) => {
        try {
          const responseToCache = {
            statusCode: response.statusCode,
            data,
          };
          // Cache successful response for 24 hours
          await this.redis.set(
            cacheKey,
            JSON.stringify(responseToCache),
            'EX',
            86400,
          );
        } catch (err) {
          this.logger.error('Failed to cache idempotent response', err);
        }
      }),
      catchError(async (err) => {
        try {
          // If the request fails (e.g. validation error, 500), remove the IN_PROGRESS lock
          // so the client can retry safely.
          await this.redis.del(cacheKey);
        } catch (redisErr) {
          this.logger.error(
            'Failed to clear idempotency lock on error',
            redisErr,
          );
        }
        throw err; // rethrow the original error
      }),
    );
  }
}
