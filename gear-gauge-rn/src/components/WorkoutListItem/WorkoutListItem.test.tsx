import { render, screen } from "@testing-library/react-native";
import { WorkoutType } from "@/models/WorkoutType";
import { WorkoutListItem } from "./WorkoutListItem";

describe("WorkoutListItem", () => {
  // Freeze "now" so the relative-date logic in `formatDateString` is deterministic.
  const now = new Date("2026-09-03T12:00:00");

  beforeEach(() => {
    jest.useFakeTimers({ now });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const daysAgo = (days: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  it("renders the workout type, distance and relative date", async () => {
    await render(
      <WorkoutListItem
        distance="5.2"
        date={daysAgo(2)}
        type={WorkoutType.OutdoorRun}
      />,
    );

    expect(screen.getByText("Outdoor Run")).toBeTruthy();
    expect(screen.getByText(/5\.2 km/)).toBeTruthy();
    expect(screen.getByText(/2 days ago/)).toBeTruthy();
  });

  it("groups the row into one accessible element with a combined label", async () => {
    await render(
      <WorkoutListItem
        distance="5.2"
        date={daysAgo(2)}
        type={WorkoutType.OutdoorRun}
      />,
    );

    const item = screen.getByLabelText(/Outdoor Run/);
    expect(item).toBeVisible();
    expect(item).toHaveAccessibleName("Outdoor Run, 2 days ago, 5.2 km");
  });

  it("renders the display name for other workout types", async () => {
    await render(
      <WorkoutListItem
        distance="42.1"
        date={daysAgo(1)}
        type={WorkoutType.OutdoorCycle}
      />,
    );

    expect(screen.getByText("Outdoor Cycle")).toBeTruthy();
    expect(screen.getByText(/1 day ago/)).toBeTruthy();
  });

  it("renders the fallback label for unrecognised types", async () => {
    await render(
      <WorkoutListItem
        distance="10"
        date={daysAgo(0)}
        type={WorkoutType.Other}
      />,
    );

    expect(screen.getByText("Other")).toBeTruthy();
    expect(screen.getByText(/Today/)).toBeTruthy();
  });

  it("omits the wear badge when no wear info is provided", async () => {
    await render(
      <WorkoutListItem
        distance="5.2"
        date={daysAgo(2)}
        type={WorkoutType.OutdoorRun}
      />,
    );

    expect(screen.queryByText("GEAR WEAR")).toBeNull();
  });
});
