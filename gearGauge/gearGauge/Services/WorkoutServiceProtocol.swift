//
//  WorkoutServiceProtocol.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

/// A provider-agnostic authorization status used by workout services
enum AuthorizationStatus {
    /// The user has not yet been asked for permission
    case notDetermined
    /// The user granted access
    case authorized
    /// The user denied access
    case denied
    /// Access is restricted (e.g. parental controls, enterprise policy)
    case restricted
}

/// A protocol defining the interface for accessing workout data from various providers
@MainActor
protocol WorkoutServiceProtocol {
    /// If the user has granted access to the workout data, or third party provider
    var hasAccess: Bool { get }
    
    /// If background delivery of workout data is available from the data source
    var backgroundDeliveryAvailable: Bool { get }
    
    /// Requests permission to access workout data from the provider
    /// - Throws: An error if the request fails
    func requestAccess() async throws
    
    /// Fetches all workouts from the data source
    /// - Returns: Array of Workout objects from the provider
    /// - Throws: An error if fetching fails or access is denied
    func fetchWorkouts() async throws -> [Workout]
    
    /// Observes the data source for new or updated workouts
    /// - Returns: AsyncStream that emits updated workout arrays when changes occur
    func observeWorkouts() -> AsyncStream<[Workout]>

    /// Returns the current authorization status for the provider
    func authorizationStatus() -> AuthorizationStatus

}
