import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface SyncMutation {
  id: string; // uuid
  url: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body: any;
  headers?: Record<string, string>;
  createdAt: number;
  retryCount: number;
  status: 'pending' | 'processing' | 'failed';
  lastError?: string;
}

interface PariLinkDB extends DBSchema {
  sync_queue: {
    key: string;
    value: SyncMutation;
    indexes: { 'by-status': string; 'by-created-at': number };
  };
  cache_data: {
    key: string; // e.g., endpoint url
    value: {
      data: any;
      updatedAt: number;
      ttl: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PariLinkDB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<PariLinkDB>('parilink-offline-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sync_queue')) {
          const store = db.createObjectStore('sync_queue', { keyPath: 'id' });
          store.createIndex('by-status', 'status');
          store.createIndex('by-created-at', 'createdAt');
        }
        if (!db.objectStoreNames.contains('cache_data')) {
          db.createObjectStore('cache_data', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
};
