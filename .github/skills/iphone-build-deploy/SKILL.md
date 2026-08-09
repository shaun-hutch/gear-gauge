---
name: iphone-build-deploy
description: >-
  Build and deploy the gear-gauge-rn Expo app to a physical iPhone over USB.
  Covers xcodebuild, devicectl, Metro server modes (normal vs Storybook),
  and troubleshooting. Triggered by questions like "run on my iPhone",
  "build to device", "deploy to phone", "physical device build",
  or "install on iPhone".
applies_to:
  - "gear-gauge-rn/**"
---

# iPhone Build & Deploy (gear-gauge-rn)

This skill covers building the `gear-gauge-rn` Expo React Native app and deploying it to a physical iPhone connected via USB.

## Prerequisites

- iPhone connected via USB and **unlocked**
- iPhone has **Developer Mode** enabled (Settings → Privacy & Security → Developer Mode)
- iPhone has been **trusted** with the Mac (tap "Trust" on the dialog when first connecting)
- Metro port 8081 is available (kill existing processes first if switching modes)

## Quick Check: Is the device connected?

```bash
xcrun xctrace list devices 2>&1 | grep -i "shaun"
```

The iPhone should appear under `== Devices ==`, NOT under `== Devices Offline ==`.

If the device appears offline, ensure it is unlocked and has been trusted.

## Build & Deploy

### Option 1: Via Xcode (easiest, most reliable)

```bash
open ios/geargaugern.xcworkspace
```

Then select the iPhone as the target and press **Run** (⌘R).

### Option 2: Via xcodebuild + devicectl (command line)

Full details are in `docs/iphone-build-deploy.md`, but the essential commands are:

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

> Use `xcrun xctrace list devices` to get the device UDID. Use Xcode Signing & Capabilities to find the Team ID.

### Option 3: Via Expo CLI (may fail on provisioning)

```bash
npx expo run:ios --device <DEVICE_UDID>
```

**Known issue:** `expo run:ios` may fail with provisioning profile errors. If so, use Option 1 or 2.

## Metro Server Modes

The dev client connects to Metro at runtime for the JS bundle. The same binary on the phone works for both modes — only the Metro server determines what loads.

### Normal app

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
3. Re-launch the app on iPhone: `xcrun devicectl device process launch --device <DEVICE_UDID> com.shaun-hutch.gear-gauge-rn`

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Device shows as offline | Connect USB, unlock iPhone, tap "Trust" |
| "Development services need to be enabled" | Enable Developer Mode on iPhone, restart |
| Provisioning profile not found | Build via Xcode directly (Option 1) |
| App shows Storybook instead of normal app | Kill Metro and restart without `STORYBOOK_ENABLED` |
| App can't connect to Metro | Ensure iPhone is on same Wi-Fi as Mac, check Metro IP |
