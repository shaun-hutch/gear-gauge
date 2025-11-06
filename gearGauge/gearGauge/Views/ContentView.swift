//
//  ContentView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 02/11/2025.
//

import SwiftUI
import SwiftData

struct ContentView: View {
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
        TabView {
            // home
            VStack {
                Text(.home)
            }.tabItem {
                Image(systemName: "gauge.with.needle")
                    .accessibilityLabel(.tabLabelHome)
                Text(.tabLabelHome)
            }
            
            VStack {
                Text(.gear)
            }.tabItem {
                Image(systemName: "shoe.circle")
                    .accessibilityLabel(.tabLabelGear)
                Text(.tabLabelGear)
            }
            
            VStack {
                Text("Settings")
            }.tabItem {
                Image(systemName: "gear")
                    .accessibilityLabel(.tabLabelSettings)
                Text(.tabLabelSettings)
            }
        }
        .accentColor(Color.appTintColor)
        
    }
}

#Preview {
    ContentView()
        .modelContainer(SharedModelContainer.create(inMemory: true))
}
