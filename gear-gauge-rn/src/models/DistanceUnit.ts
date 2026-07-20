/**
 * DistanceUnit — the unit of measurement for distances displayed in the app.
 * Stored as a user preference and used for all distance conversions.
 */
export enum DistanceUnit {
  Km = 'km',
  Mi = 'mi',
}

/** 1 mile = 1.609344 kilometres (international standard). */
const KM_PER_MILE = 1.609344;

/** Convert kilometres to miles. */
export function convertKmToMi(km: number): number {
  return km / KM_PER_MILE;
}

/** Convert miles to kilometres. */
export function convertMiToKm(mi: number): number {
  return mi * KM_PER_MILE;
}

/**
 * Generic distance conversion between any two units.
 * Returns the same value when `from` and `to` are identical.
 */
export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  return from === DistanceUnit.Km ? convertKmToMi(value) : convertMiToKm(value);
}
