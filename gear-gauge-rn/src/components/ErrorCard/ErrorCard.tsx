import { StyleSheet } from "react-native";

import { AppText, Card } from "@/components/shared";
import { typographyStyles } from "@/styles/typography";
import { spacing } from "@/styles/theme";

interface ErrorCardProps {
  /** Human-readable error message to display. */
  message: string;
}

/** Error-state card shown on the home screen when gear data fails to load. */
export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <Card style={styles.card}>
      <AppText style={typographyStyles.body}>{message}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
  },
});

export default ErrorCard;
