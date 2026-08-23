import { render, screen } from "@testing-library/react-native";
import { StatusBadge } from "./StatusBadge";
import { Status } from "@/utils/labels";

describe("StatusBadge", () => {
  it("renders success status without crashing", async () => {
    await render(<StatusBadge status={Status.Success} />);
    expect(screen.getByText("EXCELLENT HEALTH")).toBeTruthy();
  });

  it("renders error status without crashing", async () => {
    await render(<StatusBadge status={Status.Error} />);
    expect(screen.getByText("CRITICAL: REPLACE")).toBeTruthy();
  });
});
