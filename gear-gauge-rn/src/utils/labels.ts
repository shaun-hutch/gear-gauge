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

/**
 * Derives a gear's condition status from its usage percentage.
 *
 *   0–29%    → Success  (excellent)
 *  30–59%    → Info     (optimal)
 *  60–89%    → Warning  (moderate)
 *  90–100%+  → Error    (critical: replace — values over 100 stay critical)
 */
export function getStatusFromPercentage(percentage: number): Status {
  if (percentage < 30) {
    return Status.Success;
  }
  if (percentage < 60) {
    return Status.Info;
  }
  if (percentage < 90) {
    return Status.Warning;
  }
  return Status.Error;
}
