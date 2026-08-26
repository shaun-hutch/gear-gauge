import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createWorkout as buildWorkout,
  validateWorkoutInput,
  type Workout,
  type WorkoutInput,
} from '@/models';
import {
  createWorkoutRepository,
  type WorkoutRepository,
} from '@/data/workoutRepository';
import { getDb } from '@/data/db';
import type { MutationResult } from './types';

export interface UseWorkoutsOptions {
  /** Optional repository override — used in tests. Defaults to the app DB. */
  repository?: WorkoutRepository;
}

export interface UseWorkoutsResult {
  /** All non-deleted workouts, newest first. */
  workouts: Workout[];
  /** True while the initial load is in flight. */
  isLoading: boolean;
  /** Last load/refresh/mutation error, or `null`. */
  error: string | null;
  refresh: () => Promise<void>;
  createWorkout: (input: WorkoutInput) => Promise<MutationResult>;
  deleteWorkout: (id: string) => Promise<MutationResult>;
  clearError: () => void;
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Workout state + manual-entry CRUD. Loads on mount; `createWorkout` validates
 * and persists (with its gear associations); `deleteWorkout` soft-deletes.
 */
export function useWorkouts(
  options: UseWorkoutsOptions = {},
): UseWorkoutsResult {
  const { repository } = options;

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repoRef = useRef<WorkoutRepository | null>(repository ?? null);
  const getRepo = useCallback(async (): Promise<WorkoutRepository> => {
    if (!repoRef.current) {
      const db = await getDb();
      repoRef.current = createWorkoutRepository(db);
    }
    return repoRef.current;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const repo = await getRepo();
      setWorkouts(await repo.fetchAll());
      setError(null);
    } catch (e) {
      setError(toMessage(e));
    }
  }, [getRepo]);

  // Initial load.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const repo = await getRepo();
        const all = await repo.fetchAll();
        if (!cancelled) {
          setWorkouts(all);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(toMessage(e));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getRepo]);

  const createWorkout = useCallback(
    async (input: WorkoutInput): Promise<MutationResult> => {
      const validation = validateWorkoutInput(input);
      if (!validation.valid) {
        return { ok: false, error: Object.values(validation.errors)[0] };
      }

      try {
        const repo = await getRepo();
        await repo.create(buildWorkout(input));
        await refresh();
        return { ok: true };
      } catch (e) {
        const message = toMessage(e);
        setError(message);
        return { ok: false, error: message };
      }
    },
    [getRepo, refresh],
  );

  const deleteWorkout = useCallback(
    async (id: string): Promise<MutationResult> => {
      try {
        const repo = await getRepo();
        await repo.delete(id);
        await refresh();
        return { ok: true };
      } catch (e) {
        const message = toMessage(e);
        setError(message);
        return { ok: false, error: message };
      }
    },
    [getRepo, refresh],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    workouts,
    isLoading,
    error,
    refresh,
    createWorkout,
    deleteWorkout,
    clearError,
  };
}
