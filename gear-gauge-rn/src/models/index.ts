/**
 * Barrel export for the domain model layer.
 * Import everything from `@/models` for convenience:
 *
 *   import { Gear, Workout, GearType, MAXIMUM_GEAR_DISTANCE } from '@/models';
 */

// ── Enums & metadata ──────────────────────────────────────────────
export {
  GearType,
  GEAR_TYPE_META,
  getGearTypeMeta,
} from './GearType';
export type { GearTypeMeta } from './GearType';

export {
  WorkoutType,
  WORKOUT_TYPE_META,
  getWorkoutTypeMeta,
} from './WorkoutType';
export type { WorkoutTypeMeta } from './WorkoutType';

export {
  DistanceUnit,
  convertKmToMi,
  convertMiToKm,
  convertDistance,
} from './DistanceUnit';

// ── Interfaces & helpers ──────────────────────────────────────────
export type { Gear } from './Gear';
export { computeCurrentDistance } from './Gear';

export type { Workout } from './Workout';

// ── Constants ─────────────────────────────────────────────────────
export { MAXIMUM_GEAR_DISTANCE } from './constants';
