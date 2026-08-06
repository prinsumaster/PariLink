import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PlatformEvent } from '../events/event.service';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  // Single global subject for all internal events.
  // In a multi-instance production environment, this would be backed by Redis Pub/Sub.
  private globalEventSubject = new Subject<{
    eventName: string;
    payload: PlatformEvent;
  }>();

  // Subscribe to ALL events fired by the application's EventEmitter
  @OnEvent('**')
  handleAllEvents(payload: any) {
    // The EventEmitter2 passes the event payload directly, but we don't necessarily get the event name here
    // unless we use the event context. NestJS @OnEvent doesn't inject the name into the args.
    // However, to keep it simple, if it's a PlatformEvent we just broadcast it.

    // Safety check - we only broadcast events that have a tenantId to avoid leaking system events
    if (payload && payload.tenantId) {
      this.globalEventSubject.next({
        // Extract type from payload if it exists, otherwise default
        eventName: payload.type || 'SYSTEM_EVENT',
        payload: payload as PlatformEvent,
      });
    }
  }

  // Allow a client to subscribe to events for their specific company
  subscribeToCompanyEvents(tenantId: string): Observable<{ data: any }> {
    this.logger.log(
      `Client subscribed to real-time events for tenant: ${tenantId}`,
    );

    return this.globalEventSubject.asObservable().pipe(
      // 1. Filter events so users only see their own company's data
      filter((event) => event.payload.tenantId === tenantId),
      // 2. Map to the SSE format required by NestJS (MessageEvent)
      map((event) => {
        // Map backend event structure to the frontend's expected RealtimeEvent structure
        const sseData = {
          id: event.payload.correlationId || `evt-${Date.now()}`,
          type: this.mapEventNameToFrontendType(event.eventName),
          payload: event.payload.payload, // The actual data
          timestamp: event.payload.timestamp || new Date().toISOString(),
        };

        return { data: sseData };
      }),
    );
  }

  private mapEventNameToFrontendType(eventName: string): string {
    if (eventName.includes('AiAlert') || eventName.includes('Anomaly')) {
      return 'AI_ALERT';
    }
    if (eventName.includes('Location') || eventName.includes('Telemetry')) {
      return 'TELEMETRY_UPDATED';
    }
    if (eventName.includes('Created') || eventName.includes('Updated')) {
      return 'ENTITY_UPDATED';
    }
    return 'SYSTEM_NOTIFICATION';
  }
}
