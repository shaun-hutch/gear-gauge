import { useWindowDimensions } from "react-native";
import { AppText, CircleGauge } from "../shared";

interface HomeGaugeProps {
  value: number;
  maxValue: number;
}

export function HomeGauge(props: HomeGaugeProps) {
  // Use the smaller screen dimension so the gauge fits regardless of orientation.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const gaugeSize = Math.min(screenWidth, screenHeight) - 100;

  const percentage = Math.round((props.value / props.maxValue) * 100);


  return (
    <CircleGauge
      size={gaugeSize}
      strokeWidth={35}
      value={props.value}
      maxValue={props.maxValue}
      animated
    >
      <AppText style={{ fontSize: 24, fontWeight: "bold" }}>
        {percentage}%
      </AppText>
      <AppText style={{ fontSize: 16, color: "#666" }}>
        Life Used
      </AppText>
    </CircleGauge>
  )
}

export default HomeGauge;