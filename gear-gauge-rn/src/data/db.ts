import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_NAME = 'geargauge.db';

// ── Migrations ──────────────────────────────────────────────────────────────

/**
 * Ordered migration list. Index `i` migrates the schema from version `i` → `i+1`.
 * `PRAGMA user_version` (set after each migration) tracks how far we've come,
 * so existing installs only run the migrations they are missing.
 */
const MIGRATIONS: string[] = [
  // v1 — gear
  `
  CREATE TABLE IF NOT EXISTS gear (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    initial_distance REAL NOT NULL,
    max_distance REAL NOT NULL,
    notes TEXT,
    is_primary INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    start_date TEXT NOT NULL,
    end_date TEXT,
    workout_type_ids TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_deleted INTEGER NOT NULL DEFAULT 0
  );
  `,
  // v2 — workouts + the many-to-many workout↔gear join table.
  // Mirrors SwiftData's `@Relationship(deleteRule: .nullify)` linking table.
  `
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY NOT NULL,
    source TEXT NOT NULL,
    health_kit_uuid TEXT,
    activity_type TEXT,
    workout_type TEXT NOT NULL,
    total_distance REAL NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    is_indoor INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_deleted INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS workout_gear (
    workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    gear_id TEXT NOT NULL REFERENCES gear(id) ON DELETE CASCADE,
    PRIMARY KEY (workout_id, gear_id)
  );
  CREATE INDEX IF NOT EXISTS idx_workout_gear_gear ON workout_gear(gear_id);
  `,
];

/**
 * Apply any pending migrations. Exported so tests can build an identical
 * in-memory (`:memory:`) database.
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // FK enforcement is off by default in SQLite — required for ON DELETE CASCADE.
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  const currentVersion = row?.user_version ?? 0;

  for (let v = currentVersion; v < MIGRATIONS.length; v += 1) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[v]);
      await db.execAsync(`PRAGMA user_version = ${v + 1}`);
    });
  }
}

// ── Lazy singleton handle ────────────────────────────────────────────────────

let dbPromise: Promise<SQLiteDatabase> | null = null;

/** Open (once) and migrate the app database. */
export function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await runMigrations(db);
      return db;
    });
  }
  return dbPromise;
}
