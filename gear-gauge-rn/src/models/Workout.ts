/**
 * A workout imported from HealthKit and associated with one or more gear items.
 * Mirrors the Swift `Workout` model in gearGauge/gearGauge/Models/Workout.swift
 */
export interface Workout {
  /** Unique identifier (UUID string). */
  id: string;
  /**
   * HealthKit UUID — used for deduplication when importing workouts.
   * Must be unique across all stored workouts.
   */
  healthKitUUID: string;
  /** Total distance covered in kilometres. */
  totalDistance: number;
  /** ISO-8601 timestamp of when the workout started. */
  startDate: string;
  /** ISO-8601 timestamp of when the workout ended. */
  endDate: string;
  /** Raw value of the HKWorkoutActivityType (e.g. "running", "walking", "cycling"). */
  activityType: string;
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
