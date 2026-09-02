import { runMigrations } from './db'
import { createTestDatabase } from './sqliteTestHelper'
import { createGearRepository } from './gearRepository'
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
    expect(all.find((g) => g.name === 'Nike Pegasus 40')?.currentDistance).toBe(420)
  })
})
