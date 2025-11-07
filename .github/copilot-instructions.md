---
applyTo: '**'
---

# INSTRUCTIONS

- **iOS 26**
- WatchOS 10.6.2
- SwiftUI
- SwiftData
- HealthKit
- In-App Purchases

## General Context
I am creating a fitness gear tracking application in iOS, with the eventual goal of putting in a watchOS app which will use the data from the iOS app.

The iOS/iPadOS version will be targeting iOS 26, where the goal for Apple Watch is watchOS 10.6.2 (the last version that supports Apple Watch SE 1st generation).

## Coding
The code will be done in Swift, using SwiftUI for the UI components. For data storage SwiftData will be used, and eventually use of iCloud sync will be implemented. This will allow for restore when an app is reinstalled, or when moving to a new device.

When you put together any file changes, please explain what is being changed, and have it commented appropriately. Where appropriate too, provide relevant unit testing. If the change constitutes a large overreach, it may be better to break it down into smaller changes. This case may also be a candidte for a UI automation test.

If I am simply asking a question on why something is like what it is, just answer the question directly without suggesting code changes, unless I ask what can I change.

### Testing
Unit tests will be created for the data model and business logic. UI tests will be created for the main user flows.

### Permissions
HealthKit permissions will be requested to read workout data, and possibly other data in the future. The initial stage only requires read access to workout distance and type.

The types I will be requesting access to are:
- HKObjectType.workoutType()
- HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!
- HKObjectType.quantityType(forIdentifier: .distanceCycling)!

There will need to be a privacy notice in the app to inform users what data is being accessed and why, with respect to HealthKit data privacy guidelines.

Eventually I may want to add in workout GPS plotted data, but that will be in a later version.

I also wish to have notifications permission, to notify users when a workout has been synced from HealthKit, and when gear is due for replacement.

Unsure to the extent of this one yet, but I may require a background fetch service to periodically check HealthKit for new workouts. Although I do know HealthKit has an observer query system that can notify the app when new data is available. (This could also be useful for manual syncing on cold launch).

### Data Model
There will be an entity for gear, and one to store workouts from HealthKit.

Each entity will have audit information to denote what version the entity is, with data created and modified timestamps.

Possible extra information: Audit entity for other entity changes to denote what was changed and when.

As I manually put together the strutures of the data model, migration paths will need to be considered for future versions. Ideally the main identity of the structures will not change.

### Localisation
The app will just be localised in English (NZ) - but this keeps the door open for future localisation in other languages. For a quick win I could use AI generated localisation for some languages.

### Paywall
In order to make money off of this app, I will implement a paywall using Apple's in-app purchase system. The app will have a free tier with basic functionality, and a premium tier that unlocks additional features. The free tier will allow for just a single gear item to be tracked, while premium will allow for multiple.

As for the pricing, I will set a one off purchase price for premium access. I feel for such a simple app, a subscription model would be overkill and deter potential users. The purchase price I believe should be $4.99 NZD.
