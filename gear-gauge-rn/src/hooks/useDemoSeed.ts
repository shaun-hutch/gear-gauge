import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { seedDemoData } from '@/data/seed';

/**
 * True when this launch requested demo data (`SEED_DB=true`) and Storybook is
 * NOT active — we never seed under Storybook because its stories inject their
 * own in-memory repositories and shouldn't touch the on-device database.
 *
 * Mirrors the config extras injected in `app.config.js` and read by
 * `src/app/_layout.tsx` (which decides whether to mount the Storybook UI).
 */
export function isDemoSeedEnabled(): boolean {
  return (
    Constants.expoConfig?.extra?.seedDb === 'true' &&
    Constants.expoConfig?.extra?.storybookEnabled !== 'true'
  );
}

/**
 * Dev-only demo seeding gate.
 *
 * When the app is launched with `SEED_DB=true` (and outside Storybook), this
 * waits until {@link seedDemoData} has populated the database before returning
 * `true`, so data providers mounted afterwards see the demo rows on first load.
 * Any other launch returns `true` immediately (no gating, no seeding).
 *
 * A seeding failure logs a warning and still releases the gate — demo data
 * must never block the app from launching.
 *
 * @returns `true` once the app is safe to mount its data providers.
 */
export function useDemoSeed(): boolean {
  const enabled = isDemoSeedEnabled();
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await seedDemoData();
      } catch (error) {
        console.warn('[seed] Failed to seed demo data', error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return ready;
}
