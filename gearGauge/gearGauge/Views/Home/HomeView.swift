//
//  HomeView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI
import SwiftData

struct HomeView: View {
    // MARK: - Dependencies
    
    /// ViewModel that manages gear data and operations
    /// Provides access to primary gear and handles loading/error states
    var gearViewModel: GearViewModel
    
    var body: some View {
        Group {
            if gearViewModel.isLoading {
                // Loading state
                ProgressView("Loading gear...")
            } else if let error = gearViewModel.error {
                // Error state
                ContentUnavailableView(
                    "Unable to load gear",
                    systemImage: "exclamationmark.triangle",
                    description: Text(error.localizedDescription)
                )
            } else if let gear = gearViewModel.primaryGear {
                // Success state - show the gear gauge
                GaugeView(gear: gear)
            } else {
                // Empty state - no primary gear set
                ContentUnavailableView(
                    "No Primary Gear",
                    systemImage: "figure.run",
                    description: Text("Set up your first gear to start tracking.")
                )
            }
        }
        .onAppear {
            // Fetch primary gear when view appears
            gearViewModel.fetchPrimaryGear()
        }
    }
}

// MARK: - Preview

#Preview("With Primary Gear") {
    // Create shared model container for preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create and insert sample gear directly into context
    context.insert(Gear.SampleGear())
    try? context.save()
    
    // Create data store and gear store with the same context
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create ViewModel with mock store
    let viewModel = GearViewModel(gearStore: mockGearStore)
    
    return HomeView(gearViewModel: viewModel)
        .modelContainer(container)
}

#Preview("Empty State") {
    // Create shared model container for preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create data store and gear store with no data
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create ViewModel with empty mock store
    let viewModel = GearViewModel(gearStore: mockGearStore)
    
    return HomeView(gearViewModel: viewModel)
        .modelContainer(container)
}
