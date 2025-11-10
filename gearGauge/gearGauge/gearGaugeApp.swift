//
//  gearGaugeApp.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 02/11/2025.
//

import SwiftUI
import SwiftData

@main
struct gearGaugeApp: App {
    // MARK: - SwiftData Setup
    
    /// Shared model container for SwiftData persistence
    /// Used throughout the app for data storage
    var sharedModelContainer: ModelContainer = SharedModelContainer.create()
    
    // MARK: - Data Layer Setup
    
    /// Computed property: Creates DataStore using the main context from the shared container
    /// This is the data access layer that wraps SwiftData operations
    var dataStore: DataStore {
        DataStore(modelContext: sharedModelContainer.mainContext)
    }
    
    /// Computed property: Creates GearStore using the DataStore
    /// This provides the service layer for gear-related operations
    var gearStore: GearStore {
        GearStore(dataStore: dataStore)
    }
    
    /// Computed property: Creates WorkoutStore using the DataStore
    /// This provides the service layer for workout-related operations
    var workoutStore: WorkoutStore {
        WorkoutStore(dataStore: dataStore)
    }
    
    // MARK: - ViewModel Setup
    
    /// Computed property: Creates GearViewModel with GearStore dependency
    /// This is the view model that coordinates between views and gear data
    var gearViewModel: GearViewModel {
        GearViewModel(gearStore: gearStore)
    }
    
    /// Computed property: Creates WorkoutViewModel with WorkoutStore dependency
    /// This is the view model that coordinates between views and workout data
    var workoutViewModel: WorkoutViewModel {
        WorkoutViewModel(workoutStore: workoutStore)
    }
    
    // MARK: - UI State
    
    @State private var showWelcomeAlert: Bool = false

    var body: some Scene {
        WindowGroup {
            // Pass ViewModels to ContentView for dependency injection
            ContentView(
                gearViewModel: gearViewModel,
                workoutViewModel: workoutViewModel
            )
            .onAppear {
                if (UserDefaultHelpers.firstLaunch()) {
                    showWelcomeAlert = true
                }
            }
            .alert("Welcome", isPresented: $showWelcomeAlert) {
                Button("OK") { showWelcomeAlert = false }
            } message: {
                Text("Welcome to Gear Gauge!")
            }
        }
        .modelContainer(sharedModelContainer)
    }
}
	
