/**
 * Jest-only helper: an in-memory SQLite handle that matches the async API
 * surface of expo-sqlite's `SQLiteDatabase`, backed by Node's built-in
 * `node:sqlite`. Used because expo-sqlite's native module is unavailable in
 * Jest's Node.js environment.
 *
 * Do NOT import this file from production code.
 */
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

export function createTestDatabase(): SQLiteDatabase {
  const db = new DatabaseSync(':memory:');

  const adapter = {
    async execAsync(source: string): Promise<void> {
      db.exec(source);
    },

    async runAsync(
      source: string,
      ...params: unknown[]
    ): Promise<{ changes: number; lastInsertRowId: number }> {
      const result = db.prepare(source).run(...(params as SQLInputValue[]));
      return {
        changes: Number(result.changes),
        lastInsertRowId: Number(result.lastInsertRowid),
      };
    },

    async getAllAsync<T>(source: string, ...params: unknown[]): Promise<T[]> {
      return db.prepare(source).all(...(params as SQLInputValue[])) as T[];
    },

    async getFirstAsync<T>(
      source: string,
      ...params: unknown[]
    ): Promise<T | null> {
      const row = db.prepare(source).get(...(params as SQLInputValue[]));
      return (row as T | undefined) ?? null;
    },

    async withTransactionAsync(task: () => Promise<void>): Promise<void> {
      db.exec('BEGIN');
      try {
        await task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },

    async closeAsync(): Promise<void> {
      db.close();
    },
  };

  return adapter as unknown as SQLiteDatabase;
}
