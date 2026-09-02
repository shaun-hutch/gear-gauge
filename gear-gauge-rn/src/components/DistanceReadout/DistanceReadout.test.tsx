import { render, screen } from "@testing-library/react-native";
import { DistanceReadout } from "./DistanceReadout";

describe("DistanceReadout", () => {
  it("renders the travelled and remaining labels and values", async () => {
    await render(
      <DistanceReadout currentDistance={350} maxDistance={500} />,
    );

    expect(screen.getByText("Distance travelled")).toBeTruthy();
    expect(screen.getByText("Remaining")).toBeTruthy();
    expect(screen.getByText("150 km")).toBeTruthy();
  });

  it("clamps the remaining distance to zero when over the max", async () => {
    await render(
      <DistanceReadout currentDistance={600} maxDistance={500} />,
    );

    expect(screen.getByText("0 km")).toBeTruthy();
  });
});
