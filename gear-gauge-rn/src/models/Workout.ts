import { randomUUID } from 'expo-crypto';
import type { WorkoutType } from './WorkoutType';

/**
 * Where a workout came from. HealthKit imports are deduplicated by
 * `healthKitUUID`; manual entries have no HealthKit UUID.
 */
export type WorkoutSource = 'healthkit' | 'manual';

/**
 * A workout associated with one or more gear items.
 * Mirrors the Swift `Workout` model in gearGauge/gearGauge/Models/Workout.swift.
 */
export interface Workout {
  /** Unique identifier (UUID string). */
  id: string;
  /** Origin of the workout. */
  source: WorkoutSource;
  /**
   * HealthKit UUID — used for deduplication when importing workouts.
   * `null` for manually-added workouts.
   */
  healthKitUUID: string | null;
  /** Gear-logic workout type (shared by HealthKit imports and manual entries). */
  workoutType: WorkoutType;
  /** Total distance covered in kilometres. */
  totalDistance: number;
  /** ISO-8601 timestamp of when the workout started. */
  startDate: string;
  /** ISO-8601 timestamp of when the workout ended. */
  endDate: string;
  /**
   * Raw value of the HKWorkoutActivityType (e.g. "running", "walking",
   * "cycling"). `null` for manual entries.
   */
  activityType: string | null;
  /** Whether the workout was performed indoors. */
  isIndoor: boolean;
  /** IDs of the Gear items associated with this workout. */
  gearIds: string[];
  /** ISO-8601 timestamp of when this record was created. */
  createdAt: string;
  /** ISO-8601 timestamp of when this record was last updated. */
  updatedAt: string;
  /** Monotonically-incrementing version for conflict resolution. */
  version: number;
  /** Soft-delete flag — true when the workout has been removed. */
  isDeleted: boolean;
}

// ── Manual workout input & factory ───────────────────────────────────────────

/** User-supplied fields for a manually-added workout (no HealthKit). */
export interface WorkoutInput {
  workoutType: WorkoutType;
  /** Distance covered in kilometres. */
  totalDistance: number;
  /** ISO-8601 start date. */
  startDate: string;
  /** ISO-8601 end date. Defaults to `startDate`. */
  endDate?: string;
  /** Gear items this workout applies to. At least one is required. */
  gearIds: string[];
}

export interface WorkoutValidationResult {
  valid: boolean;
  errors: Partial<
    Record<'workoutType' | 'totalDistance' | 'startDate' | 'gearIds', string>
  >;
}

/**
 * Create a manually-added workout. Audit fields are defaulted, `source` is
 * `'manual'`, and `healthKitUUID`/`activityType` are `null` (HealthKit imports
 * will use a separate path in a later phase).
 */
export function createWorkout(input: WorkoutInput): Workout {
  const now = new Date().toISOString();
  const startDate = input.startDate;

  return {
    id: randomUUID(),
    source: 'manual',
    healthKitUUID: null,
    workoutType: input.workoutType,
    totalDistance: input.totalDistance,
    startDate,
    endDate: input.endDate ?? startDate,
    activityType: null,
    isIndoor: input.workoutType.startsWith('indoor'),
    gearIds: [...input.gearIds],
    createdAt: now,
    updatedAt: now,
    version: 1,
    isDeleted: false,
  };
}

/**
 * Validate manual workout input. Rules: positive distance, a start date, and at
 * least one associated gear item.
 */
export function validateWorkoutInput(
  input: WorkoutInput,
): WorkoutValidationResult {
  const errors: WorkoutValidationResult['errors'] = {};

  if (
    input.totalDistance === undefined ||
    Number.isNaN(input.totalDistance) ||
    input.totalDistance <= 0
  ) {
    errors.totalDistance = 'Distance must be greater than 0.';
  }

  if (!input.startDate) {
    errors.startDate = 'Date is required.';
  }

  if (!input.gearIds || input.gearIds.length === 0) {
    errors.gearIds = 'Select at least one gear item.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
