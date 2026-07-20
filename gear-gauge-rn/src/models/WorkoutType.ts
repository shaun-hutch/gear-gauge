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
export const WORKOUT_TYPE_META: Record<WorkoutType, WorkoutTypeMeta> = {
  [WorkoutType.OutdoorRun]: {
    displayName: 'Outdoor Run',
    displayIcon: 'figure.run.circle',
  },
  [WorkoutType.IndoorRun]: {
    displayName: 'Indoor Run',
    displayIcon: 'figure.run.treadmill.circle',
  },
  [WorkoutType.OutdoorWalk]: {
    displayName: 'Outdoor Walk',
    displayIcon: 'figure.walk.circle',
  },
  [WorkoutType.IndoorWalk]: {
    displayName: 'Indoor Walk',
    displayIcon: 'figure.walk.treadmill.circle',
  },
  [WorkoutType.OutdoorCycle]: {
    displayName: 'Outdoor Cycle',
    displayIcon: 'figure.outdoor.cycle.circle',
  },
  [WorkoutType.IndoorCycle]: {
    displayName: 'Indoor Cycle',
    displayIcon: 'figure.indoor.cycle.circle',
  },
  [WorkoutType.Other]: {
    displayName: 'Other',
    displayIcon: 'chevron.right.circle',
  },
};

/** Convenience accessor — returns display metadata for the given WorkoutType. */
export function getWorkoutTypeMeta(type: WorkoutType): WorkoutTypeMeta {
  return WORKOUT_TYPE_META[type];
}
