/**
 * Shared, reusable StyleSheet styles built from the design tokens in theme.ts.
 *
 * Import these into any component to keep layout consistent without duplicating
 * token lookups.  If a style isn't quite right for a specific component, prefer
 * composing it from the theme values directly in that component's StyleSheet.
 */

import { StyleSheet } from "react-native";
import { colors, spacing, radii, typography, elevation } from "./theme";
import { typographyStyles } from "./typography";

/** Flat, non-typography styles — merged with `typographyStyles` below. */
const globalStylesBase = StyleSheet.create({
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

  /** Pill-shaped label for status indicators (e.g. "EXCELLENT HEALTH").
   *  Uses a fixed minWidth so all variants appear the same width. */
  statusChip: {
    borderRadius: radii.full,
    minWidth: 180,
    alignSelf: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.unit,
    marginVertical: spacing.unit,
    marginRight: spacing.unit,
    marginLeft: spacing.unit,
    alignItems: "center",
  },

  statusChipSuccess: {
    backgroundColor: colors.successSurface,
    color: colors.success,
  },

  statusChipError: {
    backgroundColor: colors.errorSurface,
    color: colors.error,
  },

  statusChipWarning: {
    backgroundColor: colors.warningSurface,
    color: colors.warning,
  },

  statusChipInfo: {
    backgroundColor: colors.infoSurface,
    color: colors.info,
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

/** Public API: flat styles plus all text styles under the `typography` parent. */
export const globalStyles = {
  ...globalStylesBase,
  typography: typographyStyles,
};

