import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useWorkoutsContext } from "@/context/WorkoutProvider";
import { spacing, colors } from "@/styles/theme";
import { WorkoutListItem } from "../WorkoutListItem/WorkoutListItem";
import { AppText, Card } from "../shared";
import { typographyStyles } from "@/styles/typography";

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
              {/* Navigate to the History tab; `asChild` passes link props to the TouchableOpacity */}
              <Link href="/history" asChild>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="See all workouts"
                  accessibilityHint="Shows your full workout history"
                >
                  <AppText style={styles.seeAll}>See All</AppText>
                </TouchableOpacity>
              </Link>
            </View>
          )}
          {workouts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <AppText style={typographyStyles.body}>
                No workouts synced yet. Connect HealthKit in Settings to get started.
              </AppText>
            </Card>
          ) : (
            displayedWorkouts.map((workout) => (
              <WorkoutListItem
                key={workout.id}
                distance={workout.totalDistance.toFixed(1)}
                date={workout.startDate}
                type={workout.workoutType}
              />
            ))
          )}
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
  },
  emptyCard: {
    padding: spacing.sm,
  },
});