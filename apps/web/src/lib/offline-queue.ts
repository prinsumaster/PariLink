import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PariLinkDB extends DBSchema {
  offlineQueue: {
    key: string;
    value: {
      id: string;
      url: string;
      method: string;
      headers: Record<string, string>;
      body: any;
      timestamp: number;
      type: 'gps' | 'pod' | 'draft' | 'general';
    };
    indexes: { 'by-timestamp': number };
  };
}

let dbPromise: Promise<IDBPDatabase<PariLinkDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<PariLinkDB>('parilink-offline-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('offlineQueue', {
        keyPath: 'id',
      });
      store.createIndex('by-timestamp', 'timestamp');
    },
  });
}

export async function addToQueue(
  url: string,
  method: string,
  body: any,
  type: 'gps' | 'pod' | 'draft' | 'general' = 'general'
) {
  if (!dbPromise) return;
  const db = await dbPromise;
  
  const id = crypto.randomUUID();
  await db.add('offlineQueue', {
    id,
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    timestamp: Date.now(),
    type,
  });

  // Attempt to trigger a background sync if Service Worker supports it
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-offline-queue');
    } catch (err) {
      console.error('Background sync registration failed:', err);
    }
  }
}

export async function processQueue() {
  if (!dbPromise) return;
  const db = await dbPromise;
  
  const tx = db.transaction('offlineQueue', 'readwrite');
  const store = tx.objectStore('offlineQueue');
  const items = await store.getAll();

  if (items.length === 0) return;

  for (const item of items) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: JSON.stringify(item.body),
      });

      if (res.ok) {
        await store.delete(item.id);
      }
    } catch (error) {
      console.error(`Failed to process queued item ${item.id}`, error);
    }
  }
}
