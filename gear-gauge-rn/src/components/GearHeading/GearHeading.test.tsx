import { render, screen } from "@testing-library/react-native";
import { GearType } from "@/models/GearType";
import { GearHeading } from "./GearHeading";

describe("GearHeading", () => {
  it("renders the kicker, gear name and gear type display name", async () => {
    await render(<GearHeading name="Nike Pegasus 40" type={GearType.Shoes} />);

    expect(screen.getByText("Active gear")).toBeTruthy();
    expect(screen.getByText("Nike Pegasus 40")).toBeTruthy();
    expect(screen.getByText("Shoes")).toBeTruthy();
  });

  it("renders the display name for a bicycle", async () => {
    await render(
      <GearHeading name="Specialized Tarmac SL7" type={GearType.Bicycle} />,
    );

    expect(screen.getByText("Bicycle")).toBeTruthy();
  });
});
