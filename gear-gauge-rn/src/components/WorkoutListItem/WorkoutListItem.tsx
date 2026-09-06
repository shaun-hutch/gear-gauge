import { StyleSheet, View } from "react-native";

import { getWorkoutTypeMeta, type WorkoutType } from "@/models";
import { Card } from "../shared/Card/Card";
import { SFSymbol, SymbolView } from "expo-symbols";
import { colors, radii, sizing, spacing, typography } from "@/styles/theme";
import { AppText } from "../shared";
import { typographyStyles } from "@/styles/typography";
import { formatDateString } from "@/utils/helpers";

interface WorkoutListItemProps {
  distance: string;
  date: string;
  type: WorkoutType;
}

export function WorkoutListItem({
  distance,
  date,
  type,
}: WorkoutListItemProps) {
  const { displayName, displayIcon } = getWorkoutTypeMeta(type, false); 

  

  return (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <SymbolView
          name={{ ios: displayIcon as SFSymbol }}
          tintColor={colors.primary}
          style={styles.icon}
        />
      </View>
      <View style={styles.titleLabels}>
        <AppText style={styles.displayName}>{displayName}</AppText>
        <AppText style={typographyStyles.caption}>{formatDateString(date)}</AppText>
      </View>
      <View style={styles.secondaryLabel}>
        <AppText style={typographyStyles.body}>{distance} km</AppText>
      </View>
    </Card>
  );

}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    // Tighter than the Card default (16pt) — matches the design's 12pt card padding.
    padding: spacing.sm - spacing.unit,
  },
  titleLabels: {
    flex: 1,
    flexDirection: "column",
  },
  secondaryLabel: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  displayName: {
    ...typographyStyles.bodyLarge,
    fontFamily: typography.fontFamily.bodyBold,
    fontWeight: "700",
  },
  iconContainer: {
    width: spacing.xxl,
    height: spacing.xxl,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: sizing.icon,
    height: sizing.icon,
  },
});

export default WorkoutListItem;