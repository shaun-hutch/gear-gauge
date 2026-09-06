import { WorkoutType } from '@/models/WorkoutType';
import { WorkoutListItem } from './WorkoutListItem';

export default {
  title: 'Components/WorkoutListItem',
  component: WorkoutListItem,
};

// Fixed date far enough in the past that `formatDateString` renders an
// absolute date ("Aug 01, 2026") rather than a relative "X days ago" string.
const defaultProps = {
  distance: '5.2',
  date: '2026-08-01T07:30:00.000Z',
  type: WorkoutType.OutdoorRun,
};

/** Default — an outdoor run with its SF Symbol, distance and date. */
export const OutdoorRun = () => <WorkoutListItem {...defaultProps} />;

/** Indoor run — uses the treadmill variant icon. */
export const IndoorRun = () => (
  <WorkoutListItem
    {...defaultProps}
    type={WorkoutType.IndoorRun}
  />
);

/** Outdoor walk. */
export const OutdoorWalk = () => (
  <WorkoutListItem
    {...defaultProps}
    type={WorkoutType.OutdoorWalk}
  />
);

/** Outdoor cycle. */
export const OutdoorCycle = () => (
  <WorkoutListItem
    {...defaultProps}
    distance="42.1"
    type={WorkoutType.OutdoorCycle}
  />
);

/** Other — fallback chevron icon for unrecognised workout types. */
export const Other = () => (
  <WorkoutListItem
    {...defaultProps}
    type={WorkoutType.Other}
  />
);

/** Long distance — edge-case copy to verify layout doesn't break. */
export const LongDistance = () => (
  <WorkoutListItem
    {...defaultProps}
    distance="1,234.5"
  />
);

/** Single associated gear item — shows its wear increment. */
export const SingleGearWear = () => (
  <WorkoutListItem
    {...defaultProps}
  />
);
