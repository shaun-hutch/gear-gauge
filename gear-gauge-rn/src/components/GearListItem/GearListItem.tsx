import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView, type SFSymbol } from "expo-symbols";

import { GearType, getGearTypeMeta } from "@/models/GearType";
import { AppText, Card, CircleGauge, StatusBadge } from "../shared";
import { buildAccessibilityLabel } from "@/utils/accessibility";
import { getStatusFromPercentage, statusLabels } from "@/utils/labels";
import { formatNumber } from "@/utils/utils";
import { getStatusColor, getStatusSurfaceColor } from "@/utils/statusColors";
import { colors, spacing, typography } from "@/styles/theme";
import { typographyStyles } from "@/styles/typography";

interface GearListItemProps {
  name: string;
  currentDistance: number;
  type: GearType;
  maxDistance: number;
  /** Marks this gear as the user's primary item — renders a blue star next to the name. */
  isPrimary?: boolean;
  onPress?: () => void;
}

export function GearListItem({
  name,
  currentDistance,
  type,
  maxDistance,
  isPrimary = false,
  onPress,
}: GearListItemProps) {
  const gearIcon = getGearTypeMeta(type).displayIcon;

  // Condition is derived from the percentage of the replacement distance used.
  const status = getStatusFromPercentage((currentDistance / maxDistance) * 100);

  // Combine the row's text into a single screen-reader announcement.
  const accessibilityLabel = buildAccessibilityLabel(
    name,
    `${formatNumber(currentDistance)} of ${formatNumber(maxDistance)} kilometres`,
    statusLabels[status],
  );

  return (
    <Card>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={onPress ? "Opens gear details" : undefined}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        {/* Circular usage gauge with the gear-type SF Symbol in its centre */}
        <CircleGauge
          size={56}
          strokeWidth={6}
          value={currentDistance}
          maxValue={maxDistance}
          color={getStatusColor(status)}
          trackColor={getStatusSurfaceColor(status)}
          showZeroSliver
        >
          <SymbolView
            name={{ ios: gearIcon as SFSymbol }}
            size={26}
            tintColor={getStatusColor(status)}
          />
        </CircleGauge>

        {/* Name + primary star, distance and condition badge */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <AppText style={styles.name} numberOfLines={1}>
              {name}
            </AppText>
            {isPrimary && (
              <SymbolView
                name={{ ios: "star.fill" }}
                tintColor={colors.tertiary}
                weight='medium'
              />
            )}
          </View>

          <AppText style={styles.distance}>
            {formatNumber(currentDistance)} / {formatNumber(maxDistance)} km
          </AppText>

          <StatusBadge status={status} compact />
        </View>

        {/* Chevron affordance — only shown when the row is tappable */}
        {onPress ? (
          <SymbolView
            name={{ ios: "chevron.right" }}
            size={18}
            tintColor={colors.secondary}
          />
        ) : null}
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: spacing.unit,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  name: {
    ...typographyStyles.body,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontWeight: '600',
    flexShrink: 1,
  },
  distance: {
    ...typographyStyles.caption,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default GearListItem;