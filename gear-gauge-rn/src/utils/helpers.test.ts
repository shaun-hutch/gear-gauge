import { FormatDateString } from './helpers';

describe('FormatDateString', () => {
  // Freeze "now" so the relative-date logic is deterministic.
  const now = new Date('2026-09-03T12:00:00');

  beforeEach(() => {
    jest.useFakeTimers({ now });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const daysAgo = (days: number): Date => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };

  it('returns "Today" for the current date', () => {
    expect(FormatDateString(new Date(now))).toBe('Today');
  });

  it('returns "1 day ago" for yesterday', () => {
    expect(FormatDateString(daysAgo(1))).toBe('1 day ago');
  });

  it.each([2, 3, 4, 5, 6])('returns "%s days ago" for %s days ago', (days) => {
    expect(FormatDateString(daysAgo(days))).toBe(`${days} days ago`);
  });

  it('formats older dates using the device locale', () => {
    const date = daysAgo(30);
    const expected = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
    expect(FormatDateString(date)).toBe(expected);
  });

  it('formats future dates using the device locale', () => {
    const date = new Date(now);
    date.setDate(date.getDate() + 10);
    const expected = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
    expect(FormatDateString(date)).toBe(expected);
  });

  it('returns an empty string when no date is provided', () => {
    expect(FormatDateString(undefined as unknown as Date)).toBe('');
  });
});
