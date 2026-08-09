/**
 * Typography styles for the Gear Gauge app.
 *
 * These are the app's text styles, exposed via the single `typography` parent
 * on `globalStyles` (`globalStyles.typography.*`) so components pull from one
 * place instead of flat siblings.
 *
 * Built in its own StyleSheet.create call because StyleSheet.create only
 * type-checks a flat map of styles — a nested parent object can't live inside
 * the same call. It is merged into `globalStyles` in ./globalStyles.
 */

import { StyleSheet } from "react-native";
import { colors, typography } from "./theme";

export const typographyStyles = StyleSheet.create({
  displayLarge: {
    ...typography.styles.displayLarge,
    color: colors.textPrimary,
  },

  headlineLarge: {
    ...typography.styles.headlineLarge,
    color: colors.textPrimary,
  },

  headlineMedium: {
    ...typography.styles.headlineMedium,
    color: colors.textPrimary,
  },

  bodyLarge: {
    ...typography.styles.bodyLarge,
    color: colors.textPrimary,
  },

  /** Default body text. */
  body: {
    ...typography.styles.bodyMedium,
    color: colors.textPrimary,
  },

  labelMedium: {
    ...typography.styles.labelMedium,
    color: colors.textSecondary,
  },

  labelSmall: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
  },

  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    color: colors.textTertiary,
    lineHeight: 16,
  },
});
