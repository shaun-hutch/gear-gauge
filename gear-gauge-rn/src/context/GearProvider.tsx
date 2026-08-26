import { createContext, useContext, type ReactNode } from 'react';
import { useGear, type UseGearOptions, type UseGearResult } from '@/hooks/useGear';

const GearContext = createContext<UseGearResult | null>(null);

interface GearProviderProps extends UseGearOptions {
  children: ReactNode;
}

/** Provides gear state + CRUD to the tree via {@link useGearContext}. */
export function GearProvider({ children, ...options }: GearProviderProps) {
  const value = useGear(options);
  return <GearContext.Provider value={value}>{children}</GearContext.Provider>;
}

/** Consume gear state. Throws if used outside a {@link GearProvider}. */
export function useGearContext(): UseGearResult {
  const context = useContext(GearContext);
  if (!context) {
    throw new Error('useGearContext must be used within a GearProvider');
  }
  return context;
}
