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
    // Use the shared model container from SharedModelContainer
    var sharedModelContainer: ModelContainer = SharedModelContainer.create()
    
    @State private var showWelcomeAlert: Bool = false

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    if (firstLaunch()) {
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
    
    
    private func firstLaunch() -> Bool {
        print("first launch?")
        // if first app launch
        if UserDefaultsService.getBool(forKey: Constants.hasDoneFirstLaunch) == nil {
            print("setting defaults")
            UserDefaultsService.setDefaults()
            
            return true
        } else { return false }
    }
}
	
