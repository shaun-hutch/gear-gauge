import { CircleGauge } from "./CircleGauge";

export default {
  title: "Components/CircleGauge",
  component: CircleGauge,
};

export const Default = () => (
  <CircleGauge
    value={75}
    maxValue={100}
    size={200}
    strokeWidth={20} />
);
