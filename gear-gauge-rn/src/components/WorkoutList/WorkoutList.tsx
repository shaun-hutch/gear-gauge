import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useWorkoutsContext } from "@/context/WorkoutProvider";
import { spacing } from "@/styles/theme";
import { WorkoutListItem } from "../WorkoutListItem/WorkoutListItem";
import { AppText } from "../shared";
import { typographyStyles } from "@/styles/typography";
import { colors } from "@/styles/theme";

interface WorkoutListProps {
  recent?: boolean;
}

export function WorkoutList({ recent = false }: WorkoutListProps) {
  const { workouts, isLoading } = useWorkoutsContext();

  // if recent we just want the 3 most recent
  const displayedWorkouts = recent ? workouts.slice(0, 3) : workouts;

  return (
    <View style={styles.container}>
      {!isLoading &&
        <>
          {recent && (
            <View style={styles.recentContainer}>
              <AppText style={typographyStyles.headlineMedium}>Recent Workouts</AppText>
              <TouchableOpacity onPress={() => {
                // Handle "See All" press
              }}>
                <AppText style={styles.seeAll}>See All</AppText>
              </TouchableOpacity>
            </View>
          )}
          {displayedWorkouts.map((workout) => (
            <WorkoutListItem
              key={workout.id}
              distance={workout.totalDistance.toFixed(1)}
              date={workout.startDate}
              type={workout.workoutType}
            />
          ))}
        </>
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  recentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    ...typographyStyles.caption,
    color: colors.primary,
  }
});