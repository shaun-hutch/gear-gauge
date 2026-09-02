import { GearType } from "@/models/GearType";
import { GearHeading } from "./GearHeading";

export default {
  title: "Components/GearHeading",
  component: GearHeading,
};

/** Default — running shoes. */
export const Shoes = () => (
  <GearHeading name="Nike Pegasus 40" type={GearType.Shoes} />
);

/** A bicycle. */
export const Bicycle = () => (
  <GearHeading name="Specialized Tarmac SL7" type={GearType.Bicycle} />
);

/** Long gear name — verifies single-line truncation. */
export const LongName = () => (
  <GearHeading
    name="Specialized S-Works Aethos Dura-Ace Di2"
    type={GearType.Bicycle}
  />
);
