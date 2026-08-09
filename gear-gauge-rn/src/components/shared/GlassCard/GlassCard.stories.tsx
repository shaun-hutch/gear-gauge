import { globalStyles } from "@/styles";
import { colors } from "@/styles/theme";
import { AppText } from "../AppText/AppText";
import { GlassCard } from "./GlassCard";
import { View } from "react-native";


export default {
  title: "Components/GlassCard",
  component: GlassCard,
};

export const Default = () => (
  <GlassCard>
    <AppText style={globalStyles.body}>Hello, World!</AppText>
  </GlassCard>
);

export const MultipleCards = () => (
  <View style={gridStyles.row}>
    {Array.from({ length: 4 }, (_, i) => (
      <GlassCard key={i} style={gridStyles.item}>
        <AppText style={globalStyles.body}>Card {i + 1}</AppText>
      </GlassCard>
    ))}
  </View>
);

export const BackgroundColors = () => (
  <View style={colorDemoStyles.row}>
    <GlassCard tintColor={colors.primarySurface}>
      <AppText style={globalStyles.body}>Primary</AppText>
    </GlassCard>
    <GlassCard tintColor={colors.secondaryContainer}>
      <AppText style={globalStyles.body}>Secondary</AppText>
    </GlassCard>
    <GlassCard tintColor={colors.tertiaryContainer}>
      <AppText style={globalStyles.body}>Tertiary</AppText>
    </GlassCard>
    <GlassCard tintColor={colors.surfaceContainerHigh}>
      <AppText style={globalStyles.body}>Surface High</AppText>
    </GlassCard>
  </View>
);

const colorDemoStyles = {
  row: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
};

const gridStyles = {
  row: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  item: {
    // 2 items per row: 50% minus half the gap
    flexBasis: "47%" as const,
    flexGrow: 1,
  },
};