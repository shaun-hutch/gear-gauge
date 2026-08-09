import { render, screen } from "@testing-library/react-native";
import { GlassCard } from "./GlassCard";
import { AppText } from "../AppText/AppText";

describe("GlassCard", () => {
  it("renders without crashing", async () => {
    render(
      <GlassCard>
        <AppText>Card content</AppText>
      </GlassCard>,
    );
    expect(screen.getByText("Card content")).toBeTruthy();
  });
});
