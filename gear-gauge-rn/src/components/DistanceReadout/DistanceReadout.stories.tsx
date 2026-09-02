import { DistanceReadout } from "./DistanceReadout";

export default {
  title: "Components/DistanceReadout",
  component: DistanceReadout,
};

/** Default — a partially used gear item. */
export const Default = () => (
  <DistanceReadout currentDistance={350} maxDistance={500} />
);

/** Brand-new gear with zero distance recorded. */
export const New = () => (
  <DistanceReadout currentDistance={0} maxDistance={500} />
);

/** Gear at exactly 100 % of its lifespan. */
export const FullyWorn = () => (
  <DistanceReadout currentDistance={500} maxDistance={500} />
);

/** Gear that has exceeded its recommended lifespan. */
export const Overdue = () => (
  <DistanceReadout currentDistance={600} maxDistance={500} />
);

/** Large numbers — verifies thousands separators and layout stability. */
export const LargeNumbers = () => (
  <DistanceReadout currentDistance={12345} maxDistance={20000} />
);
