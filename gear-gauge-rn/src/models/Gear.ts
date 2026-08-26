import { randomUUID } from 'expo-crypto';
import type { GearType } from './GearType';
import type { WorkoutType } from './WorkoutType';
import { MAXIMUM_GEAR_DISTANCE } from './constants';

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

// ── GearInput & factory ─────────────────────────────────────────────────────

/**
 * User-supplied fields for creating a new gear item.
 * Audit fields (`id`, `createdAt`, `updatedAt`, `version`, `isDeleted`) and the
 * computed `currentDistance` are filled in by {@link createGear}.
 */
export interface GearInput {
  name: string;
  type: GearType;
  /** Starting distance in km for pre-used gear. Defaults to 0. */
  initialDistance?: number;
  /** Maximum distance in km before replacement. */
  maxDistance: number;
  /** Optional free-form notes. */
  notes?: string;
  /** Whether this is the primary gear. Defaults to false. */
  isPrimary?: boolean;
  /** Whether the gear is active (not retired). Defaults to true. */
  isActive?: boolean;
  /** Date the gear was put into service (ISO-8601). Defaults to now. */
  startDate?: string;
  /** WorkoutType values this gear applies to. Defaults to []. */
  workoutTypeIds?: WorkoutType[];
}

/** Result of validating a {@link GearInput}. */
export interface GearValidationResult {
  valid: boolean;
  /** Field-name → human-readable error message. Empty when `valid` is true. */
  errors: Partial<Record<keyof GearInput, string>>;
}

/**
 * Create a fully-populated `Gear` entity from user input, applying defaults and
 * audit metadata. Mirrors the Swift `Gear.init` + `BaseEntity.init`.
 */
export function createGear(input: GearInput): Gear {
  const now = new Date().toISOString();
  const initialDistance = input.initialDistance ?? 0;

  return {
    id: randomUUID(),
    name: input.name,
    type: input.type,
    initialDistance,
    maxDistance: input.maxDistance,
    notes: input.notes,
    isPrimary: input.isPrimary ?? false,
    isActive: input.isActive ?? true,
    startDate: input.startDate ?? now,
    workoutTypeIds: input.workoutTypeIds ?? [],
    createdAt: now,
    updatedAt: now,
    version: 1,
    isDeleted: false,
    currentDistance: initialDistance,
  };
}

// ── Sorting ─────────────────────────────────────────────────────────────────

/**
 * Sort gear for display. Mirrors `GearViewModel.fetchAllGear`:
 * 1. primary gear first, then
 * 2. active (1) → inactive (2) → retired (3), then
 * 3. name ascending.
 */
export function sortGear(gear: Gear[]): Gear[] {
  return [...gear].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) {
      return a.isPrimary ? -1 : 1;
    }

    const rankA = gearRank(a);
    const rankB = gearRank(b);
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return a.name.localeCompare(b.name);
  });
}

/** Display rank: retired (3) < inactive (2) < active (1). */
function gearRank(gear: Gear): number {
  if (gear.endDate) return 3; // retired
  if (gear.isActive) return 1; // active
  return 2; // inactive
}

// ── Validation ──────────────────────────────────────────────────────────────

/**
 * Validate user input before creating/updating a gear item.
 * Rules: non-empty name; 0 < maxDistance ≤ MAXIMUM_GEAR_DISTANCE;
 * initialDistance ≥ 0.
 */
export function validateGearInput(input: GearInput): GearValidationResult {
  const errors: GearValidationResult['errors'] = {};

  if (!input.name || input.name.trim().length === 0) {
    errors.name = 'Name is required.';
  }

  if (
    input.maxDistance === undefined ||
    Number.isNaN(input.maxDistance) ||
    input.maxDistance <= 0
  ) {
    errors.maxDistance = 'Max distance must be greater than 0.';
  } else if (input.maxDistance > MAXIMUM_GEAR_DISTANCE) {
    errors.maxDistance = `Max distance cannot exceed ${MAXIMUM_GEAR_DISTANCE} km.`;
  }

  if (
    input.initialDistance !== undefined &&
    (Number.isNaN(input.initialDistance) || input.initialDistance < 0)
  ) {
    errors.initialDistance = 'Initial distance cannot be negative.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ── Predicates ──────────────────────────────────────────────────────────────

/** True when the gear has been soft-deleted. */
export function isGearDeleted(gear: Gear): boolean {
  return gear.isDeleted;
}

/** True when the gear is active and not deleted. */
export function isGearActive(gear: Gear): boolean {
  return gear.isActive && !gear.isDeleted;
}

/** True when the gear is the primary gear and not deleted. */
export function isGearPrimary(gear: Gear): boolean {
  return gear.isPrimary && !gear.isDeleted;
}
