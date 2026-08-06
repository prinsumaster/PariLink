import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

// ---------------------------------------------------------------------------
// Global Exception Filter — Enterprise Hardened
//
// Security controls:
//   1. Stack traces never reach the client in production
//   2. Prisma errors mapped to user-safe messages (no SQL leak)
//   3. Validation errors returned as structured array
//   4. Correlation ID attached to every error response
//   5. 5xx errors logged with full context for SIEM/alerting
//   6. Prisma unique constraint → 409 Conflict (not 500)
//   7. Prisma not-found → 404 Not Found (not 500)
// ---------------------------------------------------------------------------

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId: string =
      (request as any)['correlationId'] ??
      request.headers['x-correlation-id'] ??
      'no-correlation-id';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      'An unexpected error occurred. Please try again later.';
    let errorCode = 'INTERNAL_ERROR';

    // ── HTTP Exceptions (including NestJS validation errors)
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const body = exceptionResponse as any;
        message = body.message ?? body.error ?? 'Request failed';
        errorCode = body.errorCode ?? this.statusToCode(statusCode);

        if (statusCode === 400 && Array.isArray(body.message)) {
          this.logger.error(`Validation Error: ${body.message.join(', ')}`);
        } else if (statusCode === 400) {
          this.logger.error(`Bad Request Error: ${JSON.stringify(body)}`);
        }
      }
    }
    // ── Prisma Known Request Errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = this.mapPrismaError(exception);
      statusCode = mapped.statusCode;
      message = mapped.message;
      errorCode = mapped.errorCode;
    }
    // ── Prisma Validation Errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided. Please check your request.';
      errorCode = 'VALIDATION_ERROR';
    }
    // ── Unknown errors
    else {
      // Log full error internally for 5xx events
      this.logger.error(
        `[${correlationId}] Unhandled exception: ${(exception as any)?.message ?? exception}`,
        IS_PRODUCTION ? undefined : (exception as any)?.stack,
      );
    }

    // Set correlation ID header so clients can reference it in support
    response.setHeader('X-Correlation-Id', correlationId);

    response.status(statusCode).json({
      success: false,
      statusCode,
      errorCode,
      correlationId,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      // Stack trace only in non-production environments
      ...(!IS_PRODUCTION && exception instanceof Error
        ? { debug: { stack: exception.stack?.split('\n').slice(0, 5) } }
        : {}),
    });
  }

  private mapPrismaError(error: Prisma.PrismaClientKnownRequestError): {
    statusCode: number;
    message: string;
    errorCode: string;
  } {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with this value already exists.',
          errorCode: 'DUPLICATE_RECORD',
        };
      case 'P2025': // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'The requested record was not found.',
          errorCode: 'NOT_FOUND',
        };
      case 'P2003': // Foreign key constraint
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'A referenced record does not exist.',
          errorCode: 'FOREIGN_KEY_VIOLATION',
        };
      case 'P2014': // Relation violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'This record is in use and cannot be modified in this way.',
          errorCode: 'RELATION_VIOLATION',
        };
      default:
        this.logger.error(
          `Unmapped Prisma error P${error.code}: ${error.message}`,
        );
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'A database error occurred.',
          errorCode: 'DATABASE_ERROR',
        };
    }
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'RATE_LIMIT_EXCEEDED',
      503: 'SERVICE_UNAVAILABLE',
    };
    return map[status] ?? 'HTTP_ERROR';
  }
}
