import { StyleSheet } from "react-native";

import { AppText, Card } from "@/components/shared";
import { typographyStyles } from "@/styles/typography";
import { spacing } from "@/styles/theme";

/**
 * Empty-state card shown on the home screen when the user has no primary gear.
 */
export function NoPrimaryGearCard() {
  return (
    <Card style={styles.card}>
      <AppText style={typographyStyles.body}>
        No primary gear yet. Add your first pair of shoes or bicycle to get
        started — your most-used gear will be highlighted here.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
  },
});

export default NoPrimaryGearCard;
