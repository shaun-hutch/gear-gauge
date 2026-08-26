import { render, screen } from "@testing-library/react-native";
import { GearType } from "@/models/GearType";
import { GearListItem } from "./GearListItem";

describe("GearListItem", () => {
  it("renders the gear name, formatted distance and condition badge", async () => {
    await render(
      <GearListItem
        name="Specialized Tarmac SL7"
        currentDistance={1000}
        maxDistance={5000}
        type={GearType.Bicycle}
        isPrimary
      />,
    );

    expect(screen.getByText("Specialized Tarmac SL7")).toBeTruthy();
    expect(screen.getByText("1,000 / 5,000 km")).toBeTruthy();
    expect(screen.getByText("EXCELLENT HEALTH")).toBeTruthy();
  });
});
