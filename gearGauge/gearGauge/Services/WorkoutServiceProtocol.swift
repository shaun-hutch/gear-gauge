//
//  WorkoutServiceProtocol.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

/// A protocol defining the interface for accessing workout data from various providers
@MainActor
protocol WorkoutServiceProtocol {
    /// If background delivery of workout data is available from the data source
    var backgroundDeliveryAvailable: Bool { get }
    
    /// Requests permission to access workout data from the provider
    /// Shows the system authorization sheet to the user
    /// - Throws: An error if the request fails due to device capability issues
    func requestAccess() async throws
    
    /// Fetches all workouts from the data source
    /// Returns empty array if access was denied or no data exists
    /// - Returns: Array of Workout objects from the provider
    /// - Throws: An error if device doesn't support the provider
    func fetchWorkouts() async throws -> [Workout]
    
    /// Observes the data source for new or updated workouts
    /// - Returns: AsyncStream that emits updated workout arrays when changes occur
    func observeWorkouts() -> AsyncStream<[Workout]>
}
