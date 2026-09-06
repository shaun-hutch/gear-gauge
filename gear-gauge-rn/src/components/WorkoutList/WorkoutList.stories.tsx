import { WorkoutProvider } from "@/context/WorkoutProvider";
import type { WorkoutRepository } from "@/data/workoutRepository";
import { WorkoutType } from "@/models";
import {
  makeWorkout,
  makeWorkoutRepository,
  makePendingWorkoutRepository,
} from "@/test-utils/workout";
import { WorkoutList } from "./WorkoutList";

export default {
  title: "Components/WorkoutList",
  component: WorkoutList,
};

/**
 * `WorkoutList` consumes `useWorkoutsContext`, so stories wrap it in a
 * `WorkoutProvider` with an in-memory repository (from `@/test-utils/workout`)
 * to avoid touching the on-device SQLite database in the sandbox.
 */
function WithWorkouts({
  repository,
  recent,
}: {
  repository: WorkoutRepository;
  recent?: boolean;
}) {
  return (
    <WorkoutProvider repository={repository}>
      <WorkoutList recent={recent} />
    </WorkoutProvider>
  );
}

const mixedWorkouts = [
  makeWorkout({ totalDistance: 10.5, workoutType: WorkoutType.OutdoorRun }),
  makeWorkout({ totalDistance: 4.2, workoutType: WorkoutType.OutdoorWalk }),
  makeWorkout({ totalDistance: 42.1, workoutType: WorkoutType.OutdoorCycle }),
  makeWorkout({ totalDistance: 6.8, workoutType: WorkoutType.IndoorRun }),
];

/** Default — full history list (no heading), newest first. */
export const Default = () => (
  <WithWorkouts repository={makeWorkoutRepository(mixedWorkouts)} />
);

/** Recent — home variant: "Recent Workouts" heading + See All, capped at 3 items. */
export const Recent = () => (
  <WithWorkouts repository={makeWorkoutRepository(mixedWorkouts)} recent />
);

/** Empty — no synced workouts; shows the empty-state card. */
export const Empty = () => <WithWorkouts repository={makeWorkoutRepository([])} />;

/** Loading — the list stays empty while the repository fetch is in flight. */
export const Loading = () => (
  <WithWorkouts repository={makePendingWorkoutRepository()} />
);
