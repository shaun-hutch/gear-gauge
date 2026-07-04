---
name: gearGauge
colors:
  surface: '#f7fbec'
  surface-dim: '#d7dccd'
  surface-bright: '#f7fbec'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5e6'
  surface-container: '#ebf0e1'
  surface-container-high: '#e6eadb'
  surface-container-highest: '#e0e4d5'
  on-surface: '#181d14'
  on-surface-variant: '#414939'
  inverse-surface: '#2d3228'
  inverse-on-surface: '#eef3e3'
  outline: '#717a67'
  outline-variant: '#c1cab4'
  surface-tint: '#346b00'
  primary: '#336800'
  on-primary: '#ffffff'
  primary-container: '#418400'
  on-primary-container: '#f9ffec'
  inverse-primary: '#8fda56'
  secondary: '#5d5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e5'
  on-secondary-container: '#636467'
  tertiary: '#0051d5'
  on-tertiary: '#ffffff'
  tertiary-container: '#316bf3'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaf76f'
  primary-fixed-dim: '#8fda56'
  on-primary-fixed: '#0b2000'
  on-primary-fixed-variant: '#265100'
  secondary-fixed: '#e2e2e5'
  secondary-fixed-dim: '#c6c6c9'
  on-secondary-fixed: '#1a1c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f7fbec'
  on-background: '#181d14'
  surface-variant: '#e0e4d5'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Lexend
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for athletes who demand precision and real-time data clarity. The brand personality is **Athletic, Precise, and Data-Driven**. It prioritizes high-performance aesthetics over decorative flourishes, ensuring that information is legible at a glance during high-intensity activity.

The visual style is a hybrid of **Minimalism** and **High-Contrast / Bold**. It utilizes heavy whitespace to isolate key metrics and a strict typographic hierarchy to establish clear information architecture. The aesthetic draws inspiration from professional telemetry and precision instruments, favoring sharp execution and functional clarity.

## Colors

The palette is anchored by the primary green, representing growth and outdoor performance. In Light Mode, the primary green (#599F20) is deep enough to maintain a 4.5:1 contrast ratio against light backgrounds for essential UI elements. In Dark Mode, the vibrant primary (#82FF19) acts as a high-visibility beacon for critical data points.

Neutrals are high-contrast to ensure maximum readability for users in motion or under bright sunlight. Text on light mode should utilize a near-black (#1A1C1E) for high density, while dark mode should utilize a stark white (#FFFFFF) for peak legibility. The secondary blue is used for secondary data sets (e.g., historical trends), and the accent orange is reserved for active recording states or critical milestones.

## Typography

This design system uses **Lexend** for headlines and displays due to its proven readability and athletic, geometric character. **Inter** serves as the primary body font for its systematic, utilitarian nature, ensuring long-form data is easy to parse. **JetBrains Mono** is introduced for labels and technical data (like timestamps, GPS coordinates, and heart rate beats) to provide a distinctive "instrumentation" feel.

Type scales are aggressive to allow for quick scanning. On mobile, display sizes are reduced but maintain a high weight (Bold/Semi-bold) to keep the "data-first" hierarchy intact.

## Layout & Spacing

The layout follows a **Fluid Grid** system based on a 4px baseline shift. This allows for precise alignment of data visualizations and metric cards. 

- **Mobile:** 4-column grid with 16px margins and 16px gutters.
- **Tablet:** 8-column grid with 24px margins and 16px gutters.
- **Desktop:** 12-column grid with a max-width of 1440px, 32px margins, and 24px gutters.

Spacing between functional groups (Stacks) should always be multiples of 8px to maintain a rhythmic, structured feel that echoes the precision of the brand.

## Elevation & Depth

To maintain a focus on data and precision, this design system uses **Tonal Layers** rather than heavy shadows. 

1. **Base:** The primary background color.
2. **Surface:** A slightly lighter/darker tint used for cards and container modules to separate content from the background.
3. **Overlay:** Used for modals and tooltips, utilizing a very subtle, sharp shadow (2px blur, 10% opacity) to suggest interaction priority without breaking the flat, technical aesthetic.

In Dark Mode, depth is communicated through increasing luminosity: higher elevation elements are slightly lighter grays, making them appear closer to the user.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a clean, modern look that feels engineered rather than "bubbly." Buttons and metric cards use this slight rounding to provide a subtle containerization that doesn't sacrifice the "precise" feel of sharp corners. Large containers like dashbord cards may use `rounded-lg` (0.5rem) to better frame dense information.

## Components

- **Buttons:** High-contrast primary buttons use the Primary Green with black or white text (depending on the mode). Ghost buttons use a 1px border of the primary color for secondary actions.
- **Metric Cards:** Use a subtle background fill (Surface color) with the primary metric rendered in `display-lg` Lexend.
- **Status Chips:** Small, rounded-sm labels using `label-sm` JetBrains Mono. Use semantic colors (Success/Error) for status indicators like "GPS Locked" or "Connection Lost."
- **Inputs:** Clean, 1px bordered boxes that highlight the border in Primary Green upon focus. Error states must include both the semantic red border and an error icon for accessibility.
- **Progress Gauges:** Circular or linear trackers using the Primary Green to represent completion. The background track should be a low-contrast neutral (Surface color).