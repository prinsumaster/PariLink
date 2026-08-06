/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type MemoryScope =
  'CONVERSATION' | 'WORKSPACE' | 'ORGANIZATION' | 'USER';

export interface MemoryEntry {
  key: string;
  value: any;
  scope: MemoryScope;
  scopeId: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store with TTL (production: use Redis)
interface StoredEntry {
  value: any;
  scope: MemoryScope;
  scopeId: string;
  expiresAt?: number; // Unix timestamp
  createdAt: Date;
  updatedAt: Date;
}

const memoryStore = new Map<string, StoredEntry>();

@Injectable()
export class EnterpriseMemoryService {
  private readonly logger = new Logger(EnterpriseMemoryService.name);

  // Default TTLs per scope (ms)
  private static readonly DEFAULT_TTL: Record<MemoryScope, number> = {
    CONVERSATION: 2 * 60 * 60 * 1000, // 2 hours
    USER: 7 * 24 * 60 * 60 * 1000, // 7 days
    WORKSPACE: 30 * 24 * 60 * 60 * 1000, // 30 days
    ORGANIZATION: 365 * 24 * 60 * 60 * 1000, // 1 year
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Write a memory entry to the specified scope
   */
  async setMemory(
    scope: MemoryScope,
    scopeId: string,
    key: string,
    value: any,
    ttlMs?: number,
  ): Promise<void> {
    const storeKey = `${scope}:${scopeId}:${key}`;
    const effectiveTtl = ttlMs ?? EnterpriseMemoryService.DEFAULT_TTL[scope];
    const expiresAt = effectiveTtl > 0 ? Date.now() + effectiveTtl : undefined;

    const existing = memoryStore.get(storeKey);
    memoryStore.set(storeKey, {
      value,
      scope,
      scopeId,
      expiresAt,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    });

    this.logger.debug(`Memory set: [${scope}:${scopeId}] ${key}`);
  }

  /**
   * Read a memory entry — returns null if expired or not found
   */
  async getMemory(
    scope: MemoryScope,
    scopeId: string,
    key: string,
  ): Promise<any | null> {
    const storeKey = `${scope}:${scopeId}:${key}`;
    const entry = memoryStore.get(storeKey);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      memoryStore.delete(storeKey);
      return null;
    }

    return entry.value;
  }

  /**
   * Get all memory entries for a given scope
   */
  async getScopeMemory(
    scope: MemoryScope,
    scopeId: string,
  ): Promise<Record<string, any>> {
    const prefix = `${scope}:${scopeId}:`;
    const result: Record<string, any> = {};

    for (const [key, entry] of memoryStore.entries()) {
      if (key.startsWith(prefix)) {
        if (!entry.expiresAt || Date.now() <= entry.expiresAt) {
          const memKey = key.slice(prefix.length);
          result[memKey] = entry.value;
        }
      }
    }

    return result;
  }

  /**
   * Get recent conversation memory as a string context block
   */
  async getConversationContext(sessionId: string): Promise<string> {
    try {
      const messages = await this.prisma.runAsSystem(async (tx) =>
        tx.aiChatMessage.findMany({
          where: { sessionId },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 messages
        }),
      );

      if (messages.length === 0) return '';

      const formatted = messages
        .reverse()
        .map(
          (m) =>
            `${m.role === 'USER' ? 'User' : 'Assistant'}: ${m.content.substring(0, 200)}`,
        )
        .join('\n');

      return `\n\n--- Previous Conversation ---\n${formatted}\n--- End of History ---`;
    } catch {
      return '';
    }
  }

  /**
   * Get workspace preferences and institutional memory
   */
  async getWorkspaceContext(companyId: string): Promise<string> {
    const prefs = await this.getScopeMemory('WORKSPACE', companyId);
    if (Object.keys(prefs).length === 0) return '';

    const lines = Object.entries(prefs)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n');
    return `\n\n--- Workspace Memory ---\n${lines}\n--- End Memory ---`;
  }

  /**
   * Store a user preference
   */
  async setUserPreference(
    userId: string,
    preference: string,
    value: any,
  ): Promise<void> {
    await this.setMemory('USER', userId, `pref:${preference}`, value);
  }

  /**
   * Get a user preference
   */
  async getUserPreference(userId: string, preference: string): Promise<any> {
    return this.getMemory('USER', userId, `pref:${preference}`);
  }

  /**
   * Delete a specific memory entry
   */
  async deleteMemory(
    scope: MemoryScope,
    scopeId: string,
    key: string,
  ): Promise<void> {
    const storeKey = `${scope}:${scopeId}:${key}`;
    memoryStore.delete(storeKey);
  }

  /**
   * Purge all expired memory entries (should be called periodically)
   */
  async clearExpiredMemory(): Promise<number> {
    const now = Date.now();
    let cleared = 0;

    for (const [key, entry] of memoryStore.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        memoryStore.delete(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      this.logger.log(`Cleared ${cleared} expired memory entries`);
    }
    return cleared;
  }

  /**
   * Get memory statistics for observability
   */
  getMemoryStats(): Record<MemoryScope, number> {
    const stats: Record<MemoryScope, number> = {
      CONVERSATION: 0,
      USER: 0,
      WORKSPACE: 0,
      ORGANIZATION: 0,
    };

    for (const entry of memoryStore.values()) {
      if (!entry.expiresAt || Date.now() <= entry.expiresAt) {
        stats[entry.scope]++;
      }
    }

    return stats;
  }
}
