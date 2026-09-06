import { buildAccessibilityLabel } from './accessibility';

describe('buildAccessibilityLabel', () => {
  it('joins string parts with a comma separator', () => {
    expect(
      buildAccessibilityLabel('Outdoor Run', '2 days ago', '5.2 km'),
    ).toBe('Outdoor Run, 2 days ago, 5.2 km');
  });

  it('coerces numbers to strings', () => {
    expect(buildAccessibilityLabel('Distance', 5.2)).toBe('Distance, 5.2');
  });

  it('skips null and undefined parts', () => {
    expect(
      buildAccessibilityLabel('Outdoor Run', null, undefined, '5.2 km'),
    ).toBe('Outdoor Run, 5.2 km');
  });

  it('skips empty and whitespace-only strings', () => {
    expect(buildAccessibilityLabel('A', '', '   ', 'B')).toBe('A, B');
  });

  it('trims surrounding whitespace from parts', () => {
    expect(buildAccessibilityLabel('  Outdoor Run  ', '5.2 km')).toBe(
      'Outdoor Run, 5.2 km',
    );
  });

  it('keeps zero as a valid numeric part', () => {
    expect(buildAccessibilityLabel('Distance', 0)).toBe('Distance, 0');
  });

  it('returns an empty string when there are no parts', () => {
    expect(buildAccessibilityLabel()).toBe('');
  });
});
