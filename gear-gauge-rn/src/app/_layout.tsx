import Constants from "expo-constants";
import { NativeTabs } from "expo-router/unstable-native-tabs";
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
import { colors } from "@/styles/theme";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// Conditionally load Storybook UI when STORYBOOK_ENABLED env var is set.
// In production/storybook-disabled mode, this module is never required.
let StorybookUIRoot: React.ComponentType | null = null;
if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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

  const tabLabelStyle = {
    default: { color: colors.secondary },
    selected: { color: colors.primary },
  };

  const tabIconStyle = {
    default: colors.secondary,
    selected: colors.primary,
  };


  const icons = {
    home: {
      default: "house",
      selected: "house.fill",
    },
    gear: {
      default: "shoe",
      selected: "shoe.fill",
    },
    history: {
      default: "clock",
      selected: "clock.fill",
    },
    settings: {
      default: "gearshape",
      selected: "gearshape.fill",
    },
  } as const;
  

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <NativeTabs labelStyle={tabLabelStyle} iconColor={tabIconStyle}>
        <NativeTabs.Trigger name="index">
            <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={icons.home} md="home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="gear">
            <NativeTabs.Trigger.Label>Gear</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={icons.gear} md="repeat" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="history">
            <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={icons.history} md="history" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
            <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={icons.settings} md="settings" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
