import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { GearProvider } from "@/context/GearProvider";
import { GearType, type Gear } from "@/models";
import type { GearRepository } from "@/data/gearRepository";
import { makeGear, makeGearRepository } from "@/test-utils/gear";
import { GearList } from "./GearList";

/**
 * In-memory repository whose `fetchAll` is gated behind a manual `release()`.
 * `GearList` consumes `useGearContext`, which loads on mount — gating the fetch
 * lets tests observe the loading state before data arrives, without SQLite.
 */
function createGatedRepository(initial: Gear[] = []) {
  // Created eagerly (not inside `fetchAll`) so `release` is always defined,
  // regardless of when the hook requests the initial fetch.
  let resolveFetch!: (value: Gear[]) => void;
  const fetchPromise = new Promise<Gear[]>((resolve) => {
    resolveFetch = resolve;
  });

  let fetchAllCalled = false;
  // Reuse the shared in-memory repo for every operation except the gated fetch.
  const repo: GearRepository = {
    ...makeGearRepository(initial),
    fetchAll: () => {
      fetchAllCalled = true;
      return fetchPromise;
    },
  };

  /** Wait until the hook has requested its initial fetch. */
  const waitForFetch = async () =>
    waitFor(() => expect(fetchAllCalled).toBe(true));

  /** Release the pending fetch so the hook resolves with `initial`. */
  const release = () => resolveFetch(initial);

  return { repo, release, waitForFetch };
}

describe("GearList", () => {
  const shoes = makeGear({
    name: "Nike Pegasus 40",
    type: GearType.Shoes,
    maxDistance: 800,
    currentDistance: 420,
  });
  const bike = makeGear({
    name: "Specialized Tarmac SL7",
    type: GearType.Bicycle,
    maxDistance: 5000,
    currentDistance: 1000,
    isPrimary: true,
  });

  it("renders nothing while gear is still loading", async () => {
    const { repo, waitForFetch } = createGatedRepository([shoes, bike]);

    await render(
      <GearProvider repository={repo}>
        <GearList />
      </GearProvider>,
    );

    // Confirm the fetch was requested but never released → `isLoading` stays
    // true, so no rows should appear yet.
    await waitForFetch();
    expect(screen.queryByText("Nike Pegasus 40")).toBeNull();
  });

  it("renders each gear item once the list has loaded", async () => {
    const { repo, release, waitForFetch } = createGatedRepository([
      shoes,
      bike,
    ]);

    await render(
      <GearProvider repository={repo}>
        <GearList />
      </GearProvider>,
    );

    await waitForFetch();

    // Release the pending fetch inside `act` so the state updates flush.
    await act(async () => {
      release();
    });

    expect(await screen.findByText("Nike Pegasus 40")).toBeTruthy();
    expect(screen.getByText("Specialized Tarmac SL7")).toBeTruthy();
    // Distances flow through to the row (formatting is covered by GearListItem).
    expect(screen.getByText("420 / 800 km")).toBeTruthy();
  });

  it("renders an empty list when there are no items", async () => {
    const { repo, release, waitForFetch } = createGatedRepository([]);

    const view = await render(
      <GearProvider repository={repo}>
        <GearList />
      </GearProvider>,
    );

    await waitForFetch();
    await act(async () => {
      release();
    });

    // No rows → the fragment renders as nothing (the screen owns its empty state).
    expect(view.toJSON()).toBeNull();
  });

  it("invokes the row onPress when an item is tapped", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    try {
      const { repo, release, waitForFetch } = createGatedRepository([shoes]);

      await render(
        <GearProvider repository={repo}>
          <GearList />
        </GearProvider>,
      );

      await waitForFetch();
      await act(async () => {
        release();
      });

      // Pressing anywhere inside the row (here, the name) bubbles to the Pressable.
      const row = await screen.findByText("Nike Pegasus 40");
      fireEvent.press(row);

      expect(logSpy).toHaveBeenCalledWith("Pressed Nike Pegasus 40");
    } finally {
      logSpy.mockRestore();
    }
  });
});
