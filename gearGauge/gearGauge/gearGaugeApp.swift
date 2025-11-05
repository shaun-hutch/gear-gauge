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

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}
	
