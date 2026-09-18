'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useCommandSocket(token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [kpis, setKpis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Use absolute URL if necessary or fallback to window.location
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';
    
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Command Center Gateway');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from Command Center Gateway');
    });

    socket.on('kpi.updated', (payload: any) => {
      setKpis((prev: any) => ({ ...prev, ...payload }));
    });

    socket.on('dispatch.recommendation', (payload: any) => {
      setRecommendations(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return {
    isConnected,
    kpis,
    recommendations,
    socket: socketRef.current,
  };
}
