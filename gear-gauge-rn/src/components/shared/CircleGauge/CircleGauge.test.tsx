import { render, screen } from "@testing-library/react-native";
import { CircleGauge, resolveGaugeFraction } from "./CircleGauge";
import { AppText } from "../AppText/AppText";

describe("CircleGauge", () => {
  it("renders without crashing", async () => {
    await render(
      <CircleGauge size={200} strokeWidth={20} value={50} maxValue={100}>
        <AppText>50%</AppText>
      </CircleGauge>,
    );
    expect(screen.getByText("50%")).toBeTruthy();
  });
});

describe("resolveGaugeFraction", () => {
  it("returns 0 for a zero value by default", () => {
    expect(resolveGaugeFraction(0, 100)).toBe(0);
  });

  it("returns a 1% sliver for a zero value when showZeroSliver is true", () => {
    expect(resolveGaugeFraction(0, 100, true)).toBeCloseTo(0.001);
  });

  it("clamps the fraction to 1 at or above the max value", () => {
    expect(resolveGaugeFraction(100, 100)).toBe(1);
    expect(resolveGaugeFraction(120, 100, true)).toBe(1);
  });
});
