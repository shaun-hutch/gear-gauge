import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useWorkouts } from './useWorkouts';
import type { WorkoutRepository } from '@/data/workoutRepository';
import {
  createWorkout as buildWorkout,
  WorkoutType,
  type Workout,
} from '@/models';
import type { MutationResult } from './types';

/** In-memory WorkoutRepository for exercising the hook without SQLite. */
function createFakeRepository(initial: Workout[] = []) {
  const items: Workout[] = initial.map((w) => ({
    ...w,
    gearIds: [...w.gearIds],
  }));

  const repo: WorkoutRepository = {
    fetchAll: async () => items.filter((w) => !w.isDeleted),
    fetchByGear: async (gearId) =>
      items.filter((w) => !w.isDeleted && w.gearIds.includes(gearId)),
    create: async (workout) => {
      items.push({ ...workout, gearIds: [...workout.gearIds] });
    },
    delete: async (id) => {
      const i = items.findIndex((w) => w.id === id);
      if (i >= 0) items[i] = { ...items[i], isDeleted: true };
    },
    healthKitUUIDExists: async () => false,
  };

  return { repo, items };
}

describe('useWorkouts', () => {
  it('loads workouts on mount', async () => {
    const workout = buildWorkout({
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 5,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: ['g1'],
    });
    const { repo } = createFakeRepository([workout]);

    const { result } = await renderHook(() =>
      useWorkouts({ repository: repo }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.workouts).toHaveLength(1);
  });

  it('creates a workout and refreshes the list', async () => {
    const { repo } = createFakeRepository();
    const { result } = await renderHook(() =>
      useWorkouts({ repository: repo }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let res: MutationResult | undefined;
    await act(async () => {
      res = await result.current.createWorkout({
        workoutType: WorkoutType.OutdoorRun,
        totalDistance: 5,
        startDate: '2026-08-26T00:00:00.000Z',
        gearIds: ['g1'],
      });
    });

    expect(res?.ok).toBe(true);
    expect(result.current.workouts).toHaveLength(1);
  });

  it('rejects input without a gear item', async () => {
    const { repo, items } = createFakeRepository();
    const { result } = await renderHook(() =>
      useWorkouts({ repository: repo }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let res: MutationResult | undefined;
    await act(async () => {
      res = await result.current.createWorkout({
        workoutType: WorkoutType.OutdoorRun,
        totalDistance: 5,
        startDate: '2026-08-26T00:00:00.000Z',
        gearIds: [],
      });
    });

    expect(res?.ok).toBe(false);
    expect(res?.error).toBeTruthy();
    expect(items).toHaveLength(0);
  });

  it('deletes a workout', async () => {
    const workout = buildWorkout({
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 5,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: ['g1'],
    });
    const { repo } = createFakeRepository([workout]);
    const { result } = await renderHook(() =>
      useWorkouts({ repository: repo }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteWorkout(workout.id);
    });
    expect(result.current.workouts).toHaveLength(0);
  });
});
