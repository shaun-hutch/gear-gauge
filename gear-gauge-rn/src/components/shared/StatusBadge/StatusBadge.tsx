import { View } from "react-native";
import { AppText } from "../AppText/AppText";
import { globalStyles } from "@/styles/globalStyles";
import { Status, statusLabels } from "@/utils/labels";

export type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[globalStyles.statusChip, chipStyles(status)]}>
      <AppText style={[globalStyles.typography.labelSmall, { textAlign: "center" }]}>
        {statusLabels[status]}
      </AppText>
    </View>
  )
}

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