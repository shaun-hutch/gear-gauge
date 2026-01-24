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
        
        // create card list of gear items
        VStack {
            AppTitleView()
            List {
                ForEach (gearViewModel.allGear) { gear in
                    GearListCard(gear: gear)
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
        }
        .onAppear {
            gearViewModel.fetchAllGear()
        }
        // TODO: Implement gear list UI with gearViewModel
    }
}

#Preview {
    /// Create shared model container for preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create and insert sample gear directly into context
    context.insert(Gear.SampleGear())
    context.insert(Gear.SampleGear())
    try? context.save()
    
    // Create data store and gear store with the same context
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create ViewModel with mock store
    let viewModel = GearViewModel(gearStore: mockGearStore)
    
    return GearListView(gearViewModel: viewModel)
        .modelContainer(container)
}
