//
//  GearListView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI
import SwiftData

struct GearListView: View {
    // MARK: - Dependencies
    
    /// ViewModel that manages gear data and operations
    /// Provides access to all gear items and handles loading/error states
    var gearViewModel: GearViewModel
    
    var body: some View {
        Text(.gear)
        // TODO: Implement gear list UI with gearViewModel
    }
}

#Preview {
    // Create mock data store and services
    let mockDataStore = DataStore(modelContext: SharedModelContainer.create(inMemory: true).mainContext)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create ViewModel with mock store
    let viewModel = GearViewModel(gearStore: mockGearStore)
    
    return GearListView(gearViewModel: viewModel)
        .modelContainer(SharedModelContainer.create(inMemory: true))
}
