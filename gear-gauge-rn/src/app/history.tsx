import { AppText } from "@/components/shared";
import { Card } from "@/components/shared/Card/Card";
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
        <Card style={styles.card}>
          <AppText style={typographyStyles.body}>No workouts synced yet. Connect HealthKit in Settings to get started.</AppText>
        </Card>
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
  card: {
    padding: spacing.sm,
  },
});