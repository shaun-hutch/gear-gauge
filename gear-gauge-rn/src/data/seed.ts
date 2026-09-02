import type { SQLiteDatabase } from 'expo-sqlite'
import { getDb } from './db'
import { createGearRepository } from './gearRepository'
import { createGear, GearType, type GearInput } from '@/models'

/**
 * Dev-only demo dataset inserted when the app launches with `SEED_DB=true`.
 * The `initialDistance` values deliberately mimic "pre-used" gear so the list
 * spans all four condition states without needing seeded workouts:
 *
 *   Specialized Tarmac SL7   1000/5000 km  → Excellent   (primary)
 *   Nike Pegasus 40           420/800  km  → Optimal
 *   Brooks Ghost 15           640/800  km  → Moderate wear
 *   Giant Defy               4650/5000 km  → Critical: replace
 */
const DEMO_GEAR: GearInput[] = [
  {
    name: 'Specialized Tarmac SL7',
    type: GearType.Bicycle,
    initialDistance: 1000,
    maxDistance: 5000,
    isPrimary: true,
  },
  {
    name: 'Nike Pegasus 40',
    type: GearType.Shoes,
    initialDistance: 420,
    maxDistance: 800,
  },
  {
    name: 'Brooks Ghost 15',
    type: GearType.Shoes,
    initialDistance: 640,
    maxDistance: 800,
  },
  {
    name: 'Giant Defy',
    type: GearType.Bicycle,
    initialDistance: 4650,
    maxDistance: 5000,
  },
]

/**
 * Replace all gear with the demo dataset.
 *
 * Intentionally destructive: each flagged launch resets the gear table to the
 * exact demo set (via `DELETE`, whose `workout_gear` links cascade away), so a
 * mock run is always predictable. Never call this outside a dev/SEED_DB run —
 * it will wipe real gear.
 *
 * Accepts an optional already-migrated DB handle for tests; when omitted the
 * app database is opened (and migrated) via {@link getDb}.
 */
export async function seedDemoData(db?: SQLiteDatabase): Promise<void> {
  const database = db ?? (await getDb())
  const repo = createGearRepository(database)

  // Reset so repeated launches produce a predictable mock dataset.
  await database.execAsync('DELETE FROM gear;')

  for (const input of DEMO_GEAR) {
    await repo.create(createGear(input))
  }

  console.info(`[seed] Inserted ${DEMO_GEAR.length} demo gear items`)
}
