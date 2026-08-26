import {
  WorkoutType,
  createWorkout,
  validateWorkoutInput,
} from './index';
import type { WorkoutInput } from './Workout';

describe('createWorkout', () => {
  it('creates a manual workout with defaults', () => {
    const workout = createWorkout({
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 5.5,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: ['gear-1'],
    });

    expect(workout.id).toBeTruthy();
    expect(workout.source).toBe('manual');
    expect(workout.healthKitUUID).toBeNull();
    expect(workout.activityType).toBeNull();
    expect(workout.workoutType).toBe(WorkoutType.OutdoorRun);
    expect(workout.totalDistance).toBe(5.5);
    expect(workout.endDate).toBe(workout.startDate);
    expect(workout.isIndoor).toBe(false);
    expect(workout.gearIds).toEqual(['gear-1']);
    expect(workout.version).toBe(1);
    expect(workout.isDeleted).toBe(false);
  });

  it('derives isIndoor from the workout type and copies gearIds', () => {
    const indoor = createWorkout({
      workoutType: WorkoutType.IndoorRun,
      totalDistance: 3,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: ['a', 'b'],
    });
    expect(indoor.isIndoor).toBe(true);

    // gearIds is defensively copied from the input array.
    const source = ['x', 'y'];
    const workout = createWorkout({
      workoutType: WorkoutType.OutdoorCycle,
      totalDistance: 1,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: source,
    });
    source.push('z');
    expect(workout.gearIds).toEqual(['x', 'y']);
  });
});

describe('validateWorkoutInput', () => {
  const valid: WorkoutInput = {
    workoutType: WorkoutType.OutdoorRun,
    totalDistance: 5,
    startDate: '2026-08-26T00:00:00.000Z',
    gearIds: ['gear-1'],
  };

  it('accepts valid input', () => {
    expect(validateWorkoutInput(valid).valid).toBe(true);
  });

  it('requires at least one gear item', () => {
    expect(
      validateWorkoutInput({ ...valid, gearIds: [] }).errors.gearIds,
    ).toBeTruthy();
  });

  it('requires a positive distance', () => {
    expect(
      validateWorkoutInput({ ...valid, totalDistance: 0 }).errors
        .totalDistance,
    ).toBeTruthy();
    expect(
      validateWorkoutInput({ ...valid, totalDistance: -1 }).errors
        .totalDistance,
    ).toBeTruthy();
  });

  it('requires a start date', () => {
    expect(
      validateWorkoutInput({ ...valid, startDate: '' }).errors.startDate,
    ).toBeTruthy();
  });
});
