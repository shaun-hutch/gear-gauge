/**
 * Shared, reusable StyleSheet styles built from the design tokens in theme.ts.
 *
 * Import these into any component to keep layout consistent without duplicating
 * token lookups.  If a style isn't quite right for a specific component, prefer
 * composing it from the theme values directly in that component's StyleSheet.
 */

import { StyleSheet } from "react-native";
import { colors, spacing, radii, typography, elevation } from "./theme";

export const globalStyles = StyleSheet.create({
  // ─── Layout ──────────────────────────────────────────────────────────────

  /** Fills the parent and centres children (ideal for screen wrappers). */
  flexCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /** Horizontal row with vertically centred children and default gap. */
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  /** Row that pushes first child left and last child right. */
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ─── Padding Helpers ─────────────────────────────────────────────────────

  padXs: { padding: spacing.xs },
  padSm: { padding: spacing.sm },
  padMd: { padding: spacing.md },
  padLg: { padding: spacing.lg },

  padHSm: { paddingHorizontal: spacing.sm },
  padHLg: { paddingHorizontal: spacing.lg },

  padVSm: { paddingVertical: spacing.sm },
  padVLg: { paddingVertical: spacing.lg },

  // ─── Margin Helpers ──────────────────────────────────────────────────────

  marginBSm: { marginBottom: spacing.xs },
  marginBmd: { marginBottom: spacing.sm },
  marginBLg: { marginBottom: spacing.lg },

  // ─── Cards & Surfaces (tonal layering) ───────────────────────────────────

  /** Standard card — uses surface-container-low for subtle separation. */
  card: {
    ...elevation.surface,
    borderRadius: radii.lg,
    padding: spacing.sm,
  },

  /** Elevated card for modals / overlays. */
  cardElevated: {
    ...elevation.overlay,
    borderRadius: radii.lg,
    padding: spacing.sm,
  },

  // ─── Typography ──────────────────────────────────────────────────────────

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

  // ─── Buttons ─────────────────────────────────────────────────────────────

  /** Solid primary button (green). */
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radii.DEFAULT,
    paddingVertical: spacing.xs + 4, // 12pt — comfortable tap area
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },

  buttonPrimaryText: {
    ...typography.styles.labelMedium,
    color: colors.onPrimary,
  },

  /** Ghost / outlined secondary button. */
  buttonOutline: {
    backgroundColor: colors.transparent,
    borderRadius: radii.DEFAULT,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },

  buttonOutlineText: {
    ...typography.styles.labelMedium,
    color: colors.primary,
  },

  // ─── Separators ──────────────────────────────────────────────────────────

  /** Full-width horizontal divider. */
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
  },

  /** Padded horizontal divider (use inside a container with horizontal padding). */
  dividerInset: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: spacing.sm,
  },

  // ─── Inputs ──────────────────────────────────────────────────────────────

  /** Clean bordered text input — border highlights primary green on focus. */
  textInput: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.DEFAULT,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    ...typography.styles.bodyMedium,
    color: colors.textPrimary,
    minHeight: 44,
  },

  // ─── Metric Cards (design system: "Metric Cards") ────────────────────────

  /** Card for displaying a single prominent metric. */
  metricCard: {
    ...elevation.surface,
    borderRadius: radii.lg,
    padding: spacing.sm,
    alignItems: "center",
    gap: spacing.xs,
  },

  metricValue: {
    ...typography.styles.displayLarge,
    color: colors.primary,
  },

  metricLabel: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
  },

  // ─── Status Chips ────────────────────────────────────────────────────────

  /** Small rounded label for status indicators (e.g. "GPS Locked"). */
  statusChip: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.unit,
    ...typography.styles.labelSmall,
  },

  statusChipSuccess: {
    backgroundColor: colors.successSurface,
    color: colors.success,
  },

  statusChipError: {
    backgroundColor: colors.errorSurface,
    color: colors.error,
  },

  // ─── Images ──────────────────────────────────────────────────────────────

  /** Circular avatar / gear thumbnail placeholder. */
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
});

