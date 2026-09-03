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
export type { Gear, GearInput, GearValidationResult } from './Gear';
export {
  computeCurrentDistance,
  createGear,
  sortGear,
  validateGearInput,
  isGearDeleted,
  isGearActive,
  isGearPrimary,
} from './Gear';

export type {
  Workout,
  WorkoutInput,
  WorkoutSource,
  WorkoutValidationResult,
} from './Workout';
export { createWorkout, validateWorkoutInput } from './Workout';

// ── Constants ─────────────────────────────────────────────────────
export { MAXIMUM_GEAR_DISTANCE } from './constants';
