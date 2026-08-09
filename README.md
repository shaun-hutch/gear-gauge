# gear-gauge

iOS application for users to add and track their gear from recorded workouts.

This repository contains **two implementations** of the app:

| Directory | Description |
|-----------|-------------|
| [`gear-gauge-rn/`](gear-gauge-rn/) | **React Native (Expo)** app — the primary cross-platform implementation |
| [`gearGauge/`](gearGauge/) | **Native iOS (SwiftUI)** app — original implementation, kept for reference and as the source of requirements |

---

## React Native App — `gear-gauge-rn/`

Built with **Expo SDK 57**, **React 19**, and **React Native 0.86**, using Expo Router for navigation. iOS is the primary target platform.

### Requirements

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 24.11.1 | Pinned via `engines` + `.nvmrc` / `.node-version` |
| npm | 11.6.2 | Pinned via `packageManager` + `engines` |

These versions are **enforced** — `npm install` fails if the active Node/npm don't match. To switch automatically:

```bash
# nvm / fnm (reads .nvmrc / .node-version)
nvm use

# or with corepack (reads packageManager)
corepack use npm@11.6.2
```

### Installation

```bash
cd gear-gauge-rn
npm install
```

### Running the app

```bash
# Start Metro (development server)
npx expo start
```

Press `i` for the iOS simulator, or scan the QR code with Expo Go.

### Building for iOS

```bash
cd gear-gauge-rn
npx expo run:ios
```

> Building and deploying to a physical iPhone is covered in [docs/iphone-build-deploy.md](gear-gauge-rn/docs/iphone-build-deploy.md).

### Storybook

Components are developed in isolation with Storybook:

```bash
cd gear-gauge-rn
npm run storybook           # Storybook in Metro
npm run storybook-generate  # regenerate the story registry
```

### Tests & Lint

```bash
cd gear-gauge-rn
npm test       # Jest unit tests
npm run lint   # ESLint (expo lint)
```

---

## iOS App — `gearGauge/`

The original native iOS app written in **Swift** with **SwiftUI**, **SwiftData** (iCloud sync planned), **HealthKit**, and **In-App Purchases**. Kept for reference and requirements.

### Requirements

- macOS with **Xcode** (iOS 26 SDK, e.g. Xcode 26)
- Swift 5.0+, targeting **iOS 26.0**
- A development team / signing identity to run on a physical device

### Open & run

```bash
open gearGauge/gearGauge.xcodeproj
```

Select a target — **Shaun's iPhone**, or the **iPhone 17 Pro** simulator if unavailable — and press **Run** (⌘R).

### Key frameworks

- **SwiftUI** — user interface
- **SwiftData** — local persistence (iCloud sync planned)
- **HealthKit** — read-only access to workout distance/type (`workouts`, `distanceWalkingRunning`, `distanceCycling`)
- **StoreKit / In-App Purchases** — free tier (single gear item) vs. premium one-off purchase

### watchOS

A watchOS companion app is planned as a post-launch feature (targets **watchOS 26**).

### Tests

- `gearGaugeTests` — unit tests for the data model and business logic
- `gearGaugeUITests` — UI tests for the main user flows
- `gearGauge-watch Watch AppTests` / `gearGauge-watch Watch AppUITests` — watchOS app tests

---

## Shared Requirements (both apps)

- Read-only HealthKit access to workout distance and type, with a privacy notice
- Notifications for: workout synced from HealthKit, and gear due for replacement
- Free tier: track a **single** gear item; premium unlocks unlimited gear (**one-off $4.99 NZD**)
- English (NZ) localisation, structured to allow future languages
- Versioned data model with created/modified audit timestamps and migration paths

## Other documentation

- [UI/UX Overview](UI_UX_OVERVIEW.md)
- [React Native design notes](gear-gauge-rn/design/DESIGN.md)

