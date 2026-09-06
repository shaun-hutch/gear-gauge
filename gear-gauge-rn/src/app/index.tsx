import { useCallback, useRef } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { DistanceReadout } from "@/components/DistanceReadout/DistanceReadout";
import { ErrorCard } from "@/components/ErrorCard/ErrorCard";
import { GearHeading } from "@/components/GearHeading/GearHeading";
import { HomeGauge } from "@/components/HomeGauge/HomeGauge";
import { NoPrimaryGearCard } from "@/components/NoPrimaryGearCard/NoPrimaryGearCard";
import { useGearContext } from "@/context/GearProvider";
import { colors, spacing } from "@/styles/theme";
import { WorkoutList } from "@/components/WorkoutList/WorkoutList";

/**
 * Home — showcases the user's primary gear with a large usage gauge, name and
 * a travelled-vs-remaining distance readout (see design/gear-gauge-light-mode.html).
 */
export default function Index() {
  const { primaryGear, isLoading, error } = useGearContext();
  const scrollRef = useRef<ScrollView>(null);

  // Reset scroll to the top whenever the Home tab regains focus, so returning
  // from another tab (e.g. History via "See All") doesn't leave the user mid-scroll.
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
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
          {/* Workout list */}
          <WorkoutList recent />
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
