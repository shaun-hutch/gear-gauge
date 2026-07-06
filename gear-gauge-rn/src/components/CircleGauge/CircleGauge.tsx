import { colors } from "@/styles/theme";
import Svg, { Circle } from "react-native-svg";

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
}

export function CircleGauge({ size, strokeWidth, color }: CircleGaugeProps) {
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={(size - strokeWidth) / 2}
        stroke={color || colors.primary}
        fill="none"
        strokeWidth={strokeWidth}
      />
    </Svg>
  )

}