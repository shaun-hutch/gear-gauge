import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useGear, type MutationResult } from './useGear';
import type { GearRepository } from '@/data/gearRepository';
import { createGear as buildGear, GearType, type Gear } from '@/models';

/** In-memory GearRepository for exercising the hook without SQLite. */
function createFakeRepository(initial: Gear[] = []) {
  const items: Gear[] = initial.map((g) => ({ ...g }));

  const repo: GearRepository = {
    fetchAll: async () => items.filter((g) => !g.isDeleted),
    fetchActive: async () => items.filter((g) => g.isActive && !g.isDeleted),
    fetchPrimary: async () =>
      items.find((g) => g.isPrimary && !g.isDeleted) ?? null,
    create: async (gear) => {
      items.push({ ...gear });
    },
    update: async (gear) => {
      const i = items.findIndex((g) => g.id === gear.id);
      if (i >= 0) {
        items[i] = {
          ...items[i],
          ...gear,
          version: items[i].version + 1,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    delete: async (id) => {
      const i = items.findIndex((g) => g.id === id);
      if (i >= 0) {
        items[i] = { ...items[i], isDeleted: true };
      }
    },
  };

  return { repo, items };
}

describe('useGear', () => {
  it('loads and sorts gear on mount', async () => {
    const { repo } = createFakeRepository([
      buildGear({ name: 'Beta', type: GearType.Shoes, maxDistance: 1000 }),
      buildGear({ name: 'Alpha', type: GearType.Bicycle, maxDistance: 5000 }),
    ]);

    const { result } = await renderHook(() => useGear({ repository: repo }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.gear.map((g) => g.name)).toEqual(['Alpha', 'Beta']);
  });

  it('creates gear and refreshes the list', async () => {
    const { repo } = createFakeRepository();
    const { result } = await renderHook(() => useGear({ repository: repo }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let res: MutationResult | undefined;
    await act(async () => {
      res = await result.current.createGear({
        name: 'New Shoes',
        type: GearType.Shoes,
        maxDistance: 800,
      });
    });

    expect(res?.ok).toBe(true);
    expect(result.current.gear).toHaveLength(1);
    expect(result.current.gear[0].name).toBe('New Shoes');
  });

  it('rejects invalid input without persisting', async () => {
    const { repo, items } = createFakeRepository();
    const { result } = await renderHook(() => useGear({ repository: repo }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let res: MutationResult | undefined;
    await act(async () => {
      res = await result.current.createGear({
        name: '   ',
        type: GearType.Shoes,
        maxDistance: 100,
      });
    });

    expect(res?.ok).toBe(false);
    expect(res?.error).toBeTruthy();
    expect(items).toHaveLength(0);
  });

  it('enforces the maxGearCount premium seam', async () => {
    const { repo, items } = createFakeRepository([
      buildGear({ name: 'Existing', type: GearType.Shoes, maxDistance: 1000 }),
    ]);
    const { result } = await renderHook(() =>
      useGear({ repository: repo, maxGearCount: 1 }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let res: MutationResult | undefined;
    await act(async () => {
      res = await result.current.createGear({
        name: 'Second',
        type: GearType.Bicycle,
        maxDistance: 5000,
      });
    });

    expect(res?.ok).toBe(false);
    expect(res?.error).toBeTruthy();
    expect(items).toHaveLength(1);
  });

  it('updates and soft-deletes gear', async () => {
    const { repo } = createFakeRepository([
      buildGear({ name: 'Before', type: GearType.Shoes, maxDistance: 1000 }),
    ]);
    const { result } = await renderHook(() => useGear({ repository: repo }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const current = result.current.gear[0];
    await act(async () => {
      await result.current.updateGear({ ...current, name: 'After' });
    });
    expect(result.current.gear[0].name).toBe('After');

    await act(async () => {
      await result.current.deleteGear(current.id);
    });
    expect(result.current.gear).toHaveLength(0);
  });

  it('exposes activeGear and primaryGear', async () => {
    const primary = buildGear({
      name: 'Primary',
      type: GearType.Shoes,
      maxDistance: 1000,
      isPrimary: true,
    });
    const inactive = buildGear({
      name: 'Inactive',
      type: GearType.Shoes,
      maxDistance: 1000,
      isActive: false,
    });
    const { repo } = createFakeRepository([primary, inactive]);
    const { result } = await renderHook(() => useGear({ repository: repo }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.primaryGear?.id).toBe(primary.id);
    expect(result.current.activeGear).toHaveLength(1);
    expect(result.current.activeGear[0].id).toBe(primary.id);
  });
});
