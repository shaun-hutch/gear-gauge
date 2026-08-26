import { Status, getStatusFromPercentage } from './labels';

describe('getStatusFromPercentage', () => {
  it.each([
    [0, Status.Success],
    [15, Status.Success],
    [29.9, Status.Success],
    [30, Status.Info],
    [45, Status.Info],
    [59.9, Status.Info],
    [60, Status.Warning],
    [75, Status.Warning],
    [89.9, Status.Warning],
    [90, Status.Error],
    [100, Status.Error],
    [150, Status.Error], // over 100% stays critical
  ])('maps %p%% to %p', (percentage, expected) => {
    expect(getStatusFromPercentage(percentage)).toBe(expected);
  });
});
