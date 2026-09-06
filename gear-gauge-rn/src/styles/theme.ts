/**
 * Global design tokens for the Gear Gauge app.
 *
 * Sourced from design/DESIGN.md — the single source of truth for visual constants.
 * When dark mode is implemented, this file can export a theme provider / hook
 * that switches between light and dark token sets.
 *
 * Fonts (Lexend, Inter, JetBrains Mono) must be loaded via expo-font before use.
 * @see https://docs.expo.dev/versions/latest/sdk/font/
 */

// ─── Color Palette (Light Mode) ──────────────────────────────────────────────

const palette = {
  // Primary — green, representing growth and outdoor performance
  green50: "#F9FFEC",  // on-primary-container
  green100: "#DEF2C8",
  green200: "#BDE59C",
  green300: "#AAF76F",  // primary-fixed
  green400: "#8FDA56",  // primary-fixed-dim, inverse-primary
  green500: "#599F20",  // vibrant mid-green (4.5:1 on light bg)
  green600: "#418400",  // primary-container
  green700: "#346B00",  // surface-tint
  green800: "#336800",  // primary
  green900: "#265100",  // on-primary-fixed-variant
  green950: "#0B2000",  // on-primary-fixed

  // Secondary — neutral grey for secondary data / historical trends
  secondary50: "#F0F0F2",
  secondary100: "#E2E2E5", // secondary-container
  secondary200: "#C6C6C9", // secondary-fixed-dim
  secondary300: "#A9A9AD",
  secondary400: "#8D8D91",
  secondary500: "#727276",
  secondary600: "#5D5E61", // secondary
  secondary700: "#454749", // on-secondary-fixed-variant
  secondary800: "#2E2F31",
  secondary900: "#1A1C1E", // on-secondary-fixed

  // Tertiary — blue for secondary data sets (historical trends)
  blue50: "#FEFCFF",  // on-tertiary-container
  blue100: "#DBE1FF", // tertiary-fixed
  blue200: "#B4C5FF", // tertiary-fixed-dim
  blue300: "#8AA8FF",
  blue400: "#608BFF",
  blue500: "#316BF3", // tertiary-container
  blue600: "#0051D5", // tertiary
  blue700: "#003EA8", // on-tertiary-fixed-variant
  blue800: "#002B7A",
  blue900: "#00174B", // on-tertiary-fixed

  // Surface — warm off-white / cream tones for tonal layering
  surfaceWhite: "#FFFFFF",   // surface-container-lowest
  surface50: "#F7FBEC",      // surface, surface-bright, background
  surface100: "#F1F5E6",     // surface-container-low
  surface200: "#EBF0E1",     // surface-container
  surface300: "#E6EADB",     // surface-container-high
  surface400: "#E0E4D5",     // surface-container-highest, surface-variant
  surface500: "#D7DCCD",     // surface-dim
  surface600: "#C1CAB4",     // outline-variant
  surface700: "#717A67",     // outline
  surface800: "#414939",     // on-surface-variant
  surface900: "#2D3228",     // inverse-surface
  surface950: "#181D14",     // on-surface, on-background

  // Semantic
  red: "#BA1A1A",
  redContainer: "#FFDAD6",
  redOnContainer: "#93000A",
  white: "#FFFFFF",
  black: "#000000",
} as const;

// ─── Semantic Color Tokens ───────────────────────────────────────────────────

