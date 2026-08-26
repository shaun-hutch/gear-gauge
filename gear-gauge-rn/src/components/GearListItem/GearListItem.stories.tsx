import { GearType } from '@/models/GearType';
import { GearListItem } from './GearListItem';

export default {
  title: 'Components/GearListItem',
  component: GearListItem,
};

const defaultProps = {
  name: 'Specialized Tarmac SL7',
  currentDistance: 1000,
  maxDistance: 5000,
  type: GearType.Bicycle,
  isPrimary: true,
  onPress: () => {},
};

/** Default — primary bicycle in excellent health (0–29% used), as per the design mockup. */
export const Default = () => <GearListItem {...defaultProps} />;

/** Optimal — 30–59% of the replacement distance used (Info badge). */
export const Optimal = () => (
  <GearListItem
    {...defaultProps}
    currentDistance={2000}
  />
);

/** Shoes — non-primary item, so no blue star is rendered. */
export const Shoes = () => (
  <GearListItem
    {...defaultProps}
    name="Nike Pegasus 40"
    type={GearType.Shoes}
    isPrimary={false}
    currentDistance={420}
    maxDistance={800}
  />
);

/** Warning — gear approaching its replacement distance (60–89% used). */
export const Warning = () => (
  <GearListItem
    {...defaultProps}
    currentDistance={4000}
  />
);

/** Critical — gear past its replacement distance (90%+ used). */
export const Critical = () => (
  <GearListItem
    {...defaultProps}
    currentDistance={5200}
  />
);

/** Non-tappable — no chevron is rendered. */
export const NonTappable = () => (
  <GearListItem {...defaultProps} onPress={undefined} />
);

