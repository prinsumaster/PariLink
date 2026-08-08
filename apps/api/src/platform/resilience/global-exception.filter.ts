import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EventStoreService } from '../digital-twin/event-store.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly eventStore: EventStoreService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred in PariLink Enterprise OS.';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message = exceptionResponse?.message || exception.message;
      errorCode = exceptionResponse?.error || 'HTTP_EXCEPTION';
    } else if ((exception as any)?.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'A resource with this unique identifier already exists.';
      errorCode = 'DUPLICATE_RESOURCE';
    } else if (exception instanceof Error) {
      status = (exception as any).status || (exception as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    const errorPayload = {
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId: request.headers['x-correlation-id'] || 'N/A',
    };

    // Log the error securely (observability + security audit)
    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${message}`,
      (exception as Error)?.stack,
    );

    // Persist critical exceptions to the EventStore for audit trails
    if (status >= 500 || status === 403 || status === 401) {
      try {
        await this.eventStore.append({
          tenantId: 'SYSTEM',
          streamId: (request.headers['x-correlation-id'] as string) || 'system',
          streamType: 'SYSTEM_EXCEPTION',
          eventType: `HTTP_${status}_ERROR`,
          payload: errorPayload,
          userId: (request as any).user?.id || 'SYSTEM',
        });
      } catch (e) {
        this.logger.error('Failed to append exception to EventStore', e);
      }
    }

    // Mask internal 500 errors to prevent information leakage to the frontend
    if (status >= 500 && process.env.NODE_ENV === 'production') {
      errorPayload.message =
        'An internal system error occurred. Our operations team has been notified.';
    }

    response.status(status).json(errorPayload);
  }
}
