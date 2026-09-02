import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/shared";
import { GearType, getGearTypeMeta } from "@/models/GearType";
import { typographyStyles } from "@/styles/typography";
import { colors, spacing } from "@/styles/theme";

interface GearHeadingProps {
  /** User-facing name for the gear item. */
  name: string;
  /** Category of gear (shoes, bicycle, etc.). */
  type: GearType;
}

/** Gear name + type — the "Active gear" header shown on the home screen. */
export function GearHeading({ name, type }: GearHeadingProps) {
  return (
    <View style={styles.heading}>
      <AppText style={styles.kicker}>Active gear</AppText>
      <AppText style={typographyStyles.headlineMedium} numberOfLines={1}>
        {name}
      </AppText>
      <AppText style={typographyStyles.caption}>
        {getGearTypeMeta(type).displayName}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: "center",
    gap: spacing.xs,
  },
  kicker: {
    ...typographyStyles.labelSmall,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
  },
});

export default GearHeading;
