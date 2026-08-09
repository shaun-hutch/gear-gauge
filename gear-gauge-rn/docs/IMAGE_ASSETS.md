# Image Asset Requirements

This document specifies all raster and vector image assets required for the
gear-gauge React Native (Expo) app. Custom branded assets should be created
to replace the Expo template defaults that were removed.

---

## App Icon

### iOS

| Asset | Size | Format | Notes |
|-------|------|--------|-------|
| App Icon | 1024 × 1024 px | PNG | Single source; Expo / Xcode generates all required sizes. No transparency — iOS applies its own mask. |

### Android (Adaptive Icon)

Android uses an adaptive icon composed of a foreground layer on a coloured
background. The background colour is set in `app.json`
(`android.adaptiveIcon.backgroundColor`, currently `#E6F4FE`).

| Asset | Size | Format | Notes |
|-------|------|--------|-------|
| Foreground | 432 × 432 px | PNG | Centered on the background. Keep ~66% safe zone (inner 288×288) to avoid clipping by OEM masks. Transparent background. |
| Background | 432 × 432 px | PNG | Solid fill or simple pattern. Can be omitted if using a solid `backgroundColor` in `app.json`. |
| Monochrome | 432 × 432 px | PNG | Used for themed icon on Android 13+. Silhouette of the foreground. |

Reference paths in `app.json`:
```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#E6F4FE",
    "foregroundImage": "./assets/images/android-icon-foreground.png",
    "backgroundImage": "./assets/images/android-icon-background.png",
    "monochromeImage": "./assets/images/android-icon-monochrome.png"
  }
}
```

### Web (Favicon)

| Asset | Size | Format | Notes |
|-------|------|--------|-------|
| Favicon | 48 × 48 px | PNG | Displayed in browser tabs. |

Reference path in `app.json` (web section):
```json
"web": {
  "favicon": "./assets/images/favicon.png"
}
```

---

## iOS 26+ Adaptive Icon (`assets/expo.icon/`)

The `.expo.icon` format provides an iOS 26+ adaptive icon with gradient
fill, translucency, and shadow effects. It supports both square (iOS) and
circular (watchOS) masks.

### SVG Layer Assets

Place custom SVG files in `assets/expo.icon/Assets/`:

| Asset | Notes |
|-------|-------|
| `icon-symbol.svg` | Main icon silhouette — a gauge, shoe, or gear-themed mark. This replaces the removed Expo symbol. |
| `icon-background.svg` | (Optional) Background texture or pattern layer. |

Then update `assets/expo.icon/icon.json` to reference your custom layers:

```json
{
  "fill": {
    "automatic-gradient": "extended-srgb:0.00000,0.47843,1.00000,1.00000"
  },
  "groups": [
    {
      "layers": [
        {
          "image-name": "icon-background.svg",
          "name": "background"
        },
        {
          "image-name": "icon-symbol.svg",
          "name": "symbol",
          "position": { "scale": 0.8, "translation-in-points": [0, 0] }
        }
      ],
      "shadow": { "kind": "neutral", "opacity": 0.5 },
      "translucency": { "enabled": true, "value": 0.5 }
    }
  ],
  "supported-platforms": {
    "circles": ["watchOS"],
    "squares": "shared"
  }
}
```

### Gradient Fill

The `automatic-gradient` value uses the app's primary blue
(`extended-srgb:0.00000,0.47843,1.00000,1.00000` — equivalent to `#007AFF`).
Update this to match the green primary from the design tokens
(`#336800`) if you prefer a green-tinted icon.

---

## Splash Screen

### Android

| Asset | Size | Format | Notes |
|-------|------|--------|-------|
| Splash Image | 960 × 960 px recommended | PNG | Centered on the background colour set in `expo-splash-screen` plugin config (currently `#208AEF`). Keep the image within a 240×240 dp safe zone (384×384 px at 1.6x). |

Reference path in `app.json` (expo-splash-screen plugin):
```json
["expo-splash-screen", {
  "backgroundColor": "#208AEF",
  "android": {
    "image": "./assets/images/splash-icon.png",
    "imageWidth": 76
  }
}]
```

### iOS

iOS uses the native `SplashScreen.storyboard` already configured in
`ios/geargaugern/`. No additional raster assets are required unless
you want to customise the storyboard with a branded image.

---

## Tab Bar Icons

### iOS (SF Symbols)

iOS uses SF Symbols for tab bar icons — no raster assets needed. The
current symbol mapping in `_layout.tsx`:

| Tab | SF Symbol (default) | SF Symbol (selected) |
|-----|---------------------|----------------------|
| Home | `house` | `house.fill` |
| Gear | `shoe` | `shoe.fill` |
| History | `clock` | `clock.fill` |
| Settings | `gearshape` | `gearshape.fill` |

These can be changed to any valid SF Symbol name. The icon colour is
controlled by `tabIconStyle` in `_layout.tsx` (primary green when selected,
secondary grey when unselected).

### Android (Material Icons)

Android tab icons use the `md` prop in `NativeTabs.Trigger.Icon`. These
are Material Design icon names handled internally by Expo UI — no raster
assets needed.

| Tab | Material Icon |
|-----|---------------|
| Home | `home` |
| Gear | `repeat` |
| History | `history` |
| Settings | `settings` |

---

## Colour References

All colours referenced in the design tokens (`src/styles/theme.ts`):

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#336800` | Primary green — buttons, active tab, gauge fill |
| `primaryLight` | `#8FDA56` | Light green variant |
| `primaryDark` | `#265100` | Dark green variant |
| `primaryContainer` | `#418400` | Green container background |
| `background` | `#F7FBEC` | App background (warm cream-green) |
| `surfaceWhite` | `#FFFFFF` | Card surfaces |
| `textPrimary` | `#181D14` | Body text |
| `textSecondary` | `#414939` | Subtitle text |
| Splash BG | `#208AEF` | Splash screen background (currently blue) |

Consider updating the splash screen background to `#336800` (primary green)
for brand consistency.

---

## File Placement Summary

```
assets/
├── images/
│   ├── icon.png                          ← App icon (1024×1024)
│   ├── favicon.png                       ← Web favicon (48×48)
│   ├── splash-icon.png                   ← Android splash image
│   ├── android-icon-foreground.png       ← Adaptive icon foreground (432×432)
│   ├── android-icon-background.png       ← Adaptive icon background (432×432)
│   └── android-icon-monochrome.png       ← Adaptive icon monochrome (432×432)
├── expo.icon/
│   ├── icon.json                         ← Adaptive icon config
│   └── Assets/
│       ├── icon-symbol.svg               ← Main icon silhouette (SVG)
│       └── icon-background.svg           ← Background texture (SVG, optional)
└── fonts/                                ← (loaded via Google Fonts packages, no files)
```
