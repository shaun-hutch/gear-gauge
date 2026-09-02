import { GearProvider } from "@/context/GearProvider";
import type { GearRepository } from "@/data/gearRepository";
import { GearType } from "@/models";
import {
  makeGear,
  makeGearRepository,
  makePendingGearRepository,
} from "@/test-utils/gear";
import { GearList } from "./GearList";

export default {
  title: "Components/GearList",
  component: GearList,
};

/**
 * GearList consumes `useGearContext`, so stories must wrap it in a
 * `GearProvider`. An in-memory repository (from `@/test-utils/gear`) is
 * injected to avoid touching the on-device SQLite database in the sandbox.
 */
function WithGear({ repository }: { repository: GearRepository }) {
  return (
    <GearProvider repository={repository}>
      <GearList />
    </GearProvider>
  );
}

const mixedGear = [
  makeGear({
    name: "Specialized Tarmac SL7",
    type: GearType.Bicycle,
    maxDistance: 5000,
    currentDistance: 1000,
    isPrimary: true,
  }),
  makeGear({
    name: "Nike Pegasus 40",
    type: GearType.Shoes,
    maxDistance: 800,
    currentDistance: 420,
  }),
  makeGear({
    name: "Brooks Ghost 15",
    type: GearType.Shoes,
    maxDistance: 800,
    currentDistance: 640,
  }),
  makeGear({
    name: "Giant Defy",
    type: GearType.Bicycle,
    maxDistance: 5000,
    currentDistance: 4650,
  }),
];

/** Default — several items spanning condition states, primary first. */
export const Default = () => (
  <WithGear repository={makeGearRepository(mixedGear)} />
);

/** Empty — no tracked gear; the surrounding screen owns its own empty state. */
export const Empty = () => <WithGear repository={makeGearRepository([])} />;

/** Loading — the list stays empty while the repository fetch is in flight. */
export const Loading = () => (
  <WithGear repository={makePendingGearRepository()} />
);
