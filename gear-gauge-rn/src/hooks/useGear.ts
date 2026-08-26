import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createGear as buildGear,
  isGearActive,
  isGearPrimary,
  sortGear,
  validateGearInput,
  type Gear,
  type GearInput,
} from '@/models';
import {
  createGearRepository,
  type GearRepository,
} from '@/data/gearRepository';
import { getDb } from '@/data/db';
import type { MutationResult } from './types';

export type { MutationResult };

export interface UseGearOptions {
  /** Optional repository override — used in tests. Defaults to the app DB. */
  repository?: GearRepository;
  /**
   * Premium seam: maximum number of active gear allowed. When set and reached,
   * `createGear` fails without persisting. Unbounded when unset.
   */
  maxGearCount?: number;
}

export interface UseGearResult {
  /** All non-deleted gear, sorted for display (see `sortGear`). */
  gear: Gear[];
  /** Active, non-deleted gear. */
  activeGear: Gear[];
  /** The primary gear, or `null`. */
  primaryGear: Gear | null;
  /** True while the initial load is in flight. */
  isLoading: boolean;
  /** Last load/refresh/mutation error, or `null`. */
  error: string | null;
  refresh: () => Promise<void>;
  createGear: (input: GearInput) => Promise<MutationResult>;
  updateGear: (gear: Gear) => Promise<MutationResult>;
  deleteGear: (id: string) => Promise<MutationResult>;
  clearError: () => void;
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Gear state + CRUD. Mirrors the native `GearViewModel` (a Swift `@Observable`
 * class), reimagined as a hook. Loads on mount; each mutation persists then
 * refreshes the in-memory list.
 */
export function useGear(options: UseGearOptions = {}): UseGearResult {
  const { repository, maxGearCount } = options;

  const [gear, setGear] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lazily build the repository from the app DB on first use. Tests inject a
  // repository via `options` and never touch the real database.
  const repoRef = useRef<GearRepository | null>(repository ?? null);
  const getRepo = useCallback(async (): Promise<GearRepository> => {
    if (!repoRef.current) {
      const db = await getDb();
      repoRef.current = createGearRepository(db);
    }
    return repoRef.current;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const repo = await getRepo();
      setGear(sortGear(await repo.fetchAll()));
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
          setGear(sortGear(all));
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

  const createGear = useCallback(
    async (input: GearInput): Promise<MutationResult> => {
      const validation = validateGearInput(input);
      if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];
        return { ok: false, error: firstError };
      }

      try {
        const repo = await getRepo();

        // Premium seam — policy lives here (not in the repository).
        if (maxGearCount !== undefined) {
          const active = await repo.fetchActive();
          if (active.length >= maxGearCount) {
            return {
              ok: false,
              error: 'Gear limit reached. Upgrade to premium to add more gear.',
            };
          }
        }

        await repo.create(buildGear(input));
        await refresh();
        return { ok: true };
      } catch (e) {
        const message = toMessage(e);
        setError(message);
        return { ok: false, error: message };
      }
    },
    [getRepo, maxGearCount, refresh],
  );

  const updateGear = useCallback(
    async (updated: Gear): Promise<MutationResult> => {
      try {
        const repo = await getRepo();
        await repo.update(updated);
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

  const deleteGear = useCallback(
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

  const activeGear = useMemo(() => gear.filter(isGearActive), [gear]);
  const primaryGear = useMemo(() => gear.find(isGearPrimary) ?? null, [gear]);

  return {
    gear,
    activeGear,
    primaryGear,
    isLoading,
    error,
    refresh,
    createGear,
    updateGear,
    deleteGear,
    clearError,
  };
}
