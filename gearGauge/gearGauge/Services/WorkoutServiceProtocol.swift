//
//  WorkoutServiceProtocol.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

/// A protocol defining the interface for accessing workout data from various providers
@MainActor
protocol WorkoutServiceProtocol {
    /// Indicates if the authorization flow has been completed
    /// Note: Due to provider privacy policies (e.g., HealthKit), this does not
    /// guarantee access was actually granted. Verify by attempting to fetch workouts.
    var hasAccess: Bool { get }
    
    /// If background delivery of workout data is available from the data source
    var backgroundDeliveryAvailable: Bool { get }
    
    /// Requests permission to access workout data from the provider
    /// - Throws: An error if the request fails
    func requestAccess() async throws
    
    /// Fetches all workouts from the data source
    /// - Returns: Array of Workout objects from the provider
    /// - Throws: An error if fetching fails or device doesn't support the provider
    func fetchWorkouts() async throws -> [Workout]
    
    /// Observes the data source for new or updated workouts
    /// - Returns: AsyncStream that emits updated workout arrays when changes occur
    func observeWorkouts() -> AsyncStream<[Workout]>
}
