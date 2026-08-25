import { typographyStyles } from "@/styles/typography";
import { colors } from "@/styles/theme";
import { AppText } from "../AppText/AppText";
import { Card } from "./Card";
import { View } from "react-native";


export default {
  title: "Components/Card",
  component: Card,
};

export const Default = () => (
  <Card>
    <AppText style={typographyStyles.body}>Hello, World!</AppText>
  </Card>
);

export const MultipleCards = () => (
  <View style={gridStyles.row}>
    {Array.from({ length: 4 }, (_, i) => (
      <Card key={i} style={gridStyles.item}>
        <AppText style={typographyStyles.body}>Card {i + 1}</AppText>
      </Card>
    ))}
  </View>
);

export const BackgroundColors = () => (
  <View style={colorDemoStyles.row}>
    <Card tintColor={colors.primarySurface}>
      <AppText style={typographyStyles.body}>Primary</AppText>
    </Card>
    <Card tintColor={colors.secondaryContainer}>
      <AppText style={typographyStyles.body}>Secondary</AppText>
    </Card>
    <Card tintColor={colors.tertiaryContainer}>
      <AppText style={typographyStyles.body}>Tertiary</AppText>
    </Card>
    <Card tintColor={colors.surfaceContainerHigh}>
      <AppText style={typographyStyles.body}>Surface High</AppText>
    </Card>
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