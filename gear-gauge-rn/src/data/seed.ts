import type { SQLiteDatabase } from 'expo-sqlite'
import { getDb } from './db'
import { createGearRepository } from './gearRepository'
import { createWorkoutRepository } from './workoutRepository'
import {
  createGear,
  createWorkout,
  GearType,
  WorkoutType,
  type Gear,
  type GearInput,
  type WorkoutInput,
} from '@/models'

/**
 * Dev-only demo dataset inserted when the app launches with `SEED_DB=true`.
 * The `initialDistance` values deliberately mimic "pre-used" gear so the list
 * spans all four condition states:
 *
 *   Specialized Tarmac SL7   1000/5000 km  → Excellent   (primary)
 *   Nike Pegasus 40           420/800  km  → Optimal
 *   Brooks Ghost 15           640/800  km  → Moderate wear
 *   Giant Defy               4650/5000 km  → Critical: replace
 *
 * A few workouts are then linked to this gear so the history list and each
 * gear's computed `currentDistance` have realistic data out of the box.
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
 * Demo workouts to seed, linked to the {@link DEMO_GEAR} entries above.
 * `gearNames` are resolved to their generated ids at insert time; `input`
 * holds everything else a manual workout needs. Dates are fixed in the past
 * so the history list renders realistic relative/absolute dates.
 */
const DEMO_WORKOUTS: Array<{
  gearNames: string[]
  input: Omit<WorkoutInput, 'gearIds'>
}> = [
  {
    gearNames: ['Nike Pegasus 40'],
    input: {
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 10.5,
      startDate: '2026-09-01T07:30:00.000Z',
      endDate: '2026-09-01T08:20:00.000Z',
    },
  },
  {
    gearNames: ['Brooks Ghost 15'],
    input: {
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 8.5,
      startDate: '2026-08-28T07:00:00.000Z',
      endDate: '2026-08-28T07:50:00.000Z',
    },
  },
  {
    gearNames: ['Specialized Tarmac SL7'],
    input: {
      workoutType: WorkoutType.OutdoorCycle,
      totalDistance: 45,
      startDate: '2026-08-24T09:00:00.000Z',
      endDate: '2026-08-24T10:45:00.000Z',
    },
  },
  {
    gearNames: ['Giant Defy'],
    input: {
      workoutType: WorkoutType.OutdoorCycle,
      totalDistance: 62.5,
      startDate: '2026-08-16T08:15:00.000Z',
      endDate: '2026-08-16T11:00:00.000Z',
    },
  },
  {
    gearNames: ['Nike Pegasus 40'],
    input: {
      workoutType: WorkoutType.OutdoorWalk,
      totalDistance: 4,
      startDate: '2026-08-10T17:30:00.000Z',
      endDate: '2026-08-10T18:30:00.000Z',
    },
  },
]

/**
 * Replace all gear and workouts with the demo dataset.
 *
 * Intentionally destructive: each flagged launch resets the gear + workout
 * tables to the exact demo set (via `DELETE`, whose `workout_gear` links
 * cascade away), so a mock run is always predictable. Never call this outside
 * a dev/SEED_DB run — it will wipe real gear and workouts.
 *
 * Accepts an optional already-migrated DB handle for tests; when omitted the
 * app database is opened (and migrated) via {@link getDb}.
 */
export async function seedDemoData(db?: SQLiteDatabase): Promise<void> {
  const database = db ?? (await getDb())
  const gearRepo = createGearRepository(database)
  const workoutRepo = createWorkoutRepository(database)

  // Reset so repeated launches produce a predictable mock dataset. Deleting
  // gear cascades its `workout_gear` links; workouts are cleared explicitly
  // because the repository only ever soft-deletes them.
  await database.execAsync('DELETE FROM gear;')
  await database.execAsync('DELETE FROM workouts;')

  const gearByName = new Map<string, Gear>()
  for (const input of DEMO_GEAR) {
    const gear = createGear(input)
    await gearRepo.create(gear)
    gearByName.set(gear.name, gear)
  }

  let seededWorkouts = 0
  for (const demo of DEMO_WORKOUTS) {
    const gearIds = demo.gearNames
      .map((name) => gearByName.get(name)?.id)
      .filter((id): id is string => id !== undefined)
    if (gearIds.length > 0) {
      await workoutRepo.create(createWorkout({ ...demo.input, gearIds }))
      seededWorkouts += 1
    }
  }

  console.info(
    `[seed] Inserted ${DEMO_GEAR.length} demo gear items and ${seededWorkouts} demo workouts`,
  )
}
