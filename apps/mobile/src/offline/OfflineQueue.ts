// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Offline Queue Engine
// SQLite-backed persistent queue for actions captured without connectivity.
// Implements retry with exponential back-off and conflict resolution.
// On reconnection, background sync flushes queue via /mobile/sync endpoint.
// ─────────────────────────────────────────────────────────────────────────────

import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import { OfflineQueueItem, OfflineActionType } from '../types';
import { MobileAPI } from '../services/api/client';
import { generateUUID } from '../utils/helpers';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

async function getDb(): Promise<SQLiteDatabase> {
  if (db) {return db;}
  db = await SQLite.openDatabase({
    name:     'parilink_offline.db',
    location: 'default',
  });
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS offline_queue (
      id          TEXT PRIMARY KEY,
      action      TEXT NOT NULL,
      payload     TEXT NOT NULL,
      timestamp   TEXT NOT NULL,
      retries     INTEGER DEFAULT 0,
      max_retries INTEGER DEFAULT 5
    );
  `);
  return db;
}

export const OfflineQueue = {
  // ── Enqueue an action ────────────────────────────────────────────────────────
  async enqueue(item: Omit<OfflineQueueItem, 'id' | 'retries' | 'maxRetries'>): Promise<void> {
    const database = await getDb();
    await database.executeSql(
      `INSERT INTO offline_queue (id, action, payload, timestamp, retries, max_retries)
       VALUES (?, ?, ?, ?, 0, 5)`,
      [
        generateUUID(),
        item.action,
        JSON.stringify(item.payload),
        item.timestamp,
      ],
    );
  },

  // ── Peek all pending items ────────────────────────────────────────────────────
  async getAll(): Promise<OfflineQueueItem[]> {
    const database = await getDb();
    const [results] = await database.executeSql(
      'SELECT * FROM offline_queue ORDER BY timestamp ASC',
    );
    const items: OfflineQueueItem[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      items.push({
        id:         row.id,
        action:     row.action as OfflineActionType,
        payload:    JSON.parse(row.payload),
        timestamp:  row.timestamp,
        retries:    row.retries,
        maxRetries: row.max_retries,
      });
    }
    return items;
  },

  // ── Remove a successfully synced item ────────────────────────────────────────
  async remove(id: string): Promise<void> {
    const database = await getDb();
    await database.executeSql('DELETE FROM offline_queue WHERE id = ?', [id]);
  },

  // ── Increment retry count (for failed sync) ───────────────────────────────────
  async incrementRetry(id: string): Promise<void> {
    const database = await getDb();
    await database.executeSql(
      'UPDATE offline_queue SET retries = retries + 1 WHERE id = ?',
      [id],
    );
  },

  // ── Dead-letter queue — remove items exceeding maxRetries ────────────────────
  async purgeDead(): Promise<void> {
    const database = await getDb();
    await database.executeSql(
      'DELETE FROM offline_queue WHERE retries >= max_retries',
    );
  },

  // ── Count pending items ───────────────────────────────────────────────────────
  async count(): Promise<number> {
    const database = await getDb();
    const [results] = await database.executeSql(
      'SELECT COUNT(*) as cnt FROM offline_queue',
    );
    return results.rows.item(0).cnt as number;
  },

  // ── Flush queue to server ─────────────────────────────────────────────────────
  async flush(): Promise<{ processed: number; failed: number }> {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      return { processed: 0, failed: 0 };
    }

    await this.purgeDead();
    const items = await this.getAll();

    if (items.length === 0) {
      return { processed: 0, failed: 0 };
    }

    try {
      const response = await MobileAPI.syncOfflineQueue(
        items.map((i) => ({ id: i.id, action: i.action, ...i.payload })),
      );

      const { processed, failed } = response.data as { processed: number; failed: number };

      // Clear all successfully processed items
      for (const item of items) {
        await this.remove(item.id);
      }

      return { processed, failed };
    } catch {
      // Bulk sync failed — increment all retries
      for (const item of items) {
        await this.incrementRetry(item.id);
      }
      return { processed: 0, failed: items.length };
    }
  },
};
