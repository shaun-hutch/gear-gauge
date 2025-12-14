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
    
    /// flag to determine if to show the new gear sheet
    @State private var newGear = false
    
    @Environment(\.colorScheme) var colorScheme
    
    private var textTintColor: Color {
        Color.textTintColor(colorScheme)
    }
    
    var body: some View {
        Group {
            if gearViewModel.isLoading {
                // Loading state
                ProgressView("Loading gear...")
            } else if let error = gearViewModel.error {
                errorView(error: error.localizedDescription)
            } else if let gear = gearViewModel.primaryGear {
                // Success state - show the gear gauge
                mainView(mainGear: gear)
            } else {
                emptyView
            }
        }
        .onAppear {
            // Fetch primary gear when view appears
            gearViewModel.fetchPrimaryGear()
        }
        .sheet(isPresented: $newGear) {
            EditGearView(gearViewModel: gearViewModel)
        }
        
        
    }
    
    func mainView(mainGear: Gear) -> some View {
        GeometryReader { geometry in
            ZStack {
                VStack(spacing: 20) {
                    gearTitle(title: mainGear.name, type: mainGear.type)
                    
                    GaugeView(gear: mainGear)
                    
                    // element to keep GaugeView centered in VStack
                    Rectangle()
                        .frame(height: 50)
                        .padding(4)
                        .hidden()
                }
                .offset(y: geometry.safeAreaInsets.bottom / 2)
                
                VStack {
                    AppTitleView()
                    Spacer()
                }
            }
        }
    }
        
    
    
    // MARK: Main Views
    func gearTitle(title: String, type: GearType) -> some View {
        GearTitleView(type: type, name: title)
    }
    
    
    
    
    // MARK: Content Unavailable Views
    
    func errorView(error: String) -> some View {
        ContentUnavailableView(
            "Unable to load gear",
            systemImage: "exclamationmark.triangle",
            description: Text(error)
            
        )
    }
    
    var emptyView: some View {
        ContentUnavailableView {
            Label("No Primary Gear", systemImage: "figure.run")
                .tint(.appTint)
        } description: {
            Text("Set up your first gear to start tracking.")
        } actions: {
            Button(action: {
                newGear = true
            }) {
                HStack {
                    Image(systemName: "plus")
                    Text("Add Gear")
                }
            }
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
