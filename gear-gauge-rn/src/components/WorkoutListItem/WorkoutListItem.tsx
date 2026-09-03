import { StyleSheet, View } from "react-native";

import { getWorkoutTypeMeta, WorkoutType } from "@/models/WorkoutType";
import { Card } from "../shared/Card/Card";
import { SFSymbol, SymbolView } from "expo-symbols";
import { colors } from "@/styles/theme";
import { AppText } from "../shared";
import { typographyStyles } from "@/styles/typography";
import { formatDateString } from "@/utils/helpers";

interface WorkoutListItemProps {
  distance: string;
  date: string;
  type: WorkoutType;
}

export function WorkoutListItem({ distance, date, type }: WorkoutListItemProps) {
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
        <AppText style={typographyStyles.labelMedium}>{displayName}</AppText>
        <AppText style={typographyStyles.labelSmall}>{distance} • {formatDateString(date)}</AppText>
      </View>


      <View style={styles.detailLabels}>
      </View>
    </Card>
  );

}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleLabels: {
    flexDirection: "column",
  },
  detailLabels: {
    flexDirection: "column",
  },
  iconContainer: {
    marginRight: 12,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 8,
    padding: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
});

export default WorkoutListItem;