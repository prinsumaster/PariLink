'use client';

import { useEffect, useRef } from 'react';
import { useWorkspaceKernelStore } from '@/store/workspace-kernel';
import { useActivityStore } from '@/store/activity';
// We would import other entity stores here (useLoadStore, useDriverStore)

export interface RealtimeEvent {
  id: string;
  type: 'AI_ALERT' | 'ENTITY_UPDATED' | 'TELEMETRY_UPDATED' | 'SYSTEM_NOTIFICATION';
  payload: any;
  timestamp: string;
}

export function useRealtimeEngine() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This connects to the future NestJS SSE endpoint
    function connect() {
      if (eventSourceRef.current) return;

      // Realtime connection logic goes here when enabled
      // MOCK URL for now
      const es = new EventSource('/api/v1/realtime/stream', { withCredentials: true });
      eventSourceRef.current = es;

      es.onopen = () => {
        // Connected
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as RealtimeEvent;
          handleRealtimeEvent(data);
        } catch (e) {
          console.error('[RealtimeEngine] Failed to parse event', e);
        }
      };

      es.onerror = (err) => {
        console.error('[RealtimeEngine] Connection lost. Reconnecting...', err);
        es.close();
        eventSourceRef.current = null;
        
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    }

    // Uncomment to enable actual connection when backend is ready
    // connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);
}

function handleRealtimeEvent(event: RealtimeEvent) {
  // 1. Dispatch to specific Zustand stores
  
  // Every event also gets sent to the Activity Center timeline
  useActivityStore.getState().addActivity(event);

  switch (event.type) {
    case 'AI_ALERT':
      // Additional specific handling
      break;
    
    case 'ENTITY_UPDATED':
      // If a load is updated, push directly to store bypassing React render cycle
      // e.g., useLoadStore.getState().upsertLoad(event.payload);
      break;
      
    case 'TELEMETRY_UPDATED':
      // Update LiveFleetMap coordinates
      break;
  }
}