export const colors = {
  // Primary
  primary: palette.green800,
  primaryLight: palette.green400,
  primaryDark: palette.green900,
  primarySurface: palette.green50,
  primaryContainer: palette.green600,
  onPrimary: palette.white,
  onPrimaryContainer: palette.green50,

  // Secondary
  secondary: palette.secondary600,
  secondaryLight: palette.secondary200,
  secondaryDark: palette.secondary700,
  secondaryContainer: palette.secondary100,
  onSecondary: palette.white,
  onSecondaryContainer: palette.secondary600,

  // Tertiary
  tertiary: palette.blue600,
  tertiaryLight: palette.blue200,
  tertiaryDark: palette.blue700,
  tertiaryContainer: palette.blue500,
  onTertiary: palette.white,
  onTertiaryContainer: palette.blue50,

  // Background / Surface (tonal layering, not heavy shadows)
  background: palette.surface50,
  onBackground: palette.surface950,

  surface: palette.surface50,
  surfaceDim: palette.surface500,
  surfaceBright: palette.surface50,
  surfaceContainerLowest: palette.surfaceWhite,
  surfaceContainerLow: palette.surface100,
  surfaceContainer: palette.surface200,
  surfaceContainerHigh: palette.surface300,
  surfaceContainerHighest: palette.surface400,
  surfaceVariant: palette.surface400,
  onSurface: palette.surface950,
  onSurfaceVariant: palette.surface800,

  inverseSurface: palette.surface900,
  inverseOnSurface: "#EEF3E3",
  inversePrimary: palette.green400,

  // Outline
  outline: palette.surface700,
  outlineVariant: palette.surface600,

  // Text
  textPrimary: palette.surface950,
  textSecondary: palette.surface800,
  textTertiary: palette.surface700,
  textInverse: palette.white,
  textLink: palette.blue600,

  // Semantic
  success: "#28A745",
  successSurface: "#E8F6EB",
  error: palette.red,
  errorSurface: palette.redContainer,
  errorOnContainer: palette.redOnContainer,
  warning: "#FFC107",
  warningSurface: "#FFF9E6",
  info: "#17A2B8",
  infoSurface: "#E6F4F7",

  // Misc
  white: palette.white,
  black: palette.black,
  transparent: "transparent",
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

/**
 * Font families must be loaded via `expo-font` (e.g. useFonts) before rendering.
 * If not loaded, the system fallback (San Francisco on iOS) will be used.
 */
export const typography = {
  fontFamily: {
    /** 700 weight — hero metrics */
    display: "Lexend-Bold",
    /** 600 weight — section headlines */
    headline: "Lexend-SemiBold",
    /** 400 weight — body text */
    body: "Inter",
    /** 600 weight — body text, emphasised (gear names) */
    bodySemiBold: "Inter-SemiBold",
    /** 700 weight — body text, bold (workout titles) */
    bodyBold: "Inter-Bold",
    /** 500 weight — labels & technical data */
    mono: "JetBrainsMono",
  },

  // Matches DESIGN.md type scale
  styles: {
    /** 48px desktop / 36px mobile — large display for hero metrics */
    displayLarge: {
      fontFamily: "Lexend-Bold",
      fontSize: 36,        // mobile size; use 48 on tablet+
      fontWeight: "700" as const,
      lineHeight: 44,
      letterSpacing: -0.02 * 36, // approximate em → pt
    },
    /** 32px desktop / 24px mobile — section headlines */
    headlineLarge: {
      fontFamily: "Lexend-SemiBold",
      fontSize: 24,        // mobile size; use 32 on tablet+
      fontWeight: "600" as const,
      lineHeight: 32,
    },
    /** 24px all sizes */
    headlineMedium: {
      fontFamily: "Lexend-SemiBold",
      fontSize: 24,
      fontWeight: "600" as const,
      lineHeight: 32,
    },
    /** 18px — body large */
    bodyLarge: {
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: "400" as const,
      lineHeight: 28,
    },
    /** 16px — default body */
    bodyMedium: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
    },
    /** 14px — labels / technical data */
    labelMedium: {
      fontFamily: "JetBrainsMono",
      fontSize: 14,
      fontWeight: "500" as const,
      lineHeight: 20,
      letterSpacing: 0.05 * 14,
    },
    /** 12px — small labels */
    labelSmall: {
      fontFamily: "JetBrainsMono",
      fontSize: 12,
      fontWeight: "500" as const,
      lineHeight: 16,
      letterSpacing: 0.08 * 12,
    },
  },

  // Convenience aliases for quick access
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    display: 36,
  },

  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },
} as const;

// ─── Spacing (4pt baseline) ──────────────────────────────────────────────────

export const spacing = {
  /** 4pt — base unit */
  unit: 4,
  /** 8pt — tight stack */
  xs: 8,
  /** 16pt — default stack / gutter / mobile margin */
  sm: 16,
  /** 24pt — medium gap */
  md: 24,
  /** 32pt — large stack / desktop margin */
  lg: 32,
  /** 40pt */
  xl: 40,
  /** 48pt */
  xxl: 48,
  /** 64pt — section separation */
  section: 64,
} as const;

// ─── Border Radii ────────────────────────────────────────────────────────────

export const radii = {
  none: 0,
  /** 2pt */
  sm: 2,
  /** 4pt — default soft rounding */
  DEFAULT: 4,
  /** 6pt */
  md: 6,
  /** 8pt — cards */
  lg: 8,
  /** 12pt — large containers */
  xl: 12,
  /** 16pt — larger rounded */
  xxl: 16,
  /** Full rounded */
  full: 9999,
} as const;

// ─── Surfaces (flat tonal layers — no drop shadows) ─────────────────────────

export const surfaces = {
  /** Base background */
  base: {
    backgroundColor: colors.background,
  },
  /** Cards / containers */
  surface: {
    backgroundColor: colors.surfaceContainerLow,
  },
  /** Modals / tooltips */
  overlay: {
    backgroundColor: colors.surfaceContainerHighest,
  },
} as const;

// ─── Sizing ──────────────────────────────────────────────────────────────────

export const sizing = {
  /** Minimum touch target per Apple HIG */
  touchTargetMin: 44,
  /** Standard icon size */
  icon: 24,
  /** Small icon */
  iconSmall: 16,
  /** Large icon */
  iconLarge: 32,
} as const;

// ─── Layout ──────────────────────────────────────────────────────────────────

export const layout = {
  /** Mobile margin */
  marginMobile: spacing.sm,
  /** Desktop margin */
  marginDesktop: spacing.lg,
  /** Mobile gutter */
  gutter: spacing.sm,
  /** Max content width on desktop */
  maxWidth: 1440,
} as const;

