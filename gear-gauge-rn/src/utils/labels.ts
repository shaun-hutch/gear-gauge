/**
 * Status enum and UI labels for the StatusBadge component.
 *
 * Extracted here as a stepping stone toward proper i18n.
 * When localisation infrastructure is added (e.g. expo-localization +
 * i18n-js), replace the labels record with localised string lookups.
 */

/** Severity level for gear condition indicator badges. */
export enum Status {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info",
}

export const statusLabels: Record<Status, string> = {
  [Status.Success]: "EXCELLENT HEALTH",
  [Status.Error]: "CRITICAL: REPLACE",
  [Status.Warning]: "MODERATE WEAR",
  [Status.Info]: "OPTIMAL",
};
