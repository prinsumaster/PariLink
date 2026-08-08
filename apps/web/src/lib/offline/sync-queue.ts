import { getDB, SyncMutation } from './db';
import { api } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

export class SyncQueue {
  static async addMutation(mutation: Omit<SyncMutation, 'id' | 'createdAt' | 'retryCount' | 'status'>) {
    const db = await getDB();
    if (!db) return;

    const fullMutation: SyncMutation = {
      ...mutation,
      id: uuidv4(),
      createdAt: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    await db.put('sync_queue', fullMutation);
    
    // Attempt sync immediately if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.processQueue();
    } else {
      // Register background sync if supported
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const swRegistration = await navigator.serviceWorker.ready;
          await (swRegistration as any).sync.register('sync-mutations');
        } catch (error) {
          console.error('Background sync could not be registered', error);
        }
      }
    }
  }

  static async processQueue() {
    const db = await getDB();
    if (!db) return;

    // Get all pending or failed (with retry < 3) mutations
    const allMutations = await db.getAllFromIndex('sync_queue', 'by-created-at');
    const toProcess = allMutations.filter(m => m.status === 'pending' || (m.status === 'failed' && m.retryCount < 3));

    if (toProcess.length === 0) return;

    for (const mutation of toProcess) {
      mutation.status = 'processing';
      await db.put('sync_queue', mutation);

      try {
        await api.request({
          url: mutation.url,
          method: mutation.method,
          data: mutation.body,
          headers: {
            ...mutation.headers,
            'X-Offline-Sync': 'true',
            'X-Mutation-Timestamp': mutation.createdAt.toString(),
          }
        });

        // Success, remove from queue
        await db.delete('sync_queue', mutation.id);
      } catch (error: any) {
        mutation.status = 'failed';
        mutation.retryCount += 1;
        mutation.lastError = error?.message || 'Unknown error';
        await db.put('sync_queue', mutation);
      }
    }
  }
}

// Global listener for online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    SyncQueue.processQueue();
  });
}
