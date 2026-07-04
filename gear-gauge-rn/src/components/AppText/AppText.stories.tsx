import { AppText } from "./AppText";
import { globalStyles } from "@/styles/globalStyles";

export default {
  title: "AppText",
  component: AppText,
};

/** Default — renders with the Inter body font automatically. */
export const Default = () => <AppText>Hello, Gear Gauge</AppText>;

/** Uses the headline typography token from globalStyles. */
export const Headline = () => (
  <AppText style={globalStyles.headlineLarge}>Section Headline</AppText>
);

/** Uses the mono label token — the JetBrainsMono fontFamily override
 *  is applied via the style prop and stacks on top of the default Inter. */
export const MonoLabel = () => (
  <AppText style={globalStyles.labelMedium}>12.4 km</AppText>
);

/** Long text wrapping — verifies body copy renders cleanly. */
export const LongBody = () => (
  <AppText style={globalStyles.body}>
    Track your running shoes, cycling gear, and more. Get notified when it's
    time to replace your equipment based on distance, duration, or calendar
    intervals.
  </AppText>
);
