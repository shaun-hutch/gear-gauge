# gearGauge - UI/UX Overview

## Purpose

**gearGauge** is a fitness gear tracking application that helps runners, cyclists, and walkers monitor the lifespan and usage of their equipment. Users can see how much life remains in their gear and get notified when replacement is needed.

## Key Features

### Gear Management
- Create, edit, and delete fitness gear items with customizable names and types
- Track multiple pieces of equipment simultaneously (premium feature)
- Set maximum distance thresholds for each gear item to determine replacement point
- Mark gear as "primary" to highlight it on the home screen

### Distance Tracking & Visualization
- Displays a circular gauge showing gear usage as a percentage of the maximum distance
- Real-time progress visualization that updates as new workouts are synced
- Primary gear is prominently displayed on the home view with a large gauge
- Secondary gear appears in a list view with individual progress indicators

### HealthKit Integration
- Automatically syncs workouts from Apple HealthKit (running, walking, cycling)
- Intelligently links workouts to appropriate gear based on workout type and date
- Background sync capability to keep data updated when app is backgrounded
- Displays complete workout history linked to each gear item

### Notifications
- Alerts users when workouts have been successfully synced
- Notifications when gear is approaching its replacement threshold

### Free/Premium Model
- **Free Tier**: Track 1 gear item with full functionality
- **Premium Tier**: Unlock multiple gear tracking ($4.99 NZD one-time purchase)

## User Flows

### Primary Gear View (Home Screen)
Users see their most-used gear prominently displayed with:
- Gear name and type
- Large circular progress gauge showing remaining life
- Current distance traveled vs. maximum distance
- Link to recent workouts associated with this gear

### Gear List View
Secondary view showing:
- All tracked gear items in a card-based layout
- Compact progress gauge for each item
- Quick access to edit or delete gear
- Visual indication of which gear is primary

### Workout Sync Flow
- App automatically fetches new workouts from HealthKit on launch
- Workouts are matched to gear based on type and date range
- User receives notification when sync completes
- Synced workouts appear in the workout list associated with relevant gear

### Settings
- Configure HealthKit permissions (read-only access to workout data)
- Manage notification preferences
- Restore premium access
- App information and privacy details

## Visual Design Elements

### Progress Gauge
- Circular gauge displaying gear usage percentage
- Color-coded to show remaining lifespan
- Updates dynamically as workouts are synced

### Gear Cards
- List-based card layout for secondary gear
- Consistent styling with gear type icons
- Primary gear indicator

### Workout List
- Displays all synced workouts linked to specific gear
- Shows workout type, distance, and date
- Grouped by gear item for easy reference
