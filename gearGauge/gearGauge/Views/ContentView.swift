//
//  ContentView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 02/11/2025.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    // MARK: - State
    
    /// Currently selected tab in the TabView
    @State public var selectedTab: Int = 2
    
    // MARK: - ViewModels
    
    /// ViewModel for gear-related operations
    /// Injected from the app level to maintain consistent state
    var gearViewModel: GearViewModel
    
    /// ViewModel for workout-related operations
    /// Injected from the app level to maintain consistent state
    var workoutViewModel: WorkoutViewModel
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Home tab - filled gauge when selected, outline when not
            Tab(value: 0) {
                HomeView(gearViewModel: gearViewModel)
            } label: {
                Label(.tabLabelHome, systemImage: selectedTab == 0 ? "gauge.with.needle.fill" : "gauge.with.needle")
            }
            .accessibilityLabel(.tabLabelHome)
            
            // Gear tab - filled shoe when selected, outline when not
            Tab(value: 1) {
                GearListView(gearViewModel: gearViewModel)
            } label: {
                Label(.tabLabelGear, systemImage: selectedTab == 1 ? "shoe.circle.fill" : "shoe.circle")
            }
            .accessibilityLabel(.tabLabelGear)
            
            // Settings tab - filled gear when selected, outline when not
            Tab(value: 2) {
                SettingsView()
            } label: {
                Label(.tabLabelSettings, systemImage: selectedTab == 2 ? "gearshape.fill" : "gearshape")
            }
            .accessibilityLabel(.tabLabelSettings)
        }
        .accentColor(Color.appTintColor)
        .onChange(of: selectedTab) { oldValue, newValue in
            print("Selected tab changed from \(oldValue) to \(newValue)")
        }
    }
}

#Preview {
    // Create a single in-memory container for the preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create mock stores for preview using the same context
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    let mockWorkoutStore = WorkoutStore(dataStore: mockDataStore)
    
    // Create ViewModels with mock stores
    let gearViewModel = GearViewModel(gearStore: mockGearStore)
    let workoutViewModel = WorkoutViewModel(workoutStore: mockWorkoutStore)
    
    return ContentView(
        gearViewModel: gearViewModel,
        workoutViewModel: workoutViewModel
    )
    .modelContainer(container)
}
