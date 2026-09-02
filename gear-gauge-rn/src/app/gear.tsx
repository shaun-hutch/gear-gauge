import { AppText } from "@/components/shared";
import { Card } from "@/components/shared/Card/Card";
import { GearList } from "@/components/GearList/GearList";
import { useGearContext } from "@/context/GearProvider";
import { typographyStyles } from "@/styles/typography";
import { colors, spacing } from "@/styles/theme";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Gear list screen — shows all tracked gear items in a card layout. */
export default function Gear() {
  const { gear, isLoading, error } = useGearContext();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={typographyStyles.headlineMedium}>Your Gear</AppText>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error ? (
          <Card style={styles.card}>
            <AppText style={typographyStyles.body}>{error}</AppText>
          </Card>
        ) : gear.length === 0 ? (
          <Card style={styles.card}>
            <AppText style={typographyStyles.body}>
              No gear tracked yet. Add your first pair of shoes or bicycle to
              get started.
            </AppText>
          </Card>
        ) : (
          <GearList />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  center: {
    alignItems: "center",
    paddingTop: spacing.lg,
  },
  card: {
    padding: spacing.sm,
  },
});