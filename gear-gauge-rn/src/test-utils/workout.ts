import type { WorkoutRepository } from "@/data/workoutRepository";
import { createWorkout, WorkoutType, type Workout } from "@/models";

/**
 * Shared workout fixtures + in-memory repository factories for Jest tests and
 * Storybook stories — mirrors `src/test-utils/gear.ts`.
 */

/** Parameters for {@link makeWorkout}. */
export interface MakeWorkoutOptions {
  /** Distance covered in kilometres. */
  totalDistance: number;
  startDate?: string;
  gearIds?: string[];
  workoutType?: WorkoutType;
}

/** Build a persisted-style `Workout` fixture via `createWorkout`. */
export function makeWorkout({
  totalDistance,
  startDate = "2026-08-26T00:00:00.000Z",
  gearIds = [],
  workoutType = WorkoutType.OutdoorRun,
}: MakeWorkoutOptions): Workout {
  return createWorkout({ workoutType, totalDistance, startDate, gearIds });
}

/**
 * In-memory `WorkoutRepository` seeded with `items`, resolving immediately.
 * Avoids SQLite entirely — `getDb()` is unavailable under Jest and undesirable
 * in Storybook sandboxes.
 */
export function makeWorkoutRepository(
  items: Workout[] = [],
): WorkoutRepository {
  return {
    fetchAll: async () => items,
    fetchByGear: async (gearId) =>
      items.filter((w) => w.gearIds.includes(gearId)),
    create: async () => {},
    delete: async () => {},
    healthKitUUIDExists: async () => false,
  };
}

/** `WorkoutRepository` whose fetches never resolve — for "loading" states. */
export function makePendingWorkoutRepository(): WorkoutRepository {
  const never = () => new Promise<never>(() => {});
  return {
    fetchAll: never,
    fetchByGear: never,
    create: async () => {},
    delete: async () => {},
    healthKitUUIDExists: async () => false,
  };
}
