import type { GearType } from './GearType';
import type { WorkoutType } from './WorkoutType';

/**
 * A piece of fitness gear tracked by the user (e.g. running shoes, bicycle).
 * Mirrors the Swift `Gear` model in gearGauge/gearGauge/Models/Gear.swift
 */
export interface Gear {
  /** Unique identifier (UUID string). */
  id: string;
  /** User-facing name for this gear item. */
  name: string;
  /** Category of gear (shoes, bicycle, etc.). */
  type: GearType;
  /**
   * Starting distance in kilometres — for gear that was pre-used before
   * tracking began. Defaults to 0 for brand-new gear.
   */
  initialDistance: number;
  /** Maximum recommended distance in kilometres before replacement. */
  maxDistance: number;
  /** Whether this is the user's primary/default gear. */
  isPrimary: boolean;
  /** Whether this gear is currently active (not retired). */
  isActive: boolean;
  /** Date the gear was put into service (ISO-8601). */
  startDate: string;
  /** Retirement date if the gear has been retired (ISO-8601). */
  endDate?: string;
  /** Optional free-form notes about the gear. */
  notes?: string;
  /** WorkoutType values this gear is applicable to. */
  workoutTypeIds: WorkoutType[];
  /** ISO-8601 timestamp of when this record was created. */
  createdAt: string;
  /** ISO-8601 timestamp of when this record was last updated. */
  updatedAt: string;
  /** Monotonically-incrementing version for conflict resolution. */
  version: number;
  /** Soft-delete flag — true when the gear has been retired/removed. */
  isDeleted: boolean;
  /**
   * Current cumulative distance in kilometres.
   * Computed as `initialDistance + sum of all associated workout distances`.
   * Populated at runtime by the data layer or hooks — not a class getter.
   */
  currentDistance: number;
}

/**
 * Compute the current distance for a gear item given its initial distance
 * and the distances (in km) of all workouts associated with it.
 *
 * @example
 * computeCurrentDistance({ initialDistance: 100 }, [5, 10, 3.5])
 * // => 118.5
 */
export function computeCurrentDistance(
  gear: Pick<Gear, 'initialDistance'>,
  workoutDistances: number[],
): number {
  const totalWorkoutDistance = workoutDistances.reduce((sum, d) => sum + d, 0);
  return gear.initialDistance + totalWorkoutDistance;
}
