import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react-native";
import { Link } from "expo-router";

import { WorkoutProvider } from "@/context/WorkoutProvider";
import { WorkoutType } from "@/models";
import {
  makeWorkout,
  makeWorkoutRepository,
  makePendingWorkoutRepository,
} from "@/test-utils/workout";
import { WorkoutList } from "./WorkoutList";

// `WorkoutList` renders expo-router's `Link` (via `asChild`) only in its
// `recent` variant. Mock it to a pass-through so the component can render
// without a navigation container, while still capturing its props so we can
// assert the "See All" target.
jest.mock("expo-router", () => ({
  Link: jest.fn(({ children }: { children?: ReactNode }) => children),
}));

const MockLink = Link as unknown as jest.Mock;

const run = makeWorkout({
  totalDistance: 5.2,
  workoutType: WorkoutType.OutdoorRun,
});
const walk = makeWorkout({
  totalDistance: 3.7,
  workoutType: WorkoutType.OutdoorWalk,
});
const cycle = makeWorkout({
  totalDistance: 42.1,
  workoutType: WorkoutType.OutdoorCycle,
});
const indoorRun = makeWorkout({
  totalDistance: 6.8,
  workoutType: WorkoutType.IndoorRun,
});

describe("WorkoutList", () => {
  beforeEach(() => {
    MockLink.mockClear();
  });

  it("renders nothing while workouts are still loading", async () => {
    await render(
      <WorkoutProvider repository={makePendingWorkoutRepository()}>
        <WorkoutList />
      </WorkoutProvider>,
    );

    expect(screen.queryByText("Outdoor Run")).toBeNull();
  });

  it("renders each workout once the list has loaded", async () => {
    await render(
      <WorkoutProvider repository={makeWorkoutRepository([run, cycle])}>
        <WorkoutList />
      </WorkoutProvider>,
    );

    expect(await screen.findByText("Outdoor Run")).toBeTruthy();
    expect(screen.getByText("Outdoor Cycle")).toBeTruthy();
    // Distances flow through to the row (formatting is covered by WorkoutListItem).
    expect(screen.getByText("5.2 km")).toBeTruthy();
    expect(screen.getByText("42.1 km")).toBeTruthy();
  });

  it("renders the empty state when there are no workouts", async () => {
    await render(
      <WorkoutProvider repository={makeWorkoutRepository([])}>
        <WorkoutList />
      </WorkoutProvider>,
    );

    expect(
      await screen.findByText(
        /No workouts synced yet. Connect HealthKit in Settings to get started./,
      ),
    ).toBeTruthy();
  });

  it("hides the Recent Workouts heading and See All link when not recent", async () => {
    await render(
      <WorkoutProvider repository={makeWorkoutRepository([run])}>
        <WorkoutList />
      </WorkoutProvider>,
    );

    await screen.findByText("Outdoor Run");

    expect(screen.queryByText("Recent Workouts")).toBeNull();
    expect(screen.queryByText("See All")).toBeNull();
    expect(MockLink).not.toHaveBeenCalled();
  });

  it("renders the heading and a See All link targeting /history when recent", async () => {
    await render(
      <WorkoutProvider repository={makeWorkoutRepository([run])}>
        <WorkoutList recent />
      </WorkoutProvider>,
    );

    expect(await screen.findByText("Recent Workouts")).toBeTruthy();
    expect(screen.getByText("See All")).toBeTruthy();

    // React 19 invokes function components with a trailing `undefined` second
    // argument, so assert on the first call's first argument rather than using
    // `toHaveBeenCalledWith` (which compares the full argument list).
    expect(MockLink).toHaveBeenCalled();
    expect(MockLink.mock.calls[0][0]).toEqual(
      expect.objectContaining({ href: "/history", asChild: true }),
    );
  });

  it("shows only the three most recent workouts when recent", async () => {
    await render(
      <WorkoutProvider
        repository={makeWorkoutRepository([run, walk, cycle, indoorRun])}
      >
        <WorkoutList recent />
      </WorkoutProvider>,
    );

    expect(await screen.findByText("Outdoor Run")).toBeTruthy();
    expect(screen.getByText("Outdoor Walk")).toBeTruthy();
    expect(screen.getByText("Outdoor Cycle")).toBeTruthy();
    // The fourth workout is sliced off in recent mode.
    expect(screen.queryByText("Indoor Run")).toBeNull();
  });
});
