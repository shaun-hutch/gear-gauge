import { runMigrations } from './db'
import { createTestDatabase } from './sqliteTestHelper'
import { createGearRepository } from './gearRepository'
import { createWorkoutRepository } from './workoutRepository'
import { seedDemoData } from './seed'
import { createGear, GearType } from '@/models'

describe('seedDemoData', () => {
  it('wipes existing gear and inserts the demo set', async () => {
    const db = createTestDatabase()
    await runMigrations(db)

    // Simulate a user-created item that seeding must clear.
    const repo = createGearRepository(db)
    await repo.create(
      createGear({ name: 'My Real Shoe', type: GearType.Shoes, maxDistance: 500 }),
    )

    await seedDemoData(db)

    const all = await repo.fetchAll()
    // Only the demo set remains — the pre-seed item was wiped.
    expect(all.map((g) => g.name)).not.toContain('My Real Shoe')
    expect(all).toHaveLength(4)

    // Primary + varied "pre-used" distances so the UI spans every condition.
    expect(all.find((g) => g.isPrimary)?.name).toBe('Specialized Tarmac SL7')

    // Pegasus is linked to two seeded workouts (10.5 km run + 4 km walk),
    // so its computed currentDistance includes that workout distance.
    expect(
      all.find((g) => g.name === 'Nike Pegasus 40')?.currentDistance,
    ).toBeCloseTo(434.5)
  })

  it('seeds workouts linked to the demo gear', async () => {
    const db = createTestDatabase()
    await runMigrations(db)

    await seedDemoData(db)

    const gearRepo = createGearRepository(db)
    const workoutRepo = createWorkoutRepository(db)

    const gear = await gearRepo.fetchAll()
    const workouts = await workoutRepo.fetchAll()

    expect(workouts).toHaveLength(5)

    const pegasus = gear.find((g) => g.name === 'Nike Pegasus 40')!
    const pegasusWorkouts = workouts.filter((w) => w.gearIds.includes(pegasus.id))
    // One run + one walk, both associated with the same pair of shoes.
    expect(pegasusWorkouts).toHaveLength(2)

    // Every seeded workout is linked to at least one of the demo gear items.
    const gearIds = new Set(gear.map((g) => g.id))
    for (const workout of workouts) {
      expect(workout.gearIds.length).toBeGreaterThan(0)
      expect(workout.gearIds.every((id) => gearIds.has(id))).toBe(true)
    }
  })
})
