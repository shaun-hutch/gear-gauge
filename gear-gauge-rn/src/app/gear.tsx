import { AppText } from "@/components/shared";
import { GlassCard } from "@/components/shared/GlassCard/GlassCard";
import { typographyStyles } from "@/styles/typography";
import { spacing } from "@/styles/theme";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Gear list screen — shows all tracked gear items in a card layout. */
export default function Gear() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AppText style={typographyStyles.headlineMedium}>My Gear</AppText>
        <GlassCard style={styles.card}>
          <AppText style={typographyStyles.body}>No gear tracked yet. Add your first pair of shoes or bicycle to get started.</AppText>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  card: {
    padding: spacing.sm,
  },
});