import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, radii } from "@/styles/theme";
import { hexToRgba } from "@/utils/utils";
import { globalStyles } from "@/styles";

interface GlassCardProps extends ViewProps {
  /** Tint colour for the glass — applied at 0.7 opacity automatically. Defaults to white. */
  tintColor?: string;
}

export function GlassCard({ children, style, tintColor }: GlassCardProps) {
  const backgroundColor = hexToRgba(tintColor ?? "#FFFFFF", 0.7);

  return (
    <View
      style={[
        glassCardStyles.container,
        globalStyles.cardElevated,
        { backgroundColor, borderRadius: radii.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const glassCardStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: hexToRgba(colors.secondaryContainer),
  }
});