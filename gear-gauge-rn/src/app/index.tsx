import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DistanceReadout } from "@/components/DistanceReadout/DistanceReadout";
import { ErrorCard } from "@/components/ErrorCard/ErrorCard";
import { GearHeading } from "@/components/GearHeading/GearHeading";
import { HomeGauge } from "@/components/HomeGauge/HomeGauge";
import { NoPrimaryGearCard } from "@/components/NoPrimaryGearCard/NoPrimaryGearCard";
import { useGearContext } from "@/context/GearProvider";
import { colors, spacing } from "@/styles/theme";
import WorkoutListItem from "@/components/WorkoutListItem/WorkoutListItem";
import { WorkoutType } from "@/models/WorkoutType";

/**
 * Home — showcases the user's primary gear with a large usage gauge, name and
 * a travelled-vs-remaining distance readout (see design/gear-gauge-light-mode.html).
 */
export default function Index() {
  const { primaryGear, isLoading, error } = useGearContext();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <>
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : error ? (
            <ErrorCard message={error} />
          ) : !primaryGear ? (
            <NoPrimaryGearCard />
          ) : (
            <>
              {/* Gear name + type */}
              <GearHeading name={primaryGear.name} type={primaryGear.type} />

              {/* Hero gauge */}
              <HomeGauge
                value={primaryGear.currentDistance}
                maxValue={primaryGear.maxDistance}
              />

              {/* Distance travelled vs remaining */}
              <DistanceReadout
                currentDistance={primaryGear.currentDistance}
                maxDistance={primaryGear.maxDistance}
              />
            </>
          )}
        <WorkoutListItem distance="4.6" date="2024-06-01T07:30:00Z" type={WorkoutType.IndoorRun} />
        </>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  center: {
    alignItems: "center",
    paddingTop: spacing.xxl,
  },
});
