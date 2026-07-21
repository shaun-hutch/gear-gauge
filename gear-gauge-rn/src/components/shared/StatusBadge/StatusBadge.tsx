import { View } from "react-native";
import { AppText } from "../AppText/AppText";
import { globalStyles } from "@/styles/globalStyles";

export enum Status {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info",
}

export const StatusLabels = {
  [Status.Success]: "EXCELLENT HEALTH",
  [Status.Error]: "CRITICAL: REPLACE",
  [Status.Warning]: "MODERATE WEAR",
  [Status.Info]: "OPTIMAL",
};

export type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[globalStyles.statusChip, chipStyles(status)]}>
      <AppText style={[globalStyles.labelSmall, { textAlign: "center" }]}>
        {StatusLabels[status]}
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