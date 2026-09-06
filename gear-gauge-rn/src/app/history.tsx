import { AppText } from "@/components/shared";
import { typographyStyles } from "@/styles/typography";
import { colors, spacing } from "@/styles/theme";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Workout history — synced from HealthKit and linked to gear. */
export default function History() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AppText style={typographyStyles.headlineMedium}>Workout History</AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.sm,
    gap: spacing.sm,
  },
});