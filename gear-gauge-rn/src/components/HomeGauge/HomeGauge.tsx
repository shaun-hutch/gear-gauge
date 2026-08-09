import { useWindowDimensions, View } from "react-native";
import { AppText, CircleGauge } from "../shared";
import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/styles/theme";

interface HomeGaugeProps {
  value: number;
  maxValue: number;
}

export function HomeGauge(props: HomeGaugeProps) {
  // Use the smaller screen dimension so the gauge fits regardless of orientation.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const gaugeSize = Math.min(screenWidth, screenHeight) - 100;

  const percentage = Math.round((props.value / props.maxValue) * 100);


  // Horizontal centering only — the gauge's vertical position is left to the
  // parent screen rather than force-centered here.
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
      <CircleGauge
        size={gaugeSize}
        strokeWidth={35}
        value={props.value}
        maxValue={props.maxValue}
        animated
      >
        {/* headlineLarge ships lineHeight 32 (for its default 24px size); when
            bumping fontSize to 48 we must raise lineHeight too, otherwise iOS
            clips the tall glyphs (the %) at the top and bottom. */}
        <AppText style={{ ...globalStyles.typography.headlineLarge, fontSize: 48, lineHeight: 56, textAlign: "center", color: colors.primary }}>
          {percentage}%
        </AppText>
        <AppText style={{ ...globalStyles.typography.bodyLarge, color: colors.primary }}>
          Life Used
        </AppText>
      </CircleGauge>
    </View>
  )
}

export default HomeGauge;