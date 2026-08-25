import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, radii } from "@/styles/theme";
import { hexToRgba } from "@/utils/utils";
import { globalStyles } from "@/styles";

interface CardProps extends ViewProps {
  /** Tint colour for the card — applied at 0.7 opacity automatically. Defaults to white. */
  tintColor?: string;
}

export function Card({ children, style, tintColor }: CardProps) {
  const backgroundColor = hexToRgba(tintColor ?? "#FFFFFF", 0.7);

  return (
    <View
      style={[
        cardStyles.container,
        globalStyles.cardElevated,
        { backgroundColor, borderRadius: radii.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: hexToRgba(colors.secondaryContainer),
  }
});