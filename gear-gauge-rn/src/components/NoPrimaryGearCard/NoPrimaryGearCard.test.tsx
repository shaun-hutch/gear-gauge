import { render, screen } from "@testing-library/react-native";
import { NoPrimaryGearCard } from "./NoPrimaryGearCard";

describe("NoPrimaryGearCard", () => {
  it("renders the empty-state message", async () => {
    await render(<NoPrimaryGearCard />);

    expect(
      screen.getByText(/No primary gear yet/),
    ).toBeTruthy();
  });
});
