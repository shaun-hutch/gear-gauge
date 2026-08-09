import { render, screen } from "@testing-library/react-native";
import { AppText } from "./AppText";

describe("AppText", () => {
  it("renders without crashing", async () => {
    render(<AppText>Hello, Gear Gauge</AppText>);
    expect(screen.getByText("Hello, Gear Gauge")).toBeTruthy();
  });
});
