import type { SQLiteDatabase } from 'expo-sqlite';
import { runMigrations } from './db';
import { createTestDatabase } from './sqliteTestHelper';
import {
  createGearRepository,
  mapRowToGear,
  type GearRepository,
  type GearRow,
} from './gearRepository';
import { createGear, GearType, WorkoutType } from '@/models';

// ── Pure row mapping ─────────────────────────────────────────────────────────

describe('mapRowToGear', () => {
  const baseRow: GearRow = {
    id: '1',
    name: 'Shoes',
    type: 'shoes',
    initial_distance: 10,
    max_distance: 100,
    notes: null,
    is_primary: 1,
    is_active: 1,
    start_date: '2025-01-01T00:00:00.000Z',
    end_date: null,
    workout_type_ids: '["outdoorRun"]',
    created_at: 'created',
    updated_at: 'updated',
    version: 3,
    is_deleted: 0,
    workout_distance: 42,
  };

  it('maps a snake_case row into the Gear model', () => {
    const gear = mapRowToGear(baseRow);

    expect(gear).toMatchObject({
      id: '1',
      name: 'Shoes',
      type: GearType.Shoes,
      initialDistance: 10,
      maxDistance: 100,
      isPrimary: true,
      isActive: true,
      isDeleted: false,
      version: 3,
      workoutTypeIds: [WorkoutType.OutdoorRun],
      currentDistance: 52, // initialDistance + workout_distance
    });
    expect(gear.notes).toBeUndefined();
    expect(gear.endDate).toBeUndefined();
  });

  it('maps falsy flags, nullable fields, and a null aggregate', () => {
    const gear = mapRowToGear({
      ...baseRow,
      notes: 'keep an eye on these',
      end_date: '2025-02-01T00:00:00.000Z',
      is_primary: 0,
      is_active: 0,
      is_deleted: 1,
      workout_distance: null,
    });

    expect(gear.isPrimary).toBe(false);
    expect(gear.isActive).toBe(false);
    expect(gear.isDeleted).toBe(true);
    expect(gear.notes).toBe('keep an eye on these');
    expect(gear.endDate).toBe('2025-02-01T00:00:00.000Z');
    expect(gear.currentDistance).toBe(10); // no workout distance yet
  });
});

// ── SQLite integration (in-memory) ───────────────────────────────────────────

describe('gearRepository (SQLite :memory:)', () => {
  let db: SQLiteDatabase;
  let repo: GearRepository;

  beforeEach(async () => {
    db = createTestDatabase();
    await runMigrations(db);
    repo = createGearRepository(db);
  });

  afterEach(async () => {
    await db.closeAsync();
  });

  it('creates and fetches all gear', async () => {
    const gear = createGear({
      name: 'Asics Gel Kayano',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    await repo.create(gear);

    const all = await repo.fetchAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(gear.id);
    expect(all[0].currentDistance).toBe(gear.initialDistance);
  });

  it('round-trips all fields through the database', async () => {
    const gear = createGear({
      name: 'Road Bike',
      type: GearType.Bicycle,
      initialDistance: 250,
      maxDistance: 5000,
      notes: 'Ultegra groupset',
      isPrimary: true,
      workoutTypeIds: [WorkoutType.OutdoorCycle, WorkoutType.IndoorCycle],
    });
    await repo.create(gear);

    const [fetched] = await repo.fetchAll();
    expect(fetched).toMatchObject({
      id: gear.id,
      name: 'Road Bike',
      type: GearType.Bicycle,
      initialDistance: 250,
      maxDistance: 5000,
      notes: 'Ultegra groupset',
      isPrimary: true,
      isActive: true,
      workoutTypeIds: [WorkoutType.OutdoorCycle, WorkoutType.IndoorCycle],
      version: 1,
      isDeleted: false,
    });
  });

  it('soft-deletes gear and excludes it from all reads', async () => {
    const gear = createGear({
      name: 'Retired',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    await repo.create(gear);
    await repo.delete(gear.id);

    expect(await repo.fetchAll()).toHaveLength(0);
    expect(await repo.fetchActive()).toHaveLength(0);
    expect(await repo.fetchPrimary()).toBeNull();
  });

  it('updates gear and bumps the version', async () => {
    const gear = createGear({
      name: 'Before',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    await repo.create(gear);

    await repo.update({ ...gear, name: 'After', maxDistance: 2000 });

    const [fetched] = await repo.fetchAll();
    expect(fetched.name).toBe('After');
    expect(fetched.maxDistance).toBe(2000);
    expect(fetched.version).toBe(2);
  });

  it('filters active and primary gear correctly', async () => {
    const primary = createGear({
      name: 'Primary',
      type: GearType.Shoes,
      maxDistance: 1000,
      isPrimary: true,
    });
    const active = createGear({
      name: 'Active',
      type: GearType.Bicycle,
      maxDistance: 5000,
    });
    const inactive = createGear({
      name: 'Inactive',
      type: GearType.Shoes,
      maxDistance: 1000,
      isActive: false,
    });
    await repo.create(primary);
    await repo.create(active);
    await repo.create(inactive);

    const primaryFetched = await repo.fetchPrimary();
    expect(primaryFetched?.id).toBe(primary.id);

    const activeFetched = await repo.fetchActive();
    expect(activeFetched.map((g) => g.name).sort()).toEqual([
      'Active',
      'Primary',
    ]);
  });
});
