//
//  ContentView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 02/11/2025.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    @State public var selectedTab: Int = 0
    
    @Environment(\.modelContext) private var modelContext
    @Query private var gearItems: [Gear]
    
    // Initialize stores using the environment's modelContext
    private var dataStore: DataStoreProtocol {
        DataStore(modelContext: modelContext)
    }
    
    private var gearStore: GearStoreProtocol {
        GearStore(dataStore: dataStore)
    }
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Home tab - filled gauge when selected, outline when not
            Tab(value: 0) {
                HomeView()
            } label: {
                Label(.tabLabelHome, systemImage: selectedTab == 0 ? "gauge.with.needle.fill" : "gauge.with.needle")
            }
            .accessibilityLabel(.tabLabelHome)
            
            // Gear tab - filled shoe when selected, outline when not
            Tab(value: 1) {
                GearListView()
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
    ContentView()
        .modelContainer(SharedModelContainer.create(inMemory: true))
}
