import { HomeGauge } from "./HomeGauge";

export default {
  title: "Components/HomeGauge",
  component: HomeGauge,
};

/** Default — a partially used gear item (70 %). */
export const Default = () => <HomeGauge value={350} maxValue={500} />;

/** Brand-new gear with zero distance recorded. */
export const New = () => <HomeGauge value={0} maxValue={500} />;

/** Gear nearing its replacement threshold (90 %). */
export const NearlyWorn = () => <HomeGauge value={450} maxValue={500} />;

/** Gear at exactly 100 % of its lifespan. */
export const FullyWorn = () => <HomeGauge value={500} maxValue={500} />;

/** Gear that has exceeded its recommended lifespan (120 %). */
export const Overdue = () => <HomeGauge value={600} maxValue={500} />;

/** A different maxValue — e.g. cycling shoes with a longer lifespan. */
export const CyclingGear = () => <HomeGauge value={400} maxValue={1000} />;

/** Very small usage amount — verifies the gauge renders cleanly near zero. */
export const MinimalUse = () => <HomeGauge value={5} maxValue={500} />;
