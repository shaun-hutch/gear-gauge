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
        NavigationStack {
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
            .navigationTitle("GearGauge")
            
        }
    }
    
    func mainView(mainGear: Gear) -> some View {
        VStack {
            gearTitle(title: mainGear.name)
            GaugeView(gear: mainGear)
            distanceLabel(mainGear)
            Spacer()
        }
        .padding(.top, 30)
    }
    
    
    // MARK: Main Views
    func gearTitle(title: String) -> some View {
        VStack {
            Text(title)
                .foregroundStyle(Color.textTintColor(colorScheme))
                .padding(12)
                .background(Capsule().fill(.appTint))
        }
        .padding(.bottom, 10)
    }
    
    func distanceLabel(_ mainGear: Gear) -> some View {
        let unit = UserDefaultHelpers.distanceUnitSuffix
        
        let currentDistanceValue = String(format: "%.0f", mainGear.currentDistance)
        let totalDistanceValue = String(format: "%.0f", mainGear.maxDistance)
        
        return VStack {
            Text("\(currentDistanceValue) \(unit)")
                .foregroundStyle(textTintColor)
                .font(.largeTitle)
                .frame(height: 40)
            Rectangle()
                .fill(Color.textTintColor(colorScheme))
                .frame(height: 5)
                .padding(.horizontal, 50)
            Text("\(totalDistanceValue) \(unit)")
                .foregroundStyle(Color.textTintColor(colorScheme))
                .font(.largeTitle)
                .frame(height: 40)
            
            
        }
        .background(Capsule().fill(.appTint).glassEffect())
        .padding(20)
        
        
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
