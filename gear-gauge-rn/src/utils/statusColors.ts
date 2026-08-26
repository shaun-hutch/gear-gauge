import { colors } from "@/styles/theme";
import { Status } from "@/utils/labels";

/**
 * Semantic colour helpers shared between the StatusBadge and the CircleGauge
 * so condition styling stays consistent wherever a Status is rendered.
 */

/** Strong accent colour per status — used for badge text and gauge strokes. */
export function getStatusColor(status: Status): string {
  switch (status) {
    case Status.Success:
      return colors.success;
    case Status.Error:
      return colors.error;
    case Status.Warning:
      return colors.warning;
    default:
      return colors.info;
  }
}

/** Soft surface tint per status — used for badge backgrounds and gauge tracks. */
export function getStatusSurfaceColor(status: Status): string {
  switch (status) {
    case Status.Success:
      return colors.successSurface;
    case Status.Error:
      return colors.errorSurface;
    case Status.Warning:
      return colors.warningSurface;
    default:
      return colors.infoSurface;
  }
}
