import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/shared";
import { Card } from "@/components/shared/Card/Card";
import { HomeGauge } from "@/components/HomeGauge/HomeGauge";
import { useGearContext } from "@/context/GearProvider";
import { getGearTypeMeta } from "@/models/GearType";
import { typographyStyles } from "@/styles/typography";
import { colors, spacing, typography } from "@/styles/theme";
import { formatNumber } from "@/utils/utils";

/**
 * Home — showcases the user's primary gear with a large usage gauge, name and
 * a travelled-vs-remaining distance readout (see design/gear-gauge-light-mode.html).
 */
export default function Index() {
  const { primaryGear, isLoading, error } = useGearContext();

  const remainingKm = primaryGear
    ? Math.max(primaryGear.maxDistance - primaryGear.currentDistance, 0)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error ? (
          <Card style={styles.card}>
            <AppText style={typographyStyles.body}>{error}</AppText>
          </Card>
        ) : !primaryGear ? (
          <Card style={styles.card}>
            <AppText style={typographyStyles.body}>
              No primary gear yet. Add your first pair of shoes or bicycle to
              get started — your most-used gear will be highlighted here.
            </AppText>
          </Card>
        ) : (
          <>
            {/* Gear name + type */}
            <View style={styles.heading}>
              <AppText style={styles.kicker}>Active gear</AppText>
              <AppText
                style={typographyStyles.headlineMedium}
                numberOfLines={1}
              >
                {primaryGear.name}
              </AppText>
              <AppText style={typographyStyles.caption}>
                {getGearTypeMeta(primaryGear.type).displayName}
              </AppText>
            </View>

            {/* Hero gauge */}
            <HomeGauge
              value={primaryGear.currentDistance}
              maxValue={primaryGear.maxDistance}
            />

            {/* Distance travelled vs remaining */}
            <Card style={styles.metrics}>
              <View style={styles.metric}>
                <AppText style={typographyStyles.labelSmall}>
                  Distance travelled
                </AppText>
                <AppText style={styles.metricValue}>
                  {formatNumber(primaryGear.currentDistance)}
                  <AppText style={styles.metricSuffix}>
                    {" / "}
                    {formatNumber(primaryGear.maxDistance)} km
                  </AppText>
                </AppText>
              </View>

              <View style={styles.divider} />

              <View style={styles.remainingColumn}>
                <AppText style={typographyStyles.labelSmall}>Remaining</AppText>
                <AppText style={styles.remainingValue}>
                  {formatNumber(remainingKm)} km
                </AppText>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  center: {
    alignItems: "center",
    paddingTop: spacing.xxl,
  },
  card: {
    padding: spacing.sm,
  },
  heading: {
    alignItems: "center",
    gap: spacing.xs,
  },
  kicker: {
    ...typographyStyles.labelSmall,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
  },
  metrics: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    gap: spacing.xs,
  },
  metricValue: {
    ...typographyStyles.headlineLarge,
  },
  metricSuffix: {
    ...typographyStyles.caption,
    fontFamily: typography.fontFamily.mono,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.secondaryContainer,
  },
  remainingColumn: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  remainingValue: {
    ...typographyStyles.headlineLarge,
    color: colors.secondary,
  },
});
