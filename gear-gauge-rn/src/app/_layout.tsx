import Constants from "expo-constants";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

// Google Fonts — loaded via @expo-google-fonts packages
import {
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// Conditionally load Storybook UI when STORYBOOK_ENABLED env var is set.
// In production/storybook-disabled mode, this module is never required.
let StorybookUIRoot: React.ComponentType | null = null;
if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  StorybookUIRoot = require("../../.storybook").default;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Keys become the fontFamily string you reference in styles.
    // DESIGN.md weights: Lexend 600 (headlines), Lexend 700 (display),
    // Inter 400 (body), JetBrainsMono 500 (labels).
    "Lexend-SemiBold": Lexend_600SemiBold,
    "Lexend-Bold": Lexend_700Bold,
    Inter: Inter_400Regular,
    JetBrainsMono: JetBrainsMono_500Medium,
  });

  // Only hide the splash screen once fonts are ready — prevents a
  // visible typeface swap from system fallback → custom font.
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // When Storybook is enabled, render it instead of the normal app layout.
  if (StorybookUIRoot) {
    return (
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <StorybookUIRoot />
      </View>
    );
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Stack />
    </View>
  );
}
