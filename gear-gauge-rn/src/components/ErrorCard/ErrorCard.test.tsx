import { render, screen } from "@testing-library/react-native";
import { ErrorCard } from "./ErrorCard";

describe("ErrorCard", () => {
  it("renders the error message", async () => {
    await render(<ErrorCard message="Failed to load gear" />);

    expect(screen.getByText("Failed to load gear")).toBeTruthy();
  });
});
