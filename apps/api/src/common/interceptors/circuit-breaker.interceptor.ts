import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const DEFAULT_FAILURE_THRESHOLD = 5;
const DEFAULT_RESET_TIMEOUT = 30000; // 30 seconds

interface CircuitState {
  failures: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  nextAttempt: number;
}

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private circuits = new Map<string, CircuitState>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const routeKey = `${request.method}:${request.route?.path || request.url}`;

    let circuit = this.circuits.get(routeKey);
    if (!circuit) {
      circuit = { failures: 0, state: 'CLOSED', nextAttempt: 0 };
      this.circuits.set(routeKey, circuit);
    }

    if (circuit.state === 'OPEN') {
      if (Date.now() > circuit.nextAttempt) {
        circuit.state = 'HALF_OPEN';
      } else {
        return throwError(
          () =>
            new ServiceUnavailableException(
              'Service is temporarily unavailable (Circuit Open)',
            ),
        );
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Success: Reset circuit
        if (circuit.state === 'HALF_OPEN' || circuit.failures > 0) {
          circuit.failures = 0;
          circuit.state = 'CLOSED';
        }
      }),
      catchError((err) => {
        // Only increment failures for 5xx errors or network issues
        const status = err.getStatus ? err.getStatus() : 500;
        if (status >= 500) {
          if (circuit.state === 'HALF_OPEN') {
            circuit.state = 'OPEN';
            circuit.nextAttempt = Date.now() + DEFAULT_RESET_TIMEOUT;
          } else {
            circuit.failures += 1;
            if (circuit.failures >= DEFAULT_FAILURE_THRESHOLD) {
              circuit.state = 'OPEN';
              circuit.nextAttempt = Date.now() + DEFAULT_RESET_TIMEOUT;
            }
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
