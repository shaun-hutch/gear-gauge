import type { SQLiteDatabase } from 'expo-sqlite';
import { createTestDatabase } from './sqliteTestHelper';
import { runMigrations } from './db';
import { createGearRepository, type GearRepository } from './gearRepository';
import {
  createWorkoutRepository,
  type WorkoutRepository,
} from './workoutRepository';
import {
  createGear,
  createWorkout,
  GearType,
  WorkoutType,
} from '@/models';

describe('workoutRepository (SQLite :memory:)', () => {
  let db: SQLiteDatabase;
  let gearRepo: GearRepository;
  let workoutRepo: WorkoutRepository;

  beforeEach(async () => {
    db = createTestDatabase();
    await runMigrations(db);
    gearRepo = createGearRepository(db);
    workoutRepo = createWorkoutRepository(db);
  });

  afterEach(async () => {
    await db.closeAsync();
  });

  it('creates and fetches workouts with their gear associations', async () => {
    const gear = createGear({
      name: 'Shoes',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    await gearRepo.create(gear);

    const workout = createWorkout({
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 5.5,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: [gear.id],
    });
    await workoutRepo.create(workout);

    const all = await workoutRepo.fetchAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(workout.id);
    expect(all[0].gearIds).toEqual([gear.id]);
    expect(all[0].source).toBe('manual');
  });

  it('links a workout to multiple gear items', async () => {
    const shoes = createGear({
      name: 'Shoes',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    const bike = createGear({
      name: 'Bike',
      type: GearType.Bicycle,
      maxDistance: 5000,
    });
    await gearRepo.create(shoes);
    await gearRepo.create(bike);

    await workoutRepo.create(
      createWorkout({
        workoutType: WorkoutType.OutdoorRun,
        totalDistance: 10,
        startDate: '2026-08-26T00:00:00.000Z',
        gearIds: [shoes.id, bike.id],
      }),
    );

    const [fetched] = await workoutRepo.fetchAll();
    expect([...fetched.gearIds].sort()).toEqual([shoes.id, bike.id].sort());
  });

  it('fetchByGear returns only workouts for that gear', async () => {
    const shoes = createGear({
      name: 'Shoes',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    const bike = createGear({
      name: 'Bike',
      type: GearType.Bicycle,
      maxDistance: 5000,
    });
    await gearRepo.create(shoes);
    await gearRepo.create(bike);

    await workoutRepo.create(
      createWorkout({
        workoutType: WorkoutType.OutdoorRun,
        totalDistance: 5,
        startDate: '2026-08-26T00:00:00.000Z',
        gearIds: [shoes.id],
      }),
    );
    await workoutRepo.create(
      createWorkout({
        workoutType: WorkoutType.OutdoorCycle,
        totalDistance: 20,
        startDate: '2026-08-26T00:00:00.000Z',
        gearIds: [bike.id],
      }),
    );

    const shoeWorkouts = await workoutRepo.fetchByGear(shoes.id);
    expect(shoeWorkouts).toHaveLength(1);
    expect(shoeWorkouts[0].workoutType).toBe(WorkoutType.OutdoorRun);
  });

  it('soft-deletes workouts', async () => {
    const gear = createGear({
      name: 'Shoes',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    await gearRepo.create(gear);

    const workout = createWorkout({
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 5,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: [gear.id],
    });
    await workoutRepo.create(workout);

    await workoutRepo.delete(workout.id);
    expect(await workoutRepo.fetchAll()).toHaveLength(0);
  });

  it('healthKitUUIDExists detects existing HealthKit UUIDs', async () => {
    const gear = createGear({
      name: 'Shoes',
      type: GearType.Shoes,
      maxDistance: 1000,
    });
    await gearRepo.create(gear);

    const manual = createWorkout({
      workoutType: WorkoutType.OutdoorRun,
      totalDistance: 5,
      startDate: '2026-08-26T00:00:00.000Z',
      gearIds: [gear.id],
    });
    await workoutRepo.create({
      ...manual,
      source: 'healthkit',
      healthKitUUID: 'hk-123',
      activityType: 'running',
    });

    expect(await workoutRepo.healthKitUUIDExists('hk-123')).toBe(true);
    expect(await workoutRepo.healthKitUUIDExists('hk-other')).toBe(false);
  });

  it('contributes workout distance to gear currentDistance', async () => {
    const shoes = createGear({
      name: 'Shoes',
      type: GearType.Shoes,
      maxDistance: 1000,
      initialDistance: 100,
    });
    await gearRepo.create(shoes);

    await workoutRepo.create(
      createWorkout({
        workoutType: WorkoutType.OutdoorRun,
        totalDistance: 5,
        startDate: '2026-08-26T00:00:00.000Z',
        gearIds: [shoes.id],
      }),
    );
    await workoutRepo.create(
      createWorkout({
        workoutType: WorkoutType.OutdoorRun,
        totalDistance: 3.5,
        startDate: '2026-08-25T00:00:00.000Z',
        gearIds: [shoes.id],
      }),
    );

    const [fetched] = await gearRepo.fetchAll();
    expect(fetched.currentDistance).toBe(108.5);
  });
});
