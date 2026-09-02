import { StyleSheet, View } from "react-native";

import { AppText, Card } from "@/components/shared";
import { typographyStyles } from "@/styles/typography";
import { colors, spacing, typography } from "@/styles/theme";
import { formatNumber } from "@/utils/utils";

interface DistanceReadoutProps {
  /** Current cumulative distance travelled, in kilometres. */
  currentDistance: number;
  /** Maximum recommended distance before replacement, in kilometres. */
  maxDistance: number;
}

/**
 * Distance travelled vs remaining — the side-by-side metric readout shown
 * beneath the hero gauge on the home screen.
 */
export function DistanceReadout({
  currentDistance,
  maxDistance,
}: DistanceReadoutProps) {
  const remainingKm = Math.max(maxDistance - currentDistance, 0);

  return (
    <Card style={styles.metrics}>
      <View style={styles.metric}>
        <AppText style={typographyStyles.caption}>
          Distance travelled
        </AppText>
        <AppText style={styles.metricValue}>
          {formatNumber(currentDistance)}
          <AppText style={styles.metricSuffix}>
            {" / "}
            {formatNumber(maxDistance)} km
          </AppText>
        </AppText>
      </View>

      <View style={styles.divider} />

      <View style={styles.remainingColumn}>
        <AppText style={typographyStyles.caption}>Remaining</AppText>
        <AppText style={styles.remainingValue}>
          {formatNumber(remainingKm)} km
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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

export default DistanceReadout;
