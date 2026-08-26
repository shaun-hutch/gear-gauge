import {
  GearType,
  WorkoutType,
  createGear,
  sortGear,
  validateGearInput,
  computeCurrentDistance,
  isGearActive,
  isGearPrimary,
  isGearDeleted,
  MAXIMUM_GEAR_DISTANCE,
} from './index';
import type { Gear } from './Gear';

/** Build a full Gear, overriding any fields. */
function makeGear(overrides: Partial<Gear> = {}): Gear {
  return {
    ...createGear({ name: 'Gear', type: GearType.Shoes, maxDistance: 1000 }),
    ...overrides,
  };
}

describe('createGear', () => {
  it('applies audit defaults and a generated id', () => {
    const g = createGear({
      name: 'Asics Gel Kayano',
      type: GearType.Shoes,
      maxDistance: 1000,
    });

    expect(g.id).toBeTruthy();
    expect(g.name).toBe('Asics Gel Kayano');
    expect(g.type).toBe(GearType.Shoes);
    expect(g.initialDistance).toBe(0);
    expect(g.maxDistance).toBe(1000);
    expect(g.isPrimary).toBe(false);
    expect(g.isActive).toBe(true);
    expect(g.workoutTypeIds).toEqual([]);
    expect(g.version).toBe(1);
    expect(g.isDeleted).toBe(false);
    expect(g.currentDistance).toBe(0);
    expect(g.createdAt).toBe(g.updatedAt);
    expect(Number.isNaN(Date.parse(g.createdAt))).toBe(false);
    expect(Number.isNaN(Date.parse(g.startDate))).toBe(false);
  });

  it('applies provided values and sets currentDistance from initialDistance', () => {
    const g = createGear({
      name: 'Road Bike',
      type: GearType.Bicycle,
      initialDistance: 250,
      maxDistance: 5000,
      isPrimary: true,
      workoutTypeIds: [WorkoutType.OutdoorCycle],
    });

    expect(g.initialDistance).toBe(250);
    expect(g.currentDistance).toBe(250);
    expect(g.isPrimary).toBe(true);
    expect(g.workoutTypeIds).toEqual([WorkoutType.OutdoorCycle]);
  });

  it('generates unique ids across instances', () => {
    const a = createGear({ name: 'A', type: GearType.Shoes, maxDistance: 1 });
    const b = createGear({ name: 'B', type: GearType.Shoes, maxDistance: 1 });
    expect(a.id).not.toBe(b.id);
  });
});

describe('sortGear', () => {
  it('orders primary first, then active → inactive → retired, then by name', () => {
    const primary = makeGear({ name: 'Zed', isPrimary: true, isActive: true });
    const activeB = makeGear({ name: 'Beta', isActive: true });
    const activeA = makeGear({ name: 'Alpha', isActive: true });
    const inactive = makeGear({ name: 'Charlie', isActive: false });
    const retired = makeGear({
      name: 'Delta',
      isActive: false,
      endDate: '2025-01-01T00:00:00.000Z',
    });

    const sorted = sortGear([inactive, retired, activeB, primary, activeA]);

    expect(sorted.map((g) => g.name)).toEqual([
      'Zed',
      'Alpha',
      'Beta',
      'Charlie',
      'Delta',
    ]);
  });

  it('returns a new array and leaves the input unchanged', () => {
    const input = [makeGear({ name: 'Beta' }), makeGear({ name: 'Alpha' })];
    const sorted = sortGear(input);

    expect(sorted).not.toBe(input);
    expect(input.map((g) => g.name)).toEqual(['Beta', 'Alpha']);
  });
});

describe('validateGearInput', () => {
  const validInput = {
    name: 'Shoes',
    type: GearType.Shoes,
    maxDistance: 500,
  };

  it('accepts valid input', () => {
    expect(validateGearInput(validInput).valid).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = validateGearInput({ ...validInput, name: '   ' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
  });

  it('rejects non-positive maxDistance', () => {
    expect(
      validateGearInput({ ...validInput, maxDistance: 0 }).errors.maxDistance,
    ).toBeTruthy();
    expect(
      validateGearInput({ ...validInput, maxDistance: -5 }).errors.maxDistance,
    ).toBeTruthy();
  });

  it('rejects maxDistance above the cap', () => {
    const result = validateGearInput({
      ...validInput,
      maxDistance: MAXIMUM_GEAR_DISTANCE + 1,
    });
    expect(result.errors.maxDistance).toBeTruthy();
  });

  it('accepts maxDistance at the cap', () => {
    expect(
      validateGearInput({ ...validInput, maxDistance: MAXIMUM_GEAR_DISTANCE })
        .valid,
    ).toBe(true);
  });

  it('rejects negative initialDistance', () => {
    expect(
      validateGearInput({ ...validInput, initialDistance: -1 }).errors
        .initialDistance,
    ).toBeTruthy();
  });
});

describe('computeCurrentDistance', () => {
  it('sums workout distances onto initial distance', () => {
    expect(computeCurrentDistance({ initialDistance: 100 }, [5, 10, 3.5])).toBe(
      118.5,
    );
  });

  it('returns initial distance when there are no workouts', () => {
    expect(computeCurrentDistance({ initialDistance: 100 }, [])).toBe(100);
  });
});

describe('gear predicates', () => {
  it('isGearDeleted reflects the soft-delete flag', () => {
    expect(isGearDeleted(makeGear({ isDeleted: true }))).toBe(true);
    expect(isGearDeleted(makeGear())).toBe(false);
  });

  it('isGearActive requires active and not deleted', () => {
    expect(isGearActive(makeGear({ isActive: true, isDeleted: false }))).toBe(
      true,
    );
    expect(isGearActive(makeGear({ isActive: true, isDeleted: true }))).toBe(
      false,
    );
    expect(isGearActive(makeGear({ isActive: false }))).toBe(false);
  });

  it('isGearPrimary requires primary and not deleted', () => {
    expect(isGearPrimary(makeGear({ isPrimary: true, isDeleted: false }))).toBe(
      true,
    );
    expect(isGearPrimary(makeGear({ isPrimary: true, isDeleted: true }))).toBe(
      false,
    );
  });
});
