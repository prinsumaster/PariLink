import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { queryMonitorStorage } from '../query-monitor.storage';

@Injectable()
export class QueryMonitorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('QueryMonitor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const store = { count: 0 };
    
    return queryMonitorStorage.run(store, () => {
      const request = context.switchToHttp().getRequest();
      const method = request.method;
      const url = request.url;

      return next.handle().pipe(
        tap(() => {
          if (store.count > 3) {
            this.logger.error(
              `[N+1 WARNING] ${method} ${url} triggered ${store.count} queries!`,
            );
          } else {
            this.logger.log(
              `[PERFORMANCE] ${method} ${url} completed in ${store.count} queries.`,
            );
          }
        }),
      );
    });
  }
}
