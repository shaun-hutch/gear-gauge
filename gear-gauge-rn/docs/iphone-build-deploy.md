# Physical iPhone Build & Deploy Guide

How to build and run the `gear-gauge-rn` Expo app on a physical iPhone (Shaun's iPhone 16 Pro Max).

## Prerequisites

- iPhone connected via USB and **unlocked**
- iPhone has **Developer Mode** enabled (Settings → Privacy & Security → Developer Mode)
- iPhone has been **trusted** with the Mac (tap "Trust" on the dialog when first connecting)

## Device Info

| Property | Value |
|----------|-------|
| Name | Shaun's iPhone (smart quote in `'`) |
| UDID | `<DEVICE_UDID>` — find with `xcrun xctrace list devices` |
| iOS Version | 26.5.2 |
| Bundle ID | `com.shaun-hutch.gear-gauge-rn` |
| Team ID | `<TEAM_ID>` — find in Xcode Signing & Capabilities |

## Quick Check: Is the device connected?

```bash
xcrun xctrace list devices 2>&1 | grep -i "shaun"
```

The iPhone should appear under `== Devices ==`, NOT under `== Devices Offline ==`.

## Build & Deploy

### Option 1: Via Xcode (easiest, most reliable)

```bash
open ios/geargaugern.xcworkspace
```

Then select **Shaun's iPhone** as the target and press **Run** (⌘R).

### Option 2: Via xcodebuild + devicectl (command line)

```bash
# 1. Build for device (from gear-gauge-rn/)
xcodebuild \
  -workspace ios/geargaugern.xcworkspace \
  -scheme geargaugern \
  -configuration Debug \
  -destination id=<DEVICE_UDID> \
  -allowProvisioningUpdates \
  -allowProvisioningDeviceRegistration \
  DEVELOPMENT_TEAM=<TEAM_ID>

# 2. Find the built .app
find ~/Library/Developer/Xcode/DerivedData \
  -name "geargaugern.app" \
  -path "*/Debug-iphoneos/*"

# 3. Install on device
xcrun devicectl device install app \
  --device <DEVICE_UDID> \
  "/path/to/geargaugern.app"

# 4. Launch the app
xcrun devicectl device process launch \
  --device <DEVICE_UDID> \
  com.shaun-hutch.gear-gauge-rn
```

### Option 3: Via Expo CLI (may fail on provisioning)

```bash
npx expo run:ios --device <DEVICE_UDID>
```

**⚠️ Known issue:** `expo run:ios` may fail with:
```
No profiles for 'com.shaun-hutch.gear-gauge-rn' were found
```
If that happens, use Option 1 or 2 instead.

## Metro Server

The dev client on the phone connects to Metro for the JS bundle at runtime.

### Normal app (no Storybook)

```bash
cd gear-gauge-rn
npx expo start
```

### Storybook mode

```bash
cd gear-gauge-rn
STORYBOOK_ENABLED='true' npx expo start
```

### Switching between modes

1. Kill the existing Metro server: `lsof -ti :8081 | xargs kill -9`
2. Start the desired Metro server (normal or Storybook)
3. Re-launch the app on iPhone using `xcrun devicectl device process launch ...`

> The app binary on the device is the same for both modes — only the Metro server determines whether Storybook or the normal app loads.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Device shows as offline | Connect USB, unlock iPhone, tap "Trust" |
| "Development services need to be enabled" | Enable Developer Mode on iPhone, restart |
| Provisioning profile not found | Build via Xcode directly (Option 1) |
| App shows Storybook instead of normal app | Kill Metro and restart without `STORYBOOK_ENABLED` |
| App can't connect to Metro | Ensure iPhone is on same Wi-Fi as Mac, check Metro IP |
