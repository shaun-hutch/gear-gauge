import { render, screen } from "@testing-library/react-native";
import { HomeGauge } from "./HomeGauge";

describe("HomeGauge", () => {
  it("renders without crashing", async () => {
    await render(<HomeGauge value={350} maxValue={500} />);
    expect(screen.getByText("70%")).toBeTruthy();
    expect(screen.getByText("Life Used")).toBeTruthy();
  });
});
