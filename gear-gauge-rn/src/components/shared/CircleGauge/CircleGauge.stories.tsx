import { colors } from "@/styles";
import { CircleGauge } from "./CircleGauge";
import { AppText } from "../AppText/AppText";
import { SymbolView } from "expo-symbols";

export default {
  title: "Components/CircleGauge",
  component: CircleGauge,
};

export const Default = () => (
  <CircleGauge
    value={100}
    maxValue={100}
    size={200}
    strokeWidth={20} />
);

export const HalfFilled = () => (
  <CircleGauge
    value={50}
    maxValue={100}
    size={200}
    strokeWidth={20} />
);

export const QuarterFilled = () => (
  <CircleGauge
    value={25}
    maxValue={100}
    size={200}
    strokeWidth={20} />
);

export const ZeroValueSliver = () => (
  <CircleGauge
    value={0}
    maxValue={100}
    size={200}
    strokeWidth={20}
    showZeroSliver />
);

export const ZeroValueEmpty = () => (
  <CircleGauge
    value={0}
    maxValue={100}
    size={200}
    strokeWidth={20} />
);

export const CustomColor = () => (
  <>
    <CircleGauge
      value={75}
      maxValue={100}
      size={200}
      strokeWidth={20}
      color={colors.primary} />
    <CircleGauge
      value={75}
      maxValue={100}
      size={200}
      strokeWidth={20}
      color={colors.secondary} />
  </>
);

export const WithChildren = () => (
  <>
    <CircleGauge
      value={75}
      maxValue={100}
      size={200}
      strokeWidth={20}
      color={colors.primary}
      animated>
      <AppText style={{ fontSize: 24, fontWeight: "bold", color: colors.textPrimary }}>75% used</AppText>
    </CircleGauge>
    <CircleGauge
      value={100}
      maxValue={100}
      size={100}
      strokeWidth={10}
      color={colors.primary}>
      <SymbolView name={{ ios: 'info.circle.fill', android: 'info' }} size={32} tintColor={colors.primary} />
    </CircleGauge>
  </>
);