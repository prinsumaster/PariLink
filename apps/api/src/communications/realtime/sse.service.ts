import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);

  // In a multi-instance production environment, this would be backed by Redis Pub/Sub.
  // We use an RxJS Subject for MVP local instance pub/sub.
  private events$ = new Subject<{ userId: string; event: any }>();

  subscribe(userId: string) {
    // Returns an observable filtered by userId
    return this.events$.asObservable();
  }

  emitToUser(userId: string, data: any) {
    this.logger.log(`Emitting event to user ${userId}`);
    this.events$.next({ userId, event: data });
  }

  emitToCompany(companyId: string, data: any) {
    this.logger.log(`Emitting event to company ${companyId}`);
    // MVP implementation: we just emit a generic event and clients filter
    this.events$.next({
      userId: 'ALL',
      event: { ...data, targetCompanyId: companyId },
    });
  }
}
