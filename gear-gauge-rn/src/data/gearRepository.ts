import type { SQLiteDatabase, SQLiteBindValue } from 'expo-sqlite';
import type { Gear } from '@/models/Gear';
import type { GearType } from '@/models/GearType';
import type { WorkoutType } from '@/models/WorkoutType';

/** Public data-access surface for gear. Implementations persist to SQLite. */
export interface GearRepository {
  /** Fetch all non-deleted gear, with `currentDistance` populated. */
  fetchAll(): Promise<Gear[]>;
  /** Fetch only active, non-deleted gear. */
  fetchActive(): Promise<Gear[]>;
  /** Fetch the primary gear, or `null` if none. */
  fetchPrimary(): Promise<Gear | null>;
  /** Insert a new gear item. */
  create(gear: Gear): Promise<void>;
  /** Update an existing gear item, bumping `version` + `updatedAt`. */
  update(gear: Gear): Promise<void>;
  /** Soft-delete a gear item, bumping `version` + `updatedAt`. */
  delete(id: string): Promise<void>;
}

/**
 * Raw row shape returned by SQLite. Column names are snake_case; booleans are
 * stored as 0/1 integers; `workout_distance` is the aggregate from the
 * `LEFT JOIN ... SUM()` used when reading.
 */
export interface GearRow {
  id: string;
  name: string;
  type: string;
  initial_distance: number;
  max_distance: number;
  notes: string | null;
  is_primary: number;
  is_active: number;
  start_date: string;
  end_date: string | null;
  workout_type_ids: string;
  created_at: string;
  updated_at: string;
  version: number;
  is_deleted: number;
  workout_distance?: number | null;
}

/** Convert a SQLite row into the public `Gear` model. */
export function mapRowToGear(row: GearRow): Gear {
  return {
    id: row.id,
    name: row.name,
    type: row.type as GearType,
    initialDistance: row.initial_distance,
    maxDistance: row.max_distance,
    notes: row.notes ?? undefined,
    isPrimary: row.is_primary === 1,
    isActive: row.is_active === 1,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    workoutTypeIds: JSON.parse(row.workout_type_ids) as WorkoutType[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
    isDeleted: row.is_deleted === 1,
    currentDistance: row.initial_distance + (row.workout_distance ?? 0),
  };
}

/** Values for the `gear` table's 15 INSERT columns, in column order. */
function gearToInsertParams(gear: Gear): SQLiteBindValue[] {
  return [
    gear.id,
    gear.name,
    gear.type,
    gear.initialDistance,
    gear.maxDistance,
    gear.notes ?? null,
    gear.isPrimary ? 1 : 0,
    gear.isActive ? 1 : 0,
    gear.startDate,
    gear.endDate ?? null,
    JSON.stringify(gear.workoutTypeIds),
    gear.createdAt,
    gear.updatedAt,
    gear.version,
    gear.isDeleted ? 1 : 0,
  ];
}

/**
 * SELECT shared by all reads. The `LEFT JOIN workout_gear → workouts` computes
 * each gear's cumulative workout distance, so `currentDistance` is always
 * correct without persisting it (matching the Swift computed property).
 */
const BASE_SELECT = `
  SELECT g.*, COALESCE(SUM(w.total_distance), 0) AS workout_distance
  FROM gear g
  LEFT JOIN workout_gear wg ON wg.gear_id = g.id
  LEFT JOIN workouts w ON w.id = wg.workout_id AND w.is_deleted = 0
`;

const INSERT_SQL = `
  INSERT INTO gear (
    id, name, type, initial_distance, max_distance, notes, is_primary,
    is_active, start_date, end_date, workout_type_ids, created_at,
    updated_at, version, is_deleted
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const UPDATE_SQL = `
  UPDATE gear SET
    name = ?, type = ?, initial_distance = ?, max_distance = ?, notes = ?,
    is_primary = ?, is_active = ?, start_date = ?, end_date = ?,
    workout_type_ids = ?, updated_at = ?, version = version + 1
  WHERE id = ?
`;

const SOFT_DELETE_SQL = `
  UPDATE gear SET
    is_deleted = 1, updated_at = ?, version = version + 1
  WHERE id = ?
`;

/** Create a SQLite-backed gear repository. */
export function createGearRepository(db: SQLiteDatabase): GearRepository {
  async function fetchWhere(
    whereClause: string,
    params: SQLiteBindValue[] = [],
  ): Promise<Gear[]> {
    const rows = await db.getAllAsync<GearRow>(
      `${BASE_SELECT} WHERE ${whereClause} GROUP BY g.id`,
      ...params,
    );
    return rows.map(mapRowToGear);
  }

  return {
    fetchAll: () => fetchWhere('g.is_deleted = 0'),

    fetchActive: () => fetchWhere('g.is_deleted = 0 AND g.is_active = 1'),

    fetchPrimary: async () => {
      const row = await db.getFirstAsync<GearRow>(
        `${BASE_SELECT} WHERE g.is_deleted = 0 AND g.is_primary = 1 GROUP BY g.id LIMIT 1`,
      );
      return row ? mapRowToGear(row) : null;
    },

    create: async (gear) => {
      await db.runAsync(INSERT_SQL, ...gearToInsertParams(gear));
    },

    update: async (gear) => {
      await db.runAsync(
        UPDATE_SQL,
        gear.name,
        gear.type,
        gear.initialDistance,
        gear.maxDistance,
        gear.notes ?? null,
        gear.isPrimary ? 1 : 0,
        gear.isActive ? 1 : 0,
        gear.startDate,
        gear.endDate ?? null,
        JSON.stringify(gear.workoutTypeIds),
        new Date().toISOString(),
        gear.id,
      );
    },

    delete: async (id) => {
      await db.runAsync(SOFT_DELETE_SQL, new Date().toISOString(), id);
    },
  };
}
