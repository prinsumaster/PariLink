import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/auth';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export function useWebSocket(url: string, onMessage?: (msg: WebSocketMessage) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onMessageRef = useRef(onMessage);

  // Keep ref up to date to avoid stale closures without triggering re-connects
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
  const ws = useRef<WebSocket | null>(null);
  const { token, tenantId } = useAuthStore();
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectCount = useRef(0);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      // Append token and tenant to URL for Auth
      const wsUrl = new URL(url);
      wsUrl.searchParams.append('token', token);
      if (tenantId) {
        wsUrl.searchParams.append('tenantId', tenantId);
      }

      ws.current = new WebSocket(wsUrl.toString());

      ws.current.onopen = () => {
        setIsConnected(true);
        reconnectCount.current = 0; // Reset counter on successful connection
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessageRef.current) {
            // Bypass React state and re-render if callback provided
            onMessageRef.current(data);
          } else {
            // Fallback to React state
            setLastMessage(data);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      ws.current.onclose = () => {
        if (!isMounted.current) return;
        setIsConnected(false);
        
        // Exponential backoff with jitter (max 30 seconds)
        reconnectCount.current += 1;
        const baseDelay = Math.min(1000 * Math.pow(2, reconnectCount.current), 30000);
        const jitter = Math.random() * 1000;
        const nextReconnectDelay = baseDelay + jitter;
        
        reconnectTimeout.current = setTimeout(() => {
          console.log(`Attempting to reconnect WebSocket... (Attempt ${reconnectCount.current})`);
          connect();
        }, nextReconnectDelay);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket Error', error);
        ws.current?.close(); // Force trigger onclose for reconnect
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, token, tenantId]);

  return { isConnected, lastMessage };
}
