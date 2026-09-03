/**
 * WorkoutType — workout categories used to associate gear with specific activities.
 * Mirrors the Swift `WorkoutType` enum in gearGauge/gearGauge/Models/WorkoutType.swift
 */
export enum WorkoutType {
  OutdoorRun = 'outdoorRun',
  IndoorRun = 'indoorRun',
  OutdoorWalk = 'outdoorWalk',
  IndoorWalk = 'indoorWalk',
  OutdoorCycle = 'outdoorCycle',
  IndoorCycle = 'indoorCycle',
  Other = 'other',
}

/** Display metadata associated with each WorkoutType variant. */
export interface WorkoutTypeMeta {
  /** Human-readable label (localisable in the future). */
  displayName: string;
  /** SF Symbol / icon name used to represent this workout type in the UI. */
  displayIcon: string;
}

/**
 * Lookup map providing `displayName` and `displayIcon` for every WorkoutType.
 * TS enums cannot hold methods, so metadata lives in this separate const.
 */
const WORKOUT_TYPE_META: Record<WorkoutType, WorkoutTypeMeta> = {
  [WorkoutType.OutdoorRun]: {
    displayName: 'Outdoor Run',
    displayIcon: 'figure.run',
  },
  [WorkoutType.IndoorRun]: {
    displayName: 'Indoor Run',
    displayIcon: 'figure.run.treadmill',
  },
  [WorkoutType.OutdoorWalk]: {
    displayName: 'Outdoor Walk',
    displayIcon: 'figure.walk',
  },
  [WorkoutType.IndoorWalk]: {
    displayName: 'Indoor Walk',
    displayIcon: 'figure.walk.treadmill',
  },
  [WorkoutType.OutdoorCycle]: {
    displayName: 'Outdoor Cycle',
    displayIcon: 'figure.outdoor.cycle',
  },
  [WorkoutType.IndoorCycle]: {
    displayName: 'Indoor Cycle',
    displayIcon: 'figure.indoor.cycle',
  },
  [WorkoutType.Other]: {
    displayName: 'Other',
    displayIcon: 'chevron.right',
  },
};

/**
 * Returns the SF Symbol for a workout type, optionally without the `.circle` suffix.
 * The non-circle variant is derived on demand rather than stored separately,
 * keeping `WORKOUT_TYPE_META` a single source of truth.
 */
export function getWorkoutTypeMeta(type: WorkoutType, withCircle = true): WorkoutTypeMeta {
  const icon = WORKOUT_TYPE_META[type].displayIcon;

  return {
    displayName: WORKOUT_TYPE_META[type].displayName,
    displayIcon: withCircle ? `icon.${'circle'}` : icon,
  };
}

