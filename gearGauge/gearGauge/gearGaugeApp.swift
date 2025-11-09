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
    private var sharedModelContainer: ModelContainer = SharedModelContainer.create()
    @State private var showWelcomeAlert: Bool = false

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    if (UserDefaultHelpers.firstLaunch()) {
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
}
	
