import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/styles/theme";
import Svg, { Circle, Defs, FeDropShadow, Filter } from "react-native-svg";
import { StyleSheet, View } from "react-native";
import { ReactNode } from "react";

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
  /** Content to render inside the center of the gauge. */
  children?: ReactNode;
}

/** Extra padding so the SVG drop shadow isn't clipped at the edges. */
const SHADOW_PADDING = 8;

export function CircleGauge({ size, strokeWidth, color, value = 100, maxValue = 100, children }: CircleGaugeProps) {
  const svgSize = size + SHADOW_PADDING * 2;
  const center = svgSize / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const fraction = Math.min(value / maxValue, 1);
  const offset = circumference * (1 - fraction);

  return (
    <View style={{ width: svgSize, height: svgSize, margin: 4 }}>
      {/* SVG is slightly larger than the visual ring to accommodate the drop shadow */}
      <Svg width={svgSize} height={svgSize}>
        <Defs>
          <Filter id="ringShadow">
            <FeDropShadow dx={0} dy={2} stdDeviation={2} floodColor={colors.black} floodOpacity={0.7} />
          </Filter>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color || colors.primary}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          strokeLinecap="round"
          filter="url(#ringShadow)"
        />
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