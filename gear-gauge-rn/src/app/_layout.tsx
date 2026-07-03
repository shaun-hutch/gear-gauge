import Constants from "expo-constants";
import { Stack } from "expo-router";

// Conditionally load Storybook UI when STORYBOOK_ENABLED env var is set.
// In production/storybook-disabled mode, this module is never required.
let StorybookUIRoot: React.ComponentType | null = null;
if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  StorybookUIRoot = require("../../.storybook").default;
}

export default function RootLayout() {
  // When Storybook is enabled, render it instead of the normal app layout.
  if (StorybookUIRoot) {
    return <StorybookUIRoot />;
  }

  return <Stack />;
}
