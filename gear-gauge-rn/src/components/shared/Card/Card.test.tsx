import { render, screen } from "@testing-library/react-native";
import { Card } from "./Card";
import { AppText } from "../AppText/AppText";

describe("Card", () => {
  it("renders without crashing", async () => {
    await render(
      <Card>
        <AppText>Card content</AppText>
      </Card>,
    );
    expect(screen.getByText("Card content")).toBeTruthy();
  });
});
