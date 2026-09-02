import { act, renderHook, waitFor } from '@testing-library/react-native';
import Constants from 'expo-constants';
import { seedDemoData } from '@/data/seed';
import { isDemoSeedEnabled, useDemoSeed } from './useDemoSeed';

// Mock the data layer so the hook never touches expo-sqlite under Jest, and
// expose the mocked fn for assertions/control.
jest.mock('@/data/seed', () => ({
  seedDemoData: jest.fn(),
}));

// Mock expo-constants with a stable config object whose `extra` we can mutate
// per test (the getter keeps returning the same object).
jest.mock('expo-constants', () => {
  const config: { extra: Record<string, string | null | undefined> } = {
    extra: {},
  };
  return {
    __esModule: true,
    default: {
      get expoConfig() {
        return config;
      },
    },
  };
});

type Extra = Record<string, string | null | undefined>;

function setExtra(extra: Extra): void {
  (Constants.expoConfig as unknown as { extra: Extra }).extra = extra;
}

describe('isDemoSeedEnabled', () => {
  it('is true only with SEED_DB=true and Storybook off', () => {
    setExtra({});
    expect(isDemoSeedEnabled()).toBe(false);

    setExtra({ seedDb: 'true' });
    expect(isDemoSeedEnabled()).toBe(true);

    // Never seed under Storybook — stories inject their own repositories.
    setExtra({ seedDb: 'true', storybookEnabled: 'true' });
    expect(isDemoSeedEnabled()).toBe(false);
  });
});

describe('useDemoSeed', () => {
  beforeEach(() => {
    setExtra({});
    (seedDemoData as jest.Mock).mockReset();
  });

  it('returns ready immediately and never seeds when disabled', async () => {
    const { result } = await renderHook(() => useDemoSeed());

    expect(result.current).toBe(true);
    expect(seedDemoData).not.toHaveBeenCalled();
  });

  it('stays gated until demo data has been seeded', async () => {
    setExtra({ seedDb: 'true' });

    let releaseSeed!: () => void;
    (seedDemoData as jest.Mock).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          releaseSeed = resolve;
        }),
    );

    const { result } = await renderHook(() => useDemoSeed());

    expect(result.current).toBe(false);
    expect(seedDemoData).toHaveBeenCalledTimes(1);

    await act(async () => {
      releaseSeed();
    });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it('releases the gate even if seeding fails', async () => {
    setExtra({ seedDb: 'true' });
    (seedDemoData as jest.Mock).mockRejectedValue(new Error('boom'));

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { result } = await renderHook(() => useDemoSeed());

      await waitFor(() => expect(result.current).toBe(true));
      expect(seedDemoData).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        '[seed] Failed to seed demo data',
        expect.any(Error),
      );
    } finally {
      warnSpy.mockRestore();
    }
  });
});
