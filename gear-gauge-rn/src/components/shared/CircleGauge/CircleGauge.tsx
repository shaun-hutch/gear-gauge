import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/styles/theme";
import Svg, { Circle, Defs, FeDropShadow, Filter } from "react-native-svg";
import { StyleSheet, View } from "react-native";
import { ReactNode, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircleGaugeProps {
  /** The current value to display on the gauge. */
  value?: number;
  /** The maximum value of the gauge. */
  maxValue?: number;
  /** The size (diameter) of the gauge in pixels. */
  size: number;
  /** The width of the gauge stroke in pixels. */
  strokeWidth: number;
  /** The color of the gauge stroke. */
  color?: string;
  /** Optional background ring colour — defaults to theme secondaryLight. Pass `"transparent"` to hide. */
  trackColor?: string;
  /** Content to render inside the center of the gauge. */
  children?: ReactNode;
  /** When true, animates the gauge fill from empty to the current value on mount/change. */
  animated?: boolean;
}

/** Extra padding so the SVG drop shadow isn't clipped at the edges. */
const SHADOW_PADDING = 8;

export function CircleGauge({
  size,
  strokeWidth,
  color,
  trackColor = colors.secondaryLight,
  value = 100,
  maxValue = 100,
  children,
  animated = false,
}: CircleGaugeProps) {
  const svgSize = size + SHADOW_PADDING * 2;
  const center = svgSize / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const fraction = Math.min(value / maxValue, 1);
  const offset = circumference * (1 - fraction);

  // --- Animated stroke dash offset ---
  const animatedOffset = useSharedValue(animated ? circumference : offset);

  useEffect(() => {
    if (animated) {
      animatedOffset.value = withTiming(offset, { duration: 800 });
    } else {
      animatedOffset.value = offset;
    }
  }, [animated, offset, animatedOffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  // Shared SVG circle props (everything except the animated attribute)
  const circleProps = {
    cx: center,
    cy: center,
    r: radius,
    stroke: color || colors.primary,
    fill: "none" as const,
    strokeWidth,
    strokeDasharray: circumference,
    transform: `rotate(-90 ${center} ${center})`,
    strokeLinecap: "round" as const,
    filter: "url(#ringShadow)",
  };

  return (
    <View style={{ width: svgSize, height: svgSize, margin: 4 }}>
      {/* SVG is slightly larger than the visual ring to accommodate the drop shadow */}
      <Svg width={svgSize} height={svgSize}>
        <Defs>
          <Filter id="ringShadow">
            <FeDropShadow dx={0} dy={2} stdDeviation={2} floodColor={colors.black} floodOpacity={0.7} />
          </Filter>
        </Defs>
        {/* Background track — a full ring behind the progress arc */}
        {trackColor !== "transparent" && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
        {animated ? (
          <AnimatedCircle animatedProps={animatedProps} {...circleProps} />
        ) : (
          <Circle strokeDashoffset={offset} {...circleProps} />
        )}
      </Svg>
      {children && (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  childrenContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
});