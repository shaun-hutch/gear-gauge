import { StyleSheet, View } from "react-native";

import { getWorkoutTypeMeta, WorkoutType } from "@/models/WorkoutType";
import { Card } from "../shared/Card/Card";
import { SFSymbol, SymbolView } from "expo-symbols";
import { colors } from "@/styles/theme";
import { AppText } from "../shared";
import { typographyStyles } from "@/styles/typography";

interface WorkoutListItemProps {
  name: string;
  distance: string;
  date: string;
  type: WorkoutType;
}

export function WorkoutListItem({ name, distance, date, type }: WorkoutListItemProps) {
  const { displayName, displayIcon } = getWorkoutTypeMeta(type); 

  // format date to be today/yesterday/2/3 days ago, or just the date if older than 7 days
  // ...
  

  return (
    <Card style={styles.card}>
      <SymbolView
        name={{ ios: displayIcon as SFSymbol }}
        tintColor={colors.primary}
      />
      <View style={styles.titleLabels}>
        <AppText style={typographyStyles.labelMedium}>{displayName}</AppText>
        <AppText style={typographyStyles.labelSmall}>{distance} • {date}</AppText>
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
});

export default WorkoutListItem;