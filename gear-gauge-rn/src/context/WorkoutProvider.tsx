import { createContext, useContext, type ReactNode } from 'react';
import {
  useWorkouts,
  type UseWorkoutsOptions,
  type UseWorkoutsResult,
} from '@/hooks/useWorkouts';

const WorkoutContext = createContext<UseWorkoutsResult | null>(null);

interface WorkoutProviderProps extends UseWorkoutsOptions {
  children: ReactNode;
}

/** Provides workout state + CRUD to the tree via {@link useWorkoutsContext}. */
export function WorkoutProvider({
  children,
  ...options
}: WorkoutProviderProps) {
  const value = useWorkouts(options);
  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

/** Consume workout state. Throws if used outside a {@link WorkoutProvider}. */
export function useWorkoutsContext(): UseWorkoutsResult {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutsContext must be used within a WorkoutProvider');
  }
  return context;
}
