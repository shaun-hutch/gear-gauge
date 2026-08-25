import { AppText } from "@/components/shared";
import { Card } from "@/components/shared/Card/Card";
import { typographyStyles } from "@/styles/typography";
import { spacing } from "@/styles/theme";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Settings — HealthKit permissions, notifications, premium, privacy. */
export default function Settings() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AppText style={typographyStyles.headlineMedium}>Settings</AppText>
        <Card style={styles.card}>
          <AppText style={typographyStyles.body}>HealthKit, notifications, and premium settings will appear here.</AppText>
        </Card>
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