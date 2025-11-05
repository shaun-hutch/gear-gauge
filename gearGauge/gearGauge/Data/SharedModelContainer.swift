//
//  SharedModelContainer.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 05/11/2025.
//

import SwiftData
import Foundation

/// Provides a shared ModelContainer for the application
/// Centralizes SwiftData model configuration and container creation
enum SharedModelContainer {
    /// Creates and returns a ModelContainer configured with the app's data models
    /// - Parameter inMemory: Whether to store data in memory only (useful for testing/previews)
    /// - Returns: Configured ModelContainer for Gear and Workout models
    /// - Throws: Fatal error if container creation fails
    static func create(inMemory: Bool = false) -> ModelContainer {
        let schema = Schema([
            Gear.self,
            Workout.self
        ])
        
        let modelConfiguration = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: inMemory
        )
        
        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }
}


