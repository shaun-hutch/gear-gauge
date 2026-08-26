import { View } from "react-native";
import { AppText } from "../AppText/AppText";
import { globalStyles } from "@/styles/globalStyles";
import { Status, statusLabels } from "@/utils/labels";
import { getStatusColor } from "@/utils/statusColors";

export type StatusBadgeProps = {
  status: Status;
  /** Renders a compact, content-sized pill for use inside list rows. */
  compact?: boolean;
};

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  return (
    <View style={[globalStyles.statusChip, chipStyles(status), compact && globalStyles.statusChipCompact]}>
      <AppText
        style={[
          globalStyles.typography.labelSmall,
          { color: getStatusColor(status), textAlign: "center" },
        ]}
      >
        {statusLabels[status]}
      </AppText>
    </View>
  );
}

/** Background style per status (semantic surface colour). */
const chipStyles = (status: Status) => {
  switch (status) {
    case Status.Success:
      return globalStyles.statusChipSuccess;
    case Status.Error:
      return globalStyles.statusChipError;
    case Status.Warning:
      return globalStyles.statusChipWarning;
    default:
    case Status.Info:
      return globalStyles.statusChipInfo;
  }
};