import type { SQLiteDatabase, SQLiteBindValue } from 'expo-sqlite';
import type { Workout, WorkoutSource } from '@/models/Workout';
import type { WorkoutType } from '@/models/WorkoutType';

/** Public data-access surface for workouts. */
export interface WorkoutRepository {
  /** Fetch all non-deleted workouts, newest first. */
  fetchAll(): Promise<Workout[]>;
  /** Fetch non-deleted workouts associated with a given gear item. */
  fetchByGear(gearId: string): Promise<Workout[]>;
  /** Insert a workout plus its gear associations in one transaction. */
  create(workout: Workout): Promise<void>;
  /** Soft-delete a workout, bumping `version` + `updatedAt`. */
  delete(id: string): Promise<void>;
  /** True when a HealthKit workout with this UUID already exists. */
  healthKitUUIDExists(healthKitUUID: string): Promise<boolean>;
}

/** Raw row shape returned by SQLite. `gear_ids_json` is `json_group_array`. */
export interface WorkoutRow {
  id: string;
  source: string;
  health_kit_uuid: string | null;
  activity_type: string | null;
  workout_type: string;
  total_distance: number;
  start_date: string;
  end_date: string;
  is_indoor: number;
  created_at: string;
  updated_at: string;
  version: number;
  is_deleted: number;
  gear_ids_json?: string | null;
}

/** Convert a SQLite row into the public `Workout` model. */
export function mapRowToWorkout(row: WorkoutRow): Workout {
  return {
    id: row.id,
    source: row.source as WorkoutSource,
    healthKitUUID: row.health_kit_uuid,
    workoutType: row.workout_type as WorkoutType,
    totalDistance: row.total_distance,
    startDate: row.start_date,
    endDate: row.end_date,
    activityType: row.activity_type,
    isIndoor: row.is_indoor === 1,
    gearIds: JSON.parse(row.gear_ids_json ?? '[]') as string[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
    isDeleted: row.is_deleted === 1,
  };
}

/**
 * SELECT shared by reads. The `LEFT JOIN workout_gear` collects a workout's
 * gear ids via `json_group_array`, so each row carries its full `gearIds`.
 */
const SELECT_WITH_GEAR = `
  SELECT w.*, COALESCE(json_group_array(wg.gear_id), '[]') AS gear_ids_json
  FROM workouts w
  LEFT JOIN workout_gear wg ON wg.workout_id = w.id
`;

const INSERT_WORKOUT_SQL = `
  INSERT INTO workouts (
    id, source, health_kit_uuid, activity_type, workout_type, total_distance,
    start_date, end_date, is_indoor, created_at, updated_at, version, is_deleted
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const INSERT_WORKOUT_GEAR_SQL = `
  INSERT INTO workout_gear (workout_id, gear_id) VALUES (?, ?)
`;

const SOFT_DELETE_WORKOUT_SQL = `
  UPDATE workouts SET
    is_deleted = 1, updated_at = ?, version = version + 1
  WHERE id = ?
`;

/** Create a SQLite-backed workout repository. */
export function createWorkoutRepository(
  db: SQLiteDatabase,
): WorkoutRepository {
  const workoutParams = (workout: Workout): SQLiteBindValue[] => [
    workout.id,
    workout.source,
    workout.healthKitUUID,
    workout.activityType,
    workout.workoutType,
    workout.totalDistance,
    workout.startDate,
    workout.endDate,
    workout.isIndoor ? 1 : 0,
    workout.createdAt,
    workout.updatedAt,
    workout.version,
    workout.isDeleted ? 1 : 0,
  ];

  return {
    fetchAll: async () => {
      const rows = await db.getAllAsync<WorkoutRow>(
        `${SELECT_WITH_GEAR} WHERE w.is_deleted = 0 GROUP BY w.id ORDER BY w.start_date DESC`,
      );
      return rows.map(mapRowToWorkout);
    },

    fetchByGear: async (gearId) => {
      const rows = await db.getAllAsync<WorkoutRow>(
        `${SELECT_WITH_GEAR}
         WHERE w.is_deleted = 0
           AND w.id IN (SELECT workout_id FROM workout_gear WHERE gear_id = ?)
         GROUP BY w.id ORDER BY w.start_date DESC`,
        gearId,
      );
      return rows.map(mapRowToWorkout);
    },

    create: async (workout) => {
      await db.withTransactionAsync(async () => {
        await db.runAsync(INSERT_WORKOUT_SQL, ...workoutParams(workout));
        for (const gearId of workout.gearIds) {
          await db.runAsync(INSERT_WORKOUT_GEAR_SQL, workout.id, gearId);
        }
      });
    },

    delete: async (id) => {
      await db.runAsync(
        SOFT_DELETE_WORKOUT_SQL,
        new Date().toISOString(),
        id,
      );
    },

    healthKitUUIDExists: async (healthKitUUID) => {
      const row = await db.getFirstAsync<{ n: number }>(
        'SELECT 1 AS n FROM workouts WHERE health_kit_uuid = ? AND is_deleted = 0 LIMIT 1',
        healthKitUUID,
      );
      return row !== null;
    },
  };
}
