import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, radii, spacing } from "@/styles/theme";
import { hexToRgba } from "@/utils/utils";

interface GlassCardProps extends ViewProps {
  /** Tint colour for the glass — applied at 0.7 opacity automatically. Defaults to white. */
  tintColor?: string;
}

export function GlassCard({ children, style, tintColor }: GlassCardProps) {
  const backgroundColor = hexToRgba(tintColor ?? "#FFFFFF", 0.7);

  return (
    <View
      style={[glassCardStyles.container, { backgroundColor }, style]}
    >
      {children}
    </View>
  );
}

const glassCardStyles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    padding: spacing.sm,
    // iOS shadow — subtle floating effect
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Android shadow
    elevation: 6,
  }
});