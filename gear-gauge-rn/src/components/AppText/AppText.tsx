import { Text, type TextProps, type StyleProp, type TextStyle } from "react-native";
import { typography } from "@/styles/theme";

/**
 * Applies Inter (the body font defined in theme.ts) automatically, so every
 * <Text> in the app inherits the correct typeface without repeating
 * fontFamily declarations. Pass additional styles via the `style` prop —
 * they merge on top of the default.
 */
export function AppText({ style, ...props }: TextProps) {
  return (
    <Text
      style={[{ fontFamily: typography.fontFamily.body }, style] as StyleProp<TextStyle>}
      {...props}
    />
  );
}
