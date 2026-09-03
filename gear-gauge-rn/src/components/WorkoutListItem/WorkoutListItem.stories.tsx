import { WorkoutType } from '@/models/WorkoutType';
import { WorkoutListItem } from './WorkoutListItem';

export default {
  title: 'Components/WorkoutListItem',
  component: WorkoutListItem,
};

// Fixed date far enough in the past that `formatDateString` renders an
// absolute date ("Aug 01, 2026") rather than a relative "X days ago" string.
const defaultProps = {
  name: 'Morning Run',
  distance: '5.2 km',
  date: '2026-08-01T07:30:00.000Z',
  type: WorkoutType.OutdoorRun,
};

/** Default — an outdoor run with its SF Symbol, distance and date. */
export const OutdoorRun = () => <WorkoutListItem {...defaultProps} />;

/** Indoor run — uses the treadmill variant icon. */
export const IndoorRun = () => (
  <WorkoutListItem
    {...defaultProps}
    name="Treadmill Session"
    type={WorkoutType.IndoorRun}
  />
);

/** Outdoor walk. */
export const OutdoorWalk = () => (
  <WorkoutListItem
    {...defaultProps}
    name="Evening Walk"
    type={WorkoutType.OutdoorWalk}
  />
);

/** Outdoor cycle. */
export const OutdoorCycle = () => (
  <WorkoutListItem
    {...defaultProps}
    name="Road Ride"
    distance="42.1 km"
    type={WorkoutType.OutdoorCycle}
  />
);

/** Other — fallback chevron icon for unrecognised workout types. */
export const Other = () => (
  <WorkoutListItem
    {...defaultProps}
    name="Mixed Activity"
    type={WorkoutType.Other}
  />
);

/** Long distance — edge-case copy to verify layout doesn't break. */
export const LongDistance = () => (
  <WorkoutListItem
    {...defaultProps}
    name="Ultra Endurance Ride"
    distance="1,234.5 km"
  />
);
