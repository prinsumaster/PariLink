"use client";

import React, { useEffect, useState, createContext, useContext } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useAuthStore } from '@/store/auth';

interface CollaborationContextType {
  doc: Y.Doc | null;
  provider: WebsocketProvider | null;
  awareness: any;
  users: any[];
}

const CollaborationContext = createContext<CollaborationContextType>({
  doc: null,
  provider: null,
  awareness: null,
  users: [],
});

export function YjsProvider({
  roomName,
  children,
}: {
  roomName: string;
  children: React.ReactNode;
}) {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const wsUrl = process.env.NEXT_PUBLIC_YJS_URL || 'wss://api.parilink.app/collaboration';
    const wsProvider = new WebsocketProvider(wsUrl, roomName, ydoc);

    wsProvider.awareness.setLocalStateField('user', {
      name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Anonymous',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      avatar: user?.email,
    });

    wsProvider.awareness.on('change', () => {
      const states = Array.from(wsProvider.awareness.getStates().values());
      setUsers(states.map((state: any) => state.user).filter(Boolean));
    });

    setDoc(ydoc);
    setProvider(wsProvider);

    return () => {
      wsProvider.disconnect();
      ydoc.destroy();
    };
  }, [roomName, user]);

  return (
    <CollaborationContext.Provider value={{ doc, provider, awareness: provider?.awareness, users }}>
      {children}
    </CollaborationContext.Provider>
  );
}

export const useCollaboration = () => useContext(CollaborationContext);
