import type { GearRepository } from "@/data/gearRepository";
import { createGear, GearType, type Gear } from "@/models";

/**
 * Shared gear fixtures + in-memory repository factories for Jest tests and
 * Storybook stories. Centralising them means tests and stories exercise the
 * exact same data shapes, and future components (e.g. `GearListItem`, screen
 * stories) can reuse them without duplicating builders.
 */

/** Parameters for {@link makeGear}. */
export interface MakeGearOptions {
  name: string;
  type: GearType;
  maxDistance: number;
  /** Accumulated usage in km — simulates a value the data layer would populate. */
  currentDistance: number;
  isPrimary?: boolean;
}

/**
 * Build a persisted-style `Gear` fixture with a meaningful `currentDistance`.
 * `createGear` zeroes `currentDistance` (it is a runtime aggregate), so we
 * override it to simulate gear that has accumulated real usage.
 */
export function makeGear({
  name,
  type,
  maxDistance,
  currentDistance,
  isPrimary = false,
}: MakeGearOptions): Gear {
  return {
    ...createGear({ name, type, maxDistance, isPrimary }),
    currentDistance,
  };
}

/**
 * In-memory `GearRepository` seeded with `items`, resolving immediately.
 * Avoids SQLite entirely — `getDb()` is unavailable under Jest, and is
 * undesirable in Storybook sandboxes (see `src/data/db.ts`).
 */
export function makeGearRepository(items: Gear[] = []): GearRepository {
  return {
    fetchAll: async () => items,
    fetchActive: async () => items.filter((g) => g.isActive),
    fetchPrimary: async () => items.find((g) => g.isPrimary) ?? null,
    create: async () => {},
    update: async () => {},
    delete: async () => {},
  };
}

/**
 * `GearRepository` whose fetches never resolve — keeps consumers in their
 * loading state indefinitely. Useful for Storybook "loading" stories.
 */
export function makePendingGearRepository(): GearRepository {
  const never = () => new Promise<never>(() => {});
  return {
    fetchAll: never,
    fetchActive: never,
    fetchPrimary: never,
    create: async () => {},
    update: async () => {},
    delete: async () => {},
  };
}
