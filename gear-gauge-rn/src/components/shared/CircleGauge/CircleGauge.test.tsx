import { render, screen } from "@testing-library/react-native";
import { CircleGauge } from "./CircleGauge";
import { AppText } from "../AppText/AppText";

describe("CircleGauge", () => {
  it("renders without crashing", async () => {
    render(
      <CircleGauge size={200} strokeWidth={20} value={50} maxValue={100}>
        <AppText>50%</AppText>
      </CircleGauge>,
    );
    expect(screen.getByText("50%")).toBeTruthy();
  });
});
